import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, ShieldCheck, Linkedin, CheckCircle2, Loader2, KeyRound } from 'lucide-react';
import { AnimatedBackground } from '../components/common/AnimatedBackground';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); // 'admin', 'landowner', 'vehicle'
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null); // 'google' | 'linkedin' | null
  const [errorMsg, setErrorMsg] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      setLoading(true);
      let userData = null;
      if (login) {
        userData = await login(email, password);
      }
      setAuthSuccess(`Signed in successfully! Redirecting to dashboard...`);
      setTimeout(() => {
        const userRole = (userData?.role || '').toUpperCase();
        if (userRole === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (userRole === 'LANDOWNER') {
          navigate('/dashboard/landowner');
        } else {
          navigate('/dashboard/vehicle-owner');
        }
      }, 800);
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider) => {
    try {
      setSocialLoading(provider);
      if (socialLogin) {
        await socialLogin(provider, role);
      }
      setAuthSuccess(`Authenticated via ${provider === 'google' ? 'Google' : 'LinkedIn'}! Redirecting...`);
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      console.error('Social login error:', err);
    } finally {
      setSocialLoading(null);
    }
  };

  const fillDemoAccount = (demoRole) => {
    setRole(demoRole);
    if (demoRole === 'landowner') {
      setEmail('sanjay@landowner.com');
      setPassword('password123');
    } else if (demoRole === 'vehicle') {
      setEmail('rahul@driver.com');
      setPassword('password123');
    } else {
      setEmail('admin@tenlea.com');
      setPassword('password123');
    }
  };

  return (
    <AnimatedBackground variant="glow" className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-3xl card-silver-rim overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-2xl relative my-8 mx-auto">
        
        {/* Left Column - Branding & Info */}
        <div className="md:col-span-5 p-8 bg-zinc-950/95 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800">
          <div>
            <Logo variant="dark" size="md" showTagline={true} />
            
            <div className="mt-10 space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full silver-badge inline-block">
                Secure Account Access
              </span>
              <h3 className="text-2xl font-bold font-display leading-tight">
                Welcome Back to <br />
                <span className="gradient-text-silver">TENLEA</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Sign in to manage listed land plots, track active vehicle rentals, view digital agreements, and process Razorpay payouts.
              </p>
            </div>

            {/* Quick Demo Fill Buttons */}
            <div className="mt-8 pt-6 border-t border-zinc-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2">
                Quick Demo Auto-Fill:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('landowner')}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-[10px] text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
                >
                  🏡 Landowner
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('vehicle')}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-[10px] text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
                >
                  🚗 Vehicle Owner
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('admin')}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-[10px] text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
                >
                  🛡️ Admin
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800 flex items-center gap-2 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted OAuth 2.0 &amp; JWT Security</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-zinc-900/90 relative">
          
          {authSuccess && (
            <div className="absolute top-4 left-4 right-4 p-3 rounded-2xl bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-2xl z-20 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">Sign In</h2>
            <p className="text-xs text-zinc-400 mt-1">Choose a single sign-on option or use your email</p>
          </div>

          {/* Social Login Buttons: Google & LinkedIn */}
          <div className="space-y-3 mb-6">
            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={() => handleSocialSignIn('google')}
              disabled={!!socialLoading}
              className="w-full py-3 px-4 rounded-2xl bg-zinc-950 border border-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-3 hover:bg-zinc-800 hover:border-zinc-500 transition-all shadow-md group disabled:opacity-50"
            >
              {socialLoading === 'google' ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            {/* LinkedIn Sign-In Button */}
            <button
              type="button"
              onClick={() => handleSocialSignIn('linkedin')}
              disabled={!!socialLoading}
              className="w-full py-3 px-4 rounded-2xl bg-[#0A66C2]/15 border border-[#0A66C2]/40 text-white font-bold text-xs flex items-center justify-center gap-3 hover:bg-[#0A66C2]/25 hover:border-[#0A66C2] transition-all shadow-md disabled:opacity-50"
            >
              {socialLoading === 'linkedin' ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#0A66C2]" />
              ) : (
                <Linkedin className="w-4 h-4 text-[#0A66C2] shrink-0" />
              )}
              <span>Continue with LinkedIn</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-zinc-800 w-full"></div>
            <span className="bg-zinc-900 px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">
              Or Sign In With Email
            </span>
            <div className="border-t border-zinc-800 w-full"></div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            
            {/* Role Switcher */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Select Role</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('landowner')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    role === 'landowner'
                      ? 'btn-silver-primary text-zinc-950'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Landowner
                </button>
                <button
                  type="button"
                  onClick={() => setRole('vehicle')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    role === 'vehicle'
                      ? 'btn-silver-primary text-zinc-950'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Vehicle Owner
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    role === 'admin'
                      ? 'btn-silver-primary text-zinc-950'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-300">Password</label>
                <a href="#" className="text-[10px] text-zinc-400 hover:text-white transition-colors">Forgot Password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 text-xs"
                />
              </div>
            </div>
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 mt-2 shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
              ) : (
                <>
                  <span>Sign In to TENLEA</span>
                  <ArrowRight className="w-4 h-4 text-zinc-950" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-400 mt-6">
            Don’t have an account yet?{' '}
            <Link to="/register" className="font-bold text-white hover:underline">
              Register Here
            </Link>
          </p>
        </div>

      </div>
    </AnimatedBackground>
  );
};
