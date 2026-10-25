import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AnimatedBackground } from '../components/common/AnimatedBackground';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Bell, 
  PlaySquare, 
  Download, 
  Shield, 
  Link2, 
  CreditCard, 
  Sliders, 
  Check, 
  Key, 
  Save, 
  Smartphone, 
  Mail, 
  Globe, 
  Database, 
  Lock, 
  Tv, 
  Volume2, 
  HardDrive, 
  Trash2, 
  CheckCircle2, 
  RefreshCw,
  Eye,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const SettingsPage = () => {
  const { user, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [savedSuccess, setSavedSuccess] = useState('');

  // Form states
  const [accountData, setAccountData] = useState({
    name: user?.fullName || user?.name || 'Ryan',
    username: user?.username || (user?.name || 'ryan').toLowerCase().replace(/\s+/g, ''),
    email: user?.email || 'ryan@tenlea.com',
    phone: user?.phone || '+91 98765 43210',
    role: user?.role || 'ADMIN',
    aadhaarNumber: 'XXXX-XXXX-8821',
    panNumber: 'ABCDE1234F',
    emergencyContact: '+91 91234 56789'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailBookings: true,
    emailAgreements: true,
    smsOtp: true,
    whatsappAlerts: true,
    marketingUpdates: false,
  });

  const [performanceSettings, setPerformanceSettings] = useState({
    mapRenderer: 'embed', // 'embed' or 'store-locator'
    autoRefreshInterval: '30',
    ambientGlow: true,
    tourQuality: '1080p',
  });

  const [privacySettings, setPrivacySettings] = useState({
    publicListing: true,
    hideCoordinatesUntilBooking: true,
    analyticsSharing: false,
  });

  const [billingSettings, setBillingSettings] = useState({
    upiId: 'tenlea.escrow@okicici',
    bankAccount: 'HDFC Bank •••• 4421',
    payoutSchedule: 'Instant Escrow Release',
  });

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'performance', label: 'Playback and performance', icon: PlaySquare },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'connected', label: 'Connected apps', icon: Link2 },
    { id: 'billing', label: 'Billing and payments', icon: CreditCard },
    { id: 'advanced', label: 'Advanced settings', icon: Sliders },
  ];

  const handleSave = (tabName) => {
    setSavedSuccess(`${tabName} updated successfully!`);
    setTimeout(() => setSavedSuccess(''), 3000);
  };

  const handleSaveAccountDetails = () => {
    const cleanUsername = (accountData.username || accountData.name).toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (updateUserProfile) {
      updateUserProfile({
        name: accountData.name,
        fullName: accountData.name,
        username: cleanUsername,
        email: accountData.email,
        phone: accountData.phone,
      });
    }
    handleSave('Account Details & Profile Name');
  };

  return (
    <AnimatedBackground variant="glow" className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between">
      <div className="no-print">
        <Navbar />
      </div>

      <main className="grow pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-white tracking-tight">Settings</h1>
          <p className="text-xs text-zinc-400 mt-1">Manage your account preferences, security, playback &amp; platform integrations</p>
        </div>

        {/* Save Confirmation Banner */}
        {savedSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in shadow-xl">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{savedSuccess}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">STATUS 200 OK</span>
          </div>
        )}

        {/* Settings Layout: Left Sidebar + Right Content Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Menu (Matching Uploaded Design) */}
          <div className="lg:col-span-4 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-1">
            <div className="px-3 py-2 text-xs font-extrabold uppercase tracking-widest text-zinc-500 mb-2">
              Settings Menu
            </div>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left transition-all duration-200 flex items-center justify-between px-4 py-3 rounded-2xl text-sm ${
                    isActive
                      ? 'bg-zinc-800 text-white font-bold shadow-md border border-zinc-700/60'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/40 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {isActive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
                </button>
              );
            })}
          </div>

          {/* Right Pane Content Area */}
          <div className="lg:col-span-8 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl min-h-[520px] flex flex-col justify-between">
            
            {/* 1. ACCOUNT TAB */}
            {activeTab === 'account' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-400" />
                    Account Settings
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">Manage your identity, login details &amp; Govt KYC badges</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">Full Display Name</label>
                    <input
                      type="text"
                      value={accountData.name}
                      onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                      placeholder="e.g. Ryan / Ramanan Sethuraman"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">Username (@handle)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs text-amber-400 font-mono font-bold">@</span>
                      <input
                        type="text"
                        value={accountData.username}
                        onChange={(e) => setAccountData({ ...accountData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                        placeholder="username"
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={accountData.email}
                      onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      value={accountData.phone}
                      onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>

                {/* KYC Badge Info */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Digital Identity KYC Verification</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Aadhaar: {accountData.aadhaarNumber} • PAN: {accountData.panNumber}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                    VERIFIED ✓
                  </span>
                </div>

                <button
                  onClick={handleSaveAccountDetails}
                  className="btn-silver-primary text-zinc-950 px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 text-zinc-950" />
                  <span>Save Account &amp; Profile Name</span>
                </button>
              </div>
            )}

            {/* 2. NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-400" />
                    Notification Preferences
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">Configure email, SMS &amp; instant WhatsApp booking alerts</p>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'emailBookings', title: 'Booking Notifications', desc: 'Receive instant email when a driver books your vacant land or space.' },
                    { key: 'emailAgreements', title: 'Digital Agreement Delivery', desc: 'Receive copy of generated legal PDF agreements via email.' },
                    { key: 'smsOtp', title: 'SMS Security Alerts', desc: 'Receive SMS OTP for login and high-value payout verification.' },
                    { key: 'whatsappAlerts', title: 'WhatsApp Direct Alerts', desc: 'Send live updates & location pins directly to WhatsApp.' },
                    { key: 'marketingUpdates', title: 'TENLEA Feature Updates', desc: 'Get monthly reports on new platform features and land plot pricing.' },
                  ].map((item) => (
                    <div key={item.key} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.title}</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings[item.key]}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.key]: e.target.checked })}
                        className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSave('Notification Preferences')}
                  className="btn-silver-primary text-zinc-950 px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                >
                  <Save className="w-4 h-4 text-zinc-950" />
                  <span>Save Notifications</span>
                </button>
              </div>
            )}

            {/* 3. PLAYBACK AND PERFORMANCE TAB */}
            {activeTab === 'performance' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <PlaySquare className="w-5 h-5 text-purple-400" />
                    Playback and Performance
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">Optimize Google Maps rendering speed, animations &amp; video tours</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">Google Maps Renderer</label>
                    <select
                      value={performanceSettings.mapRenderer}
                      onChange={(e) => setPerformanceSettings({ ...performanceSettings, mapRenderer: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                    >
                      <option value="embed">Google Maps Viewport Embed Mode (Fast &amp; Free)</option>
                      <option value="store-locator">Google Maps Store Locator Web Component (Interactive)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">Live Data Refresh Rate</label>
                    <select
                      value={performanceSettings.autoRefreshInterval}
                      onChange={(e) => setPerformanceSettings({ ...performanceSettings, autoRefreshInterval: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                    >
                      <option value="10">Every 10 Seconds (High Speed)</option>
                      <option value="30">Every 30 Seconds (Recommended)</option>
                      <option value="60">Every 60 Seconds (Data Saver)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">Land Tour Video Quality</label>
                    <select
                      value={performanceSettings.tourQuality}
                      onChange={(e) => setPerformanceSettings({ ...performanceSettings, tourQuality: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                    >
                      <option value="1080p">1080p Full HD (High Quality)</option>
                      <option value="720p">720p HD (Balanced)</option>
                      <option value="480p">480p SD (Data Saver)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => handleSave('Playback & Performance Settings')}
                  className="btn-silver-primary text-zinc-950 px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                >
                  <Save className="w-4 h-4 text-zinc-950" />
                  <span>Update Performance</span>
                </button>
              </div>
            )}

            {/* 4. DOWNLOADS TAB */}
            {activeTab === 'downloads' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Download className="w-5 h-5 text-blue-400" />
                    Downloads &amp; Offline Cache
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">Download legal agreement templates, monthly invoices &amp; offline assets</p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">Standard Land Lease Agreement Template</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Official 2026 TENLEA Legal Format (PDF)</p>
                    </div>
                    <button
                      onClick={() => handleSave('Agreement Template Download')}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">Monthly Escrow Revenue Receipt</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Tax compliant transaction summary for GST / Income Tax</p>
                    </div>
                    <button
                      onClick={() => handleSave('Monthly Tax Receipt Download')}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Statement</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 5. PRIVACY TAB */}
            {activeTab === 'privacy' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    Privacy &amp; Security
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">Control your land listing visibility &amp; data privacy settings</p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">Public Land Listing Visibility</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Show your listed vacant land plots on the public search map.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.publicListing}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, publicListing: e.target.checked })}
                      className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">Hide Exact GPS Coordinates</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Mask exact door number on map until booking deposit is paid.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.hideCoordinatesUntilBooking}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, hideCoordinatesUntilBooking: e.target.checked })}
                      className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleSave('Privacy Settings')}
                  className="btn-silver-primary text-zinc-950 px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                >
                  <Save className="w-4 h-4 text-zinc-950" />
                  <span>Save Privacy Options</span>
                </button>
              </div>
            )}

            {/* 6. CONNECTED APPS TAB */}
            {activeTab === 'connected' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-cyan-400" />
                    Connected Apps &amp; APIs
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">Manage active platform service integrations &amp; third-party connections</p>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Razorpay Escrow Gateway', status: 'Connected ✓', color: 'emerald', desc: 'Secures all monthly rent and security deposits.' },
                    { name: 'Google Maps Platform', status: 'Active (Embed Mode)', color: 'blue', desc: 'Provides GPS locator map and directions.' },
                    { name: 'DigiLocker Govt KYC', status: 'Synced ✓', color: 'emerald', desc: 'Validates Aadhaar & PAN identity for agreements.' },
                    { name: 'WhatsApp Business API', status: 'Enabled', color: 'emerald', desc: 'Sends PDF receipts directly to mobile phones.' },
                  ].map((app, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">{app.name}</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{app.desc}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300">
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. BILLING AND PAYMENTS TAB */}
            {activeTab === 'billing' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                    Billing &amp; Escrow Payouts
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">Manage your bank payout account &amp; UPI Escrow withdrawal details</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">Primary UPI ID for Escrow Payouts</label>
                    <input
                      type="text"
                      value={billingSettings.upiId}
                      onChange={(e) => setBillingSettings({ ...billingSettings, upiId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">Bank Payout Account</label>
                    <input
                      type="text"
                      value={billingSettings.bankAccount}
                      onChange={(e) => setBillingSettings({ ...billingSettings, bankAccount: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleSave('Billing & Escrow Payouts')}
                  className="btn-silver-primary text-zinc-950 px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                >
                  <Save className="w-4 h-4 text-zinc-950" />
                  <span>Update Payout Account</span>
                </button>
              </div>
            )}

            {/* 8. ADVANCED SETTINGS TAB */}
            {activeTab === 'advanced' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-rose-400" />
                    Advanced Platform Settings
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">System diagnostics, API access tokens &amp; account controls</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">Developer Mode &amp; Console Debug Logs</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Enable detailed API response logging in developer tools.</p>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono bg-zinc-900 px-2 py-1 rounded">DISABLED</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-950 border border-rose-950/60 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-rose-300">Reset All Settings to Factory Default</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Revert map configurations, notifications &amp; local preferences.</p>
                    </div>
                    <button
                      onClick={() => handleSave('Platform Settings Reset')}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reset Settings
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Footer Note */}
            <div className="pt-6 border-t border-zinc-800/80 mt-6 flex items-center justify-between text-[11px] text-zinc-500">
              <span>TENLEA Version 2.4.0 (Escrow Ready)</span>
              <span>All changes saved securely</span>
            </div>

          </div>
        </div>
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </AnimatedBackground>
  );
};
