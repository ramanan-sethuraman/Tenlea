import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, User, LogOut, LayoutDashboard, PlusCircle, Car, ShieldCheck, ChevronDown, RefreshCw, ShieldAlert, Settings as SettingsIcon } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, switchRole } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'How TENLEA Works', path: '/how-it-works' },
    { name: 'Why TENLEA', path: '/why-tenlea' },
    { name: 'Agreements', path: '/agreement-generator' },
    { name: 'Benefits', path: '/benefits' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const getDashboardPath = (role) => {
    const r = (role || '').toLowerCase();
    if (r.includes('admin')) return '/admin/dashboard';
    if (r.includes('land') || r === 'landowner') return '/dashboard/landowner';
    return '/dashboard/vehicle-owner';
  };

  const handleLogout = () => {
    if (logout) logout();
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  const handleRoleChange = (targetRole) => {
    if (switchRole) switchRole(targetRole);
    setProfileDropdownOpen(false);
    navigate(getDashboardPath(targetRole));
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav-scrolled py-2.5' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Logo variant="dark" size="md" />

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 sm:space-x-1.5">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
                  className={`px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-zinc-800/90 text-white border border-zinc-700/80 shadow-lg backdrop-blur-md font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar / User Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              /* Logged In State with Clean Three-Lines Menu Button (No DP) */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-white border border-white text-zinc-950 shadow-xl transition-all focus:outline-none"
                  aria-label="User Menu"
                >
                  {/* Three Lines / Hamburger Icon */}
                  <Menu className="w-5 h-5 text-zinc-950" />
                  
                  <div className="flex flex-col text-left leading-tight max-w-[150px]">
                    <span className="text-xs font-extrabold text-zinc-950 truncate">
                      {user.fullName || user.name || 'Ryan'}
                    </span>
                    <span className="text-[9px] text-zinc-700 font-extrabold uppercase mt-0.5 flex items-center gap-1">
                      <span className="text-zinc-600 font-mono font-medium lowercase text-[9px]">
                        @{user.username || (user.name || 'ryan').toLowerCase().replace(/\s+/g, '')}
                      </span>
                      <span className="text-zinc-400">•</span>
                      <span className={`font-bold ${user.role === 'LANDOWNER' ? 'text-blue-400' : user.role === 'ADMIN' ? 'text-emerald-400' : 'text-amber-500'}`}>
                        {user.role || 'LANDOWNER'}
                      </span>
                    </span>
                  </div>

                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-800 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile & Dashboard Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-4 z-50 text-left animate-fade-in backdrop-blur-xl">
                    {/* User Header */}
                    <div className="pb-3 border-b border-zinc-800">
                      <h4 className="text-sm font-bold text-white truncate">
                        {user.fullName || user.name || 'Sanjay'}
                      </h4>
                      <p className="text-xs text-amber-400 font-mono font-medium">
                        @{user.username || (user.name || 'sanjay').toLowerCase().replace(/\s+/g, '')}
                      </p>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">{user.email || 'sanjay@landowner.com'}</p>
                      <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-md text-[9px] font-extrabold border ${
                        user.role === 'LANDOWNER'
                          ? 'bg-blue-950 text-blue-300 border-blue-800'
                          : user.role === 'ADMIN'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}>
                        {user.role === 'LANDOWNER' ? '🏡 LANDOWNER' : user.role === 'ADMIN' ? '🛡️ ADMIN' : '🚗 VEHICLE_OWNER'}
                      </span>
                    </div>

                    {/* Navigation Items */}
                    <div className="py-2 space-y-1 border-b border-zinc-800">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate(getDashboardPath(user.role));
                        }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-900 flex items-center gap-2.5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                        <span>
                          {user.role === 'LANDOWNER' ? 'Landowner Dashboard' : user.role === 'ADMIN' ? 'Admin Dashboard' : 'Vehicle Owner Dashboard'}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate('/add-land');
                        }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-900 flex items-center gap-2.5 transition-colors"
                      >
                        <PlusCircle className="w-4 h-4 text-blue-400" />
                        <span>List Vacant Land Plot</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate('/my-vehicles');
                        }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-900 flex items-center gap-2.5 transition-colors"
                      >
                        <Car className="w-4 h-4 text-purple-400" />
                        <span>My Registered Vehicles</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate('/agreement-generator');
                        }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-900 flex items-center gap-2.5 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>KYC &amp; Agreement Generator</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate('/settings');
                        }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-900 flex items-center gap-2.5 transition-colors"
                      >
                        <SettingsIcon className="w-4 h-4 text-cyan-400" />
                        <span>Settings</span>
                      </button>
                    </div>

                    {/* Role Switcher Drawer (Hidden for ADMIN users) */}
                    {user?.role !== 'ADMIN' && (
                      <div className="py-2.5 border-b border-zinc-800">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5 px-1">
                          Switch View Mode:
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => handleRoleChange('LANDOWNER')}
                            className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                              user.role === 'LANDOWNER'
                                ? 'bg-blue-600 text-white shadow-lg border border-blue-500 font-extrabold'
                                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                            }`}
                          >
                            🏡 Landowner
                          </button>
                          <button
                            onClick={() => handleRoleChange('VEHICLE_OWNER')}
                            className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                              user.role === 'VEHICLE_OWNER'
                                ? 'bg-purple-600 text-white shadow-lg border border-purple-500 font-extrabold'
                                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                            }`}
                          >
                            🚗 Vehicle Owner
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Sign Out Button */}
                    <div className="pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 flex items-center gap-2.5 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Logged Out State */
              <button
                onClick={() => navigate('/login')}
                className="btn-silver-secondary px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:scale-105 transition-all"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800 px-4 pt-4 pb-6 mt-3 space-y-4">
          
          {user && (
            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between mb-2">
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">{user.name || 'Ryan'}</span>
                <span className="text-[10px] text-zinc-400 block truncate">{user.email || 'ryan@tenlea.com'}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-md bg-amber-950 text-amber-300 text-[9px] font-extrabold border border-amber-800 shrink-0">
                🛡️ {user.role || 'ADMIN'}
              </span>
            </div>
          )}

          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                }}
                className="text-zinc-200 hover:text-white font-medium text-base py-2 border-b border-zinc-800"
              >
                {link.name}
              </Link>
            ))}

            {user && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(getDashboardPath(user.role));
                }}
                className="text-amber-400 font-bold text-base py-2 border-b border-zinc-800 text-left flex items-center gap-2"
              >
                <LayoutDashboard className="w-5 h-5 text-amber-400" />
                <span>Admin Dashboard</span>
              </button>
            )}
          </div>

          <div className="pt-2 flex flex-col gap-3">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-center py-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 font-bold text-sm"
              >
                Sign Out
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full text-center py-2.5 rounded-xl btn-silver-secondary font-semibold text-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/register');
                  }}
                  className="w-full text-center py-2.5 rounded-xl btn-silver-primary text-zinc-950 font-bold text-sm"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
