export interface RazorpayOrder {
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  key_id: string;
  error?: string;
}

export interface RazorpayVerification {
  success: boolean;
  error?: string;
  transaction?: any;
}

export const paymentService = {
  /**
   * Securely requests the server-side backend / Cloud functions to create a new Razorpay order.
   * @param amount The top-up amount in INR (rupees).
   */
  async createOrder(amount: number): Promise<RazorpayOrder> {
    const res = await fetch('/api/wallet/razorpay/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, purpose: 'deposit' }),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${res.status}`);
    }
    
    return res.json();
  },

  /**
   * Verifies the Razorpay payment signature securely on the server side.
   */
  async verifyPayment(params: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    amount: number;
  }): Promise<RazorpayVerification> {
    const res = await fetch('/api/wallet/razorpay/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: params.razorpay_order_id,
        razorpay_payment_id: params.razorpay_payment_id,
        razorpay_signature: params.razorpay_signature,
        amount: params.amount,
        purpose: 'deposit'
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${res.status}`);
    }

    return res.json();
  }
};
