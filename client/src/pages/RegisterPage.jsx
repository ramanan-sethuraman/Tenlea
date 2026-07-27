import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, ArrowRight, ShieldCheck, Check, Linkedin, Loader2 } from 'lucide-react';

export const RegisterPage = () => {
  const [role, setRole] = useState('VEHICLE_OWNER'); // VEHICLE_OWNER or LANDOWNER
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [socialLoading, setSocialLoading] = useState(null);
  const navigate = useNavigate();
  const { registerUser, socialLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (registerUser) {
      await registerUser({ name, email, phone, password, role });
    }
    navigate('/');
  };

  const handleSocialRegister = async (provider) => {
    try {
      setSocialLoading(provider);
      if (socialLogin) {
        await socialLogin(provider, role);
      }
      navigate('/');
    } catch (err) {
      console.error('Social register error:', err);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-3xl card-silver-rim overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-2xl">
        
        {/* Left Banner */}
        <div className="md:col-span-5 p-8 bg-zinc-950/95 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800">
          <div>
            <Logo variant="dark" size="md" showTagline={true} />
            <div className="mt-10 space-y-4">
              <h3 className="text-2xl font-bold font-display leading-tight">
                Create Your <br />
                <span className="gradient-text-silver">TENLEA Account</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Connect with verified landowners and vehicle owners across India with digital agreements &amp; escrow safety.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800 space-y-2 text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-slate-300" />
              <span>Contactless QR Check-In</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-slate-300" />
              <span>Escrow Payment Guarantee</span>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-zinc-900/90">
          <div className="mb-4">
            <h2 className="text-2xl font-bold font-display text-white">Create Account</h2>
            <p className="text-xs text-zinc-400">Select your role to get started</p>
          </div>

          {/* Social Sign Up Options */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => handleSocialRegister('google')}
              disabled={!!socialLoading}
              className="py-2.5 px-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
            >
              {socialLoading === 'google' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
              ) : (
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>Google Sign Up</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialRegister('linkedin')}
              disabled={!!socialLoading}
              className="py-2.5 px-3 rounded-xl bg-[#0A66C2]/15 border border-[#0A66C2]/40 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#0A66C2]/25 transition-colors"
            >
              {socialLoading === 'linkedin' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0A66C2]" />
              ) : (
                <Linkedin className="w-3.5 h-3.5 text-[#0A66C2] shrink-0" />
              )}
              <span>LinkedIn Sign Up</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-4">
            <div className="border-t border-zinc-800 w-full"></div>
            <span className="bg-zinc-900 px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">
              Or Manual Registration
            </span>
            <div className="border-t border-zinc-800 w-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* Selection Cards */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('VEHICLE_OWNER')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  role === 'VEHICLE_OWNER'
                    ? 'btn-silver-primary text-zinc-950'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                }`}
              >
                <div className="text-xs font-bold mb-0.5">I need parking</div>
                <div className={role === 'VEHICLE_OWNER' ? 'text-[10px] text-zinc-800 font-semibold' : 'text-[10px] text-zinc-500'}>Vehicle Owner</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('LANDOWNER')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  role === 'LANDOWNER'
                    ? 'btn-silver-primary text-zinc-950'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                }`}
              >
                <div className="text-xs font-bold mb-0.5">I have space to rent</div>
                <div className={role === 'LANDOWNER' ? 'text-[10px] text-zinc-800 font-semibold' : 'text-[10px] text-zinc-500'}>Landowner</div>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="ramesh@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 mt-2"
            >
              <span>Register Account</span>
              <ArrowRight className="w-4 h-4 text-zinc-950" />
            </button>
          </form>

          <p className="text-center text-xs text-zinc-400 mt-3">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-white hover:underline">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
