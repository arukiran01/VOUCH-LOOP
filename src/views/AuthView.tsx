import React, { useState, useEffect } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, CheckCircle } from 'lucide-react';
import { INITIAL_USERS } from '../data/mockData';

interface AuthViewProps {
  mode: 'login' | 'signup';
  setMode: (mode: 'login' | 'signup') => void;
  onLoginSuccess: (user: any) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function AuthView({ mode, setMode, onLoginSuccess, showToast }: AuthViewProps) {
  // Separate states for Sign In Form
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Separate states for Sign Up / Register Form
  const [nameRegister, setNameRegister] = useState('');
  const [emailRegister, setEmailRegister] = useState('');
  const [passwordRegister, setPasswordRegister] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

  // Clear errors when mode changes
  useEffect(() => {
    setLoginError(null);
    setRegisterError(null);
    setRegisterSuccess(null);
  }, [mode]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailLogin.trim() || !passwordLogin) {
      setLoginError('Please enter both email and password.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLogin.trim())) {
      setLoginError('Please enter a valid email address.');
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLogin.trim(), password: passwordLogin })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Save to local storage for automatic login
        const savedUserObj = { ...data.user, savedPassword: passwordLogin };
        localStorage.setItem('vouchloop_saved_session', JSON.stringify(savedUserObj));
        
        showToast(data.message || `Welcome back, ${data.user.name}!`, 'success');
        onLoginSuccess(data.user);
      } else {
        throw new Error(data.error || 'Invalid email or password.');
      }
    } catch (err) {
      // Offline fallback: check localStorage or INITIAL_USERS
      const currentUsersStr = localStorage.getItem('vouchloop_users');
      let currentUsers = currentUsersStr ? JSON.parse(currentUsersStr) : INITIAL_USERS;
      if (!currentUsersStr) {
        localStorage.setItem('vouchloop_users', JSON.stringify(INITIAL_USERS));
      }

      const matchUser = currentUsers.find((u: any) => u.email.toLowerCase() === emailLogin.trim().toLowerCase());
      if (matchUser) {
        // Password logic simulation: accept password123 or whatever they provide
        const savedUserObj = { ...matchUser, savedPassword: passwordLogin };
        localStorage.setItem('vouchloop_saved_session', JSON.stringify(savedUserObj));
        showToast(`Simulated Session: Welcome back, ${matchUser.name}!`, 'success');
        onLoginSuccess(matchUser);
      } else {
        setLoginError('No local user matched with this email. Please check your credentials or create a new account.');
        showToast('Authentication failed.', 'error');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameRegister.trim() || !emailRegister.trim() || !passwordRegister) {
      setRegisterError('Please fill in all registration fields.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailRegister.trim())) {
      setRegisterError('Please enter a valid email address.');
      return;
    }
    if (passwordRegister.length < 6) {
      setRegisterError('Password should be at least 6 characters.');
      return;
    }

    setRegisterLoading(true);
    setRegisterError(null);
    setRegisterSuccess(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: nameRegister.trim(), 
          email: emailRegister.trim(), 
          password: passwordRegister 
        })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Save to local storage for automatic login
        const savedUserObj = { ...data.user, savedPassword: passwordRegister };
        localStorage.setItem('vouchloop_saved_session', JSON.stringify(savedUserObj));
        
        showToast(data.message || 'Account created successfully! Received ₹5,000 starting wallet credit.', 'success');
        onLoginSuccess(data.user);
      } else {
        throw new Error(data.error || 'Registration failed.');
      }
    } catch (err) {
      // Offline fallback signup
      const currentUsersStr = localStorage.getItem('vouchloop_users');
      let currentUsers = currentUsersStr ? JSON.parse(currentUsersStr) : [...INITIAL_USERS];
      
      const emailExists = currentUsers.some((u: any) => u.email.toLowerCase() === emailRegister.trim().toLowerCase());
      if (emailExists) {
        // Automatically check them into their pre-seeded profile instead of blocking them!
        const matchUser = currentUsers.find((u: any) => u.email.toLowerCase() === emailRegister.trim().toLowerCase());
        const savedUserObj = { ...matchUser, savedPassword: passwordRegister };
        localStorage.setItem('vouchloop_saved_session', JSON.stringify(savedUserObj));
        showToast(`Welcome back, ${matchUser.name}! (Simulated auto-login)`, 'success');
        onLoginSuccess(matchUser);
      } else {
        const newUserObj = {
          id: `usr-${Date.now()}`,
          name: nameRegister.trim(),
          email: emailRegister.trim(),
          role: 'user',
          balance: 5000,
          kycStatus: 'verified' // Pre-verified client logic easily
        };
        currentUsers.push(newUserObj);
        localStorage.setItem('vouchloop_users', JSON.stringify(currentUsers));

        const savedUserObj = { ...newUserObj, savedPassword: passwordRegister };
        localStorage.setItem('vouchloop_saved_session', JSON.stringify(savedUserObj));

        showToast('Account registered successfully! Received ₹5,000 starting wallet credit inside simulation.', 'success');
        onLoginSuccess(newUserObj);
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans bg-[#fbfbfd]">
      
      {/* Main Single unified Authentication Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm max-w-sm w-full overflow-hidden flex flex-col">
        
        {/* Simple minimal header tab bar */}
        <div className="flex border-b border-zinc-100 bg-zinc-50/50 p-1">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-center rounded-lg font-bold text-xs transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200/50'
                : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
            }`}
          >
            Sign In
          </button>
          
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-3 text-center rounded-lg font-bold text-xs transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200/50'
                : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Inner Card content container */}
        <div className="p-6 space-y-5 text-left">
          
          {mode === 'login' ? (
            /* SIMPLE LOGIN MODULE */
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-zinc-900">
                  Welcome back
                </h2>
                <p className="text-[11.5px] text-zinc-500 mt-1 leading-relaxed">
                  Sign in with your email address to access your vouchers and wallet balance.
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-150 text-red-800 text-[11px] font-semibold rounded-lg flex gap-1.5 items-start">
                  <span>⚠️</span>
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 block uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={emailLogin}
                      onChange={(e) => setEmailLogin(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      required
                      disabled={loginLoading}
                      className="w-full bg-white border border-zinc-200 text-zinc-805 text-xs pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-zinc-500 font-medium transition-colors"
                    />
                    <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-2.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-zinc-500 block uppercase tracking-wider">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      value={passwordLogin}
                      onChange={(e) => setPasswordLogin(e.target.value)}
                      placeholder="Enter account password"
                      required
                      disabled={loginLoading}
                      className="w-full bg-white border border-zinc-200 text-zinc-805 text-xs pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-zinc-500 font-medium transition-colors"
                    />
                    <Lock className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-2.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-850 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-5"
                >
                  {loginLoading ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  onClick={() => setMode('signup')}
                  className="text-[11px] text-zinc-500 hover:text-zinc-800 transition-colors font-semibold"
                >
                  Don't have an account? <span className="underline font-bold text-zinc-950">Sign up</span>
                </button>
              </div>
            </div>
          ) : (
            /* SIMPLE SIGNUP MODULE */
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-zinc-900">
                  Join VouchLoop
                </h2>
                <p className="text-[11.5px] text-zinc-500 mt-1 leading-relaxed">
                  Create an account to start trading vouchers. Receive an instant starting credit of ₹5,000 in your wallet.
                </p>
              </div>

              {registerError && (
                <div className="p-3 bg-red-50 border border-red-150 text-red-800 text-[11px] font-semibold rounded-lg flex gap-1.5 items-start">
                  <span>⚠️</span>
                  <span>{registerError}</span>
                </div>
              )}

              {registerSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-800 text-[11px] font-semibold rounded-lg flex gap-2 items-start">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>{registerSuccess}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 block uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={nameRegister}
                      onChange={(e) => setNameRegister(e.target.value)}
                      placeholder="e.g. Aruna Kiran Reddy"
                      required
                      disabled={registerLoading}
                      className="w-full bg-white border border-zinc-200 text-zinc-805 text-xs pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-zinc-500 font-medium transition-colors"
                    />
                    <UserIcon className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-2.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 block uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={emailRegister}
                      onChange={(e) => setEmailRegister(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      required
                      disabled={registerLoading}
                      className="w-full bg-white border border-zinc-200 text-zinc-805 text-xs pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-zinc-500 font-medium transition-colors"
                    />
                    <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-2.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 block uppercase tracking-wider">
                    Choose Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={passwordRegister}
                      onChange={(e) => setPasswordRegister(e.target.value)}
                      placeholder="Minimum 6 characters long"
                      required
                      disabled={registerLoading}
                      className="w-full bg-white border border-zinc-200 text-zinc-805 text-xs pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-zinc-500 font-medium transition-colors"
                    />
                    <Lock className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-2.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={registerLoading}
                  className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-850 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-5"
                >
                  {registerLoading ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  onClick={() => setMode('login')}
                  className="text-[11px] text-zinc-500 hover:text-zinc-800 transition-colors font-semibold"
                >
                  Already have an account? <span className="underline font-bold text-zinc-950">Sign in</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
