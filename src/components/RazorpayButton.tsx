import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { paymentService } from '../services/paymentService';
import { ShieldCheck, Loader2 } from 'lucide-react';

interface RazorpayButtonProps {
  amount: number;
  user: {
    name: string;
    email: string;
  } | null;
  onSuccess?: (transaction: any) => void;
  onFailure?: (errorMsg: string) => void;
  onCancel?: () => void;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  amount,
  user,
  onSuccess,
  onFailure,
  onCancel,
  className = '',
  disabled = false,
  children,
}) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      addToast('Please login to make a payment', 'error');
      return;
    }

    if (amount <= 0 || isNaN(amount)) {
      addToast('Please enter a valid amount', 'error');
      return;
    }

    setLoading(true);
    addToast('Opening Razorpay gateway...', 'info');

    try {
      // 1. Create order securely through API endpoint
      const orderData = await paymentService.createOrder(amount);

      if (!orderData || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment order.');
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "VouchLoop",
        description: "Secure Wallet Top-up",
        image: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg",
        order_id: orderData.orderId,
        handler: async (response: any) => {
          setLoading(true);
          addToast('Verifying your payment securely...', 'info');

          try {
            // 2. Perform backend crypto signature verification
            const verifyResult = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature || 'simulated_sig',
              amount: amount,
            });

            if (verifyResult.success) {
              addToast('Payment credited to wallet successfully!', 'success');
              if (onSuccess) {
                onSuccess(verifyResult.transaction);
              }
            } else {
              throw new Error(verifyResult.error || 'Signature check failed.');
            }
          } catch (err: any) {
            const errorMsg = err.message || 'Payment verification failed.';
            addToast(errorMsg, 'error');
            if (onFailure) onFailure(errorMsg);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            addToast('Transaction cancelled by user.', 'info');
            if (onCancel) onCancel();
          },
        },
      };

      // Test Mode Simulation fallback (for instant virtual testing without window Razorpay)
      if (orderData.orderId.startsWith('order_sim_')) {
        setTimeout(() => {
          options.handler({
            razorpay_payment_id: 'pay_sim_' + Date.now(),
            razorpay_order_id: orderData.orderId,
            razorpay_signature: 'sim_sig',
          });
        }, 1200);
        return;
      }

      // Open actual Razorpay iframe checkout modal
      // @ts-ignore
      if (window.Razorpay) {
        // @ts-ignore
        const rzp = new window.Razorpay(options);
        
        rzp.on('payment.failed', (response: any) => {
          const failureMsg = response.error?.description || 'Payment transaction failed.';
          addToast(`Payment failed: ${failureMsg}`, 'error');
          if (onFailure) onFailure(failureMsg);
          setLoading(false);
        });

        rzp.open();
      } else {
        throw new Error('Razorpay client SDK is failing to load. Please try again.');
      }

    } catch (error: any) {
      const errorMsg = error.message || 'An error occurred during checkout setup.';
      addToast(errorMsg, 'error');
      if (onFailure) onFailure(errorMsg);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || loading}
      className={`relative justify-center items-center gap-2 transition-all p-3 rounded-lg font-bold flex ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Securing Gateway...</span>
        </>
      ) : (
        children || (
          <>
            <ShieldCheck className="w-5 h-5" />
            <span>Pay ₹{amount.toFixed(2)} with Razorpay</span>
          </>
        )
      )}
    </button>
  );
};
