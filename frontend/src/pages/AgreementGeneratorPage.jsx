import React, { useState, useRef } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AnimatedBackground } from '../components/common/AnimatedBackground';
import { Logo } from '../components/common/Logo';
import { 
  FileText, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  User, 
  Car, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  IndianRupee, 
  FileCheck, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Building2,
  Eye,
  EyeOff
} from 'lucide-react';

export const AgreementGeneratorPage = () => {
  // Generate random serial
  const [agreementRef] = useState(() => `TN-AGR-2026-${Math.floor(100000 + Math.random() * 900000)}`);
  const [copied, setCopied] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [isDocOpen, setIsDocOpen] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    // Landowner
    landownerName: '',
    landownerPhone: '',
    landownerId: '',
    landownerAddress: '',
    landownerDocType: 'Aadhaar Card',
    
    // Land / Space
    spaceName: '',
    spaceType: 'Gated Private Yard',
    spaceAddress: '',
    spotNumber: '',
    rentalRate: '',
    rateUnit: 'Monthly',
    
    // Vehicle Owner
    vehicleOwnerName: '',
    vehicleOwnerPhone: '',
    vehicleOwnerId: '',
    vehicleOwnerAddress: '',
    vehicleOwnerDocType: 'Aadhaar Card',
    
    // Vehicle
    vehicleRegNo: '',
    vehicleMakeModel: '',
    vehicleType: 'Car / SUV',
    vehicleColor: '',
    vehicleRcNo: '',
    
    // Agreement Details
    agreementDate: new Date().toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    securityDeposit: '',
    paymentMethod: 'TENLEA Escrow',
    noticePeriodDays: '15',
    specialTerms: '',
  });

  const [activeTab, setActiveTab] = useState('landowner');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Quick Demo Presets
  const loadPreset = (type) => {
    if (type === 'car-monthly') {
      setFormData({
        landownerName: 'Ryan',
        landownerPhone: '+91 XXXXXXXXXX',
        landownerId: '7845-9012-3456',
        landownerAddress: 'Plot No. 42, Green Avenue, Anna Nagar, Chennai, Tamil Nadu',
        spaceName: 'Anna Nagar Covered Car Garage',
        spaceType: 'Covered Garage',
        spaceAddress: 'Plot 42-B, Green Avenue 2nd Street, Anna Nagar West, Chennai',
        spotNumber: 'GARAGE-01',
        rentalRate: '5000',
        rateUnit: 'Monthly',
        vehicleOwnerName: 'Karthik Raja',
        vehicleOwnerPhone: '+91 9876543210',
        vehicleOwnerId: '5412-9876-1234',
        vehicleOwnerAddress: '12, MGR Salai, T. Nagar, Chennai',
        vehicleRegNo: 'TN 07 BZ 9901',
        vehicleMakeModel: 'Tata Nexon EV Max 2024',
        vehicleType: 'Electric Car / SUV',
        vehicleColor: 'Intense Teal',
        vehicleRcNo: 'RC-TN07-2024-11029',
        agreementDate: new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        securityDeposit: '3000',
        paymentMethod: 'TENLEA Razorpay Escrow',
        noticePeriodDays: '30',
        specialTerms: 'EV Charging access permitted at designated 16A socket.'
      });
    } else if (type === 'bike-daily') {
      setFormData({
        landownerName: 'Suresh Kumar',
        landownerPhone: '+91 9176001122',
        landownerId: '3344-5566-7788',
        landownerAddress: 'No. 5, Beach Road, Besant Nagar, Chennai',
        spaceName: 'Besant Nagar Covered Bike Spot',
        spaceType: 'Paved Driveway',
        spaceAddress: 'No. 5, 2nd Main Road, Besant Nagar, Chennai',
        spotNumber: 'BIKE-03',
        rentalRate: '150',
        rateUnit: 'Daily',
        vehicleOwnerName: 'Ananya Ramesh',
        vehicleOwnerPhone: '+91 9444112233',
        vehicleOwnerId: '9988-7766-5544',
        vehicleOwnerAddress: '45, TTK Road, Alwarpet, Chennai',
        vehicleRegNo: 'TN 01 AK 3344',
        vehicleMakeModel: 'Royal Enfield Classic 350',
        vehicleType: 'Two Wheeler / Bike',
        vehicleColor: 'Black Chrome',
        vehicleRcNo: 'RC-TN01-2022-77441',
        agreementDate: new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        securityDeposit: '500',
        paymentMethod: 'TENLEA UPI Direct Escrow',
        noticePeriodDays: '3',
        specialTerms: 'Helmets can be stored in garage locker if needed.'
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(agreementRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = () => {
    const textContent = `
================================================================================
TENLEA — OFFICIAL DIGITAL PARKING & SPACE LEASE AGREEMENT
Reference No: ${agreementRef}
Date: ${formData.agreementDate}
================================================================================

1. PARTIES TO AGREEMENT:
--------------------------------------------------------------------------------
LESSOR / LANDOWNER:
  Name: ${formData.landownerName}
  Phone: ${formData.landownerPhone}
  Govt ID / Aadhaar: ${formData.landownerId}
  Address: ${formData.landownerAddress}

LESSEE / VEHICLE OWNER:
  Name: ${formData.vehicleOwnerName}
  Phone: ${formData.vehicleOwnerPhone}
  Govt ID / Aadhaar: ${formData.vehicleOwnerId}
  Address: ${formData.vehicleOwnerAddress}

2. DEMISED PREMISES & VEHICLE DETAILS:
--------------------------------------------------------------------------------
PARKING / LAND SPACE:
  Space Name: ${formData.spaceName}
  Type: ${formData.spaceType}
  Location: ${formData.spaceAddress}
  Assigned Spot #: ${formData.spotNumber}

VEHICLE SCHEDULE:
  Registration Number: ${formData.vehicleRegNo}
  Make & Model: ${formData.vehicleMakeModel}
  Type: ${formData.vehicleType}
  Color: ${formData.vehicleColor}
  RC Number: ${formData.vehicleRcNo}

3. FINANCIAL TERMS & DURATION:
--------------------------------------------------------------------------------
  Rental Rate: ₹${formData.rentalRate} (${formData.rateUnit})
  Security Deposit: ₹${formData.securityDeposit}
  Payment Mode: ${formData.paymentMethod}
  Effective Period: ${formData.startDate} to ${formData.endDate}
  Termination Notice: ${formData.noticePeriodDays} Days Notice

4. SPECIAL CONDITIONS:
--------------------------------------------------------------------------------
  ${formData.specialTerms || 'Standard TENLEA platform safety rules apply.'}

================================================================================
Digitally Verified & Issued via TENLEA (Monetize Your Space)
Verified Reference: ${agreementRef}
================================================================================
`;
    const element = document.createElement('a');
    const file = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `TENLEA_Agreement_${agreementRef}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <AnimatedBackground variant="glow" className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between">
      {/* Print-specific CSS styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          #printable-agreement, #printable-agreement * {
            visibility: visible !important;
          }
          #printable-agreement {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            max-width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 auto !important;
            padding: 12mm 15mm !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            color: #0f172a !important;
            font-size: 9.5pt !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }

        @keyframes documentPrintFeed {
          0% {
            transform: translateY(-28px) scale(0.92);
            opacity: 0.2;
          }
          25% {
            opacity: 1;
          }
          75% {
            transform: translateY(14px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-28px) scale(0.92);
            opacity: 0.2;
          }
        }

        @keyframes laserScanBeam {
          0% {
            top: 0%;
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }

        .animate-document-print {
          animation: documentPrintFeed 4.5s ease-in-out infinite;
        }

        .animate-laser-scan {
          animation: laserScanBeam 2.2s ease-in-out infinite;
        }
      `}</style>

      {/* Header / Navbar (Hidden on Print) */}
      <div className="no-print">
        <Navbar />
      </div>

      <main className="grow pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Page Banner & Quick Controls (Hidden on Print) */}
        <div className="no-print mb-8 bg-zinc-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 card-silver-rim shadow-2xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center space-x-2 text-slate-300 font-bold text-xs uppercase tracking-widest mb-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Legal Document Generator</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
                Digital Rental &amp; Parking Agreement
              </h1>
              <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
                Fill in the agreement details below to instantly generate a print-ready legal lease contract featuring the official TENLEA letterhead header.
              </p>
            </div>

            {/* Animated Live Document Printer Graphic Widget */}
            <div className="shrink-0 flex items-center justify-center pt-2 md:pt-0">
              <div className="relative w-56 sm:w-64 bg-zinc-950/90 border border-zinc-800/80 rounded-2xl p-3.5 shadow-2xl overflow-hidden group hover:border-zinc-700 transition-all">
                
                {/* Header Status Bar */}
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 ml-1">
                      Auto-Printing Live...
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                    A4 PDF
                  </span>
                </div>

                {/* Printer Body & Document Feed Graphic Area */}
                <div className="relative h-28 flex flex-col items-center justify-center">
                  
                  {/* Top Paper Input Slot */}
                  <div className="w-32 h-1.5 bg-zinc-800 rounded-t-sm z-20 border-b border-zinc-900 shadow-inner"></div>

                  {/* Printer Main Hardware Chassis */}
                  <div className="w-48 h-12 bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl border border-zinc-700/80 shadow-lg relative z-20 flex items-center justify-between px-3">
                    <div className="flex items-center gap-1.5">
                      <Printer className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-extrabold font-mono text-zinc-200 tracking-wider">TENLEA-PRINTER</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    </div>
                  </div>

                  {/* Printed Document Sheet Animating Out of Printer Slot */}
                  <div className="w-40 bg-white text-zinc-900 rounded-b-md p-2 shadow-2xl border border-zinc-300 relative z-10 animate-document-print text-[7px] leading-tight select-none">
                    
                    {/* Glowing Green Laser Scanner Beam */}
                    <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-laser-scan pointer-events-none z-30"></div>

                    {/* Paper Document Header */}
                    <div className="flex items-center justify-between border-b border-zinc-300 pb-1 mb-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 flex items-center justify-center text-[5px] text-white font-bold">T</div>
                        <span className="font-extrabold text-[7px] text-zinc-900">TENLEA LEASE</span>
                      </div>
                      <span className="text-[6px] text-emerald-600 font-extrabold bg-emerald-50 px-1 py-0.2 rounded border border-emerald-300">STAMPED ✓</span>
                    </div>

                    {/* Document Line Skeleton */}
                    <div className="space-y-1">
                      <div className="h-1 bg-zinc-300 rounded w-full"></div>
                      <div className="h-1 bg-zinc-200 rounded w-4/5"></div>
                      <div className="h-1 bg-zinc-300 rounded w-3/4"></div>
                      <div className="flex items-center justify-between pt-0.5">
                        <div className="h-1 bg-emerald-200 rounded w-1/2"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-400 flex items-center justify-center text-[5px] text-emerald-700 font-bold">✓</div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>

        {/* Vertical Stacked Layout: Form Box (Top) -> Document Preview (Below) */}
        <div className="space-y-8 max-w-4xl mx-auto">
          
          {/* TOP SECTION: Input Form Box (Collapsible with 'v' Chevron Toggle) */}
          <div className="no-print w-full">
            <div className="bg-zinc-900/90 backdrop-blur-md rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden transition-all duration-300">
              
              {/* Form Collapsible Header with 'v' Chevron Toggle Button */}
              <div 
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="p-5 sm:p-6 bg-zinc-950/80 border-b border-zinc-800/80 flex items-center justify-between cursor-pointer hover:bg-zinc-900/60 transition-colors select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white font-display flex items-center gap-2">
                      Agreement Registration &amp; Details Form
                    </h3>
                    <p className="text-xs text-zinc-400">
                      {isFormOpen ? 'Fill in landowner, vehicle owner, property and KYC details' : 'Form collapsed — Click arrow to expand details box'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-400 hidden sm:inline-block">
                    {isFormOpen ? 'Hide Form' : 'Show Form'}
                  </span>
                  <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-all">
                    {isFormOpen ? <ChevronUp className="w-5 h-5 text-zinc-300" /> : <ChevronDown className="w-5 h-5 text-indigo-400 animate-pulse" />}
                  </div>
                </div>
              </div>

              {/* Form Body (Shown when isFormOpen is true) */}
              {isFormOpen && (
                <div className="p-6 sm:p-8 animate-fade-in space-y-6">
              
              {/* Form Section Selector Tabs */}
              <div className="flex rounded-xl bg-zinc-950 p-1 border border-zinc-800 mb-6 gap-1 overflow-x-auto scrollbar-none">
                {[
                  { id: 'landowner', label: 'Landowner', icon: Building2 },
                  { id: 'space', label: 'Land / Space', icon: MapPin },
                  { id: 'vehicle', label: 'Vehicle Owner', icon: User },
                  { id: 'kyc', label: 'KYC Verification', icon: ShieldCheck },
                  { id: 'terms', label: 'Terms & Rates', icon: Calendar },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 min-w-[90px] py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                        active
                          ? 'bg-zinc-800 text-white shadow-md border border-zinc-700'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${active ? 'text-indigo-400' : 'text-zinc-500'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: LANDOWNER DETAILS */}
              {activeTab === 'landowner' && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Landowner (Lessor) Details
                  </h3>
                  
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Landowner Full Name</label>
                    <input
                      type="text"
                      name="landownerName"
                      value={formData.landownerName}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. Ryan"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Phone Number</label>
                      <input
                        type="text"
                        name="landownerPhone"
                        value={formData.landownerPhone}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Aadhaar / ID No.</label>
                      <input
                        type="text"
                        name="landownerId"
                        value={formData.landownerId}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Landowner Residential Address</label>
                    <textarea
                      name="landownerAddress"
                      rows="2"
                      value={formData.landownerAddress}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <button
                    onClick={() => setActiveTab('space')}
                    className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Next: Land & Space Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* TAB 2: LAND & SPACE DETAILS */}
              {activeTab === 'space' && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Property / Land Plot Details
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Space Name / Title</label>
                    <input
                      type="text"
                      name="spaceName"
                      value={formData.spaceName}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Space Type</label>
                      <select
                        name="spaceType"
                        value={formData.spaceType}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        <option>Gated Private Yard</option>
                        <option>Covered Garage</option>
                        <option>Open Land Plot</option>
                        <option>Paved Driveway</option>
                        <option>Commercial Yard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Spot Number / ID</label>
                      <input
                        type="text"
                        name="spotNumber"
                        value={formData.spotNumber}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Exact Property Location / Address</label>
                    <textarea
                      name="spaceAddress"
                      rows="2"
                      value={formData.spaceAddress}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <button
                    onClick={() => setActiveTab('vehicle')}
                    className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Next: Vehicle Owner Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* TAB 3: VEHICLE & OWNER DETAILS */}
              {activeTab === 'vehicle' && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Vehicle & Owner (Lessee) Details
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Vehicle Owner Full Name</label>
                    <input
                      type="text"
                      name="vehicleOwnerName"
                      value={formData.vehicleOwnerName}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Vehicle Plate / Reg No</label>
                      <input
                        type="text"
                        name="vehicleRegNo"
                        value={formData.vehicleRegNo}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-emerald-400 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Make & Model</label>
                      <input
                        type="text"
                        name="vehicleMakeModel"
                        value={formData.vehicleMakeModel}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Vehicle Type</label>
                      <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        <option>Car / SUV</option>
                        <option>Electric Car / SUV</option>
                        <option>Two Wheeler / Bike</option>
                        <option>Commercial Vehicle / Van</option>
                        <option>Heavy Vehicle / Bus</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Vehicle Color</label>
                      <input
                        type="text"
                        name="vehicleColor"
                        value={formData.vehicleColor}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">RC Number / Registration Ref</label>
                    <input
                      type="text"
                      name="vehicleRcNo"
                      value={formData.vehicleRcNo}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <button
                    onClick={() => setActiveTab('kyc')}
                    className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Next: KYC Verification</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* TAB 4: KYC VERIFICATION */}
              {activeTab === 'kyc' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Mandatory Agreement KYC Verification
                    </h3>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                      TENLEA Verified ✓
                    </span>
                  </div>

                  {/* Landowner KYC */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Landowner (Lessor) KYC Document</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">Govt ID Type</label>
                        <select
                          name="landownerDocType"
                          value={formData.landownerDocType}
                          onChange={handleInputChange}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        >
                          <option>Aadhaar Card</option>
                          <option>PAN Card</option>
                          <option>Driving License</option>
                          <option>Passport</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">Govt ID Number</label>
                        <input
                          type="text"
                          name="landownerId"
                          value={formData.landownerId}
                          onChange={handleInputChange}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          placeholder="e.g. 1234 5678 9012"
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-zinc-900 border border-dashed border-zinc-700 text-center text-xs space-y-1">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto" />
                      <div className="text-[11px] font-bold text-white">Landowner ID Uploaded &amp; Attached</div>
                      <div className="text-[9px] text-zinc-400">Encrypted AES-256 Agreement Record</div>
                    </div>
                  </div>

                  {/* Vehicle Owner KYC */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <Car className="w-3.5 h-3.5 text-purple-400" />
                      <span>Vehicle Owner (Lessee) KYC &amp; RC</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">Govt ID Type</label>
                        <select
                          name="vehicleOwnerDocType"
                          value={formData.vehicleOwnerDocType}
                          onChange={handleInputChange}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        >
                          <option>Aadhaar Card</option>
                          <option>PAN Card</option>
                          <option>Driving License</option>
                          <option>Passport</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">Govt ID Number</label>
                        <input
                          type="text"
                          name="vehicleOwnerId"
                          value={formData.vehicleOwnerId}
                          onChange={handleInputChange}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          placeholder="e.g. 9876 5432 1098"
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-zinc-900 border border-dashed border-zinc-700 text-center text-xs space-y-1">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto" />
                      <div className="text-[11px] font-bold text-white">Vehicle Owner ID &amp; RC Document Attached</div>
                      <div className="text-[9px] text-zinc-400">Encrypted AES-256 Agreement Record</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('terms')}
                    className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Next: Financial Terms &amp; Rates</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* TAB 4: FINANCIAL TERMS & DURATION */}
              {activeTab === 'terms' && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    Agreement Duration & Rates
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Rental Rate (₹)</label>
                      <input
                        type="number"
                        name="rentalRate"
                        value={formData.rentalRate}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Billing Frequency</label>
                      <select
                        name="rateUnit"
                        value={formData.rateUnit}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      >
                        <option>Monthly</option>
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Annual</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Agreement Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Agreement End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Security Deposit (₹)</label>
                      <input
                        type="number"
                        name="securityDeposit"
                        value={formData.securityDeposit}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">Notice Period (Days)</label>
                      <input
                        type="number"
                        name="noticePeriodDays"
                        value={formData.noticePeriodDays}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Special Conditions / Garage Rules</label>
                    <textarea
                      name="specialTerms"
                      rows="2"
                      value={formData.specialTerms}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Add custom property or vehicle rules..."
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>


          {/* BOTTOM SECTION: Live Printable Document Preview (Displayed Below Form Box) */}
          <div className="w-full pt-2">
            
            {/* Control Bar over Document */}
            <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3 px-2 text-xs text-zinc-400">
              <div 
                onClick={() => setIsDocOpen(!isDocOpen)}
                className="flex items-center gap-2 cursor-pointer group select-none"
              >
                <FileText className="w-4.5 h-4.5 text-emerald-400" />
                <span className="font-semibold text-zinc-300 text-sm group-hover:text-white transition-colors">
                  Live Generated Document Sheet (Printable A4 Preview Below)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Hide / Show Eye Toggle Button */}
                <button
                  onClick={() => setIsDocOpen(!isDocOpen)}
                  title={isDocOpen ? 'Hide Document Sheet' : 'Show Document Sheet'}
                  className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 px-3.5 py-1.5 rounded-xl transition-all text-xs font-bold text-zinc-200 hover:text-white cursor-pointer shadow-md"
                >
                  {isDocOpen ? (
                    <>
                      <EyeOff className="w-4 h-4 text-amber-400" />
                      <span>Hide Sheet</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span>Show Sheet</span>
                    </>
                  )}
                </button>

                {/* Copy Ref Button */}
                <button
                  onClick={handleCopyRef}
                  className="hover:text-white flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl transition-colors font-mono text-xs cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                  <span>{copied ? 'Ref Copied!' : agreementRef}</span>
                </button>
              </div>
            </div>

            {/* Conditionally Render Document Sheet and Actions when isDocOpen is true */}
            {isDocOpen && (
              <div>
                {/* THE PRINTABLE AGREEMENT DOCUMENT CONTAINER - A4 SHEET FORMAT */}
                <div className="flex justify-center w-full max-w-full overflow-x-auto pb-4">
              <div
                id="printable-agreement"
                className="bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-2xl border border-slate-300 relative text-[11.5pt] leading-relaxed font-sans select-text overflow-hidden w-full max-w-[800px] shrink-0"
              >

              {/* Watermark Logo Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <Logo size="xl" clickable={false} />
              </div>

              {/* 1. DOCUMENT HEADER WITH TENLEA LOGO */}
              <div className="border-b-2 border-slate-900 pb-5 mb-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Top Left: Logo */}
                  <div className="flex items-center gap-3">
                    <Logo size="md" clickable={false} />
                  </div>

                  {/* Top Right: Reference & Security Seal */}
                  <div className="text-center sm:text-right text-slate-600">
                    <div className="inline-block bg-slate-100 border border-slate-300 rounded-md px-2.5 py-1 font-mono font-bold text-slate-900 text-[11px] mb-1">
                      REF: {agreementRef}
                    </div>
                    <p className="text-[10px] text-slate-500">Date: {formData.agreementDate}</p>
                    <p className="text-[10px] font-semibold text-emerald-700 flex items-center justify-center sm:justify-end gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      TENLEA Verified Escrow Legal Contract
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <h2 className="text-lg font-black tracking-wide uppercase text-slate-900 font-display">
                    VEHICLE PARKING & LAND SPACE LEASE AGREEMENT
                  </h2>
                  <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase mt-0.5">
                    Executed under Indian Contract Act, 1872 & Commercial License Terms
                  </p>
                </div>
              </div>

              {/* 2. RECITALS / PARTIES TO AGREEMENT */}
              <div className="mb-5 space-y-3">
                <p className="text-[11px] leading-relaxed">
                  This Vehicle Parking Space License Agreement is entered into on <strong>{formData.agreementDate}</strong> by and between the undersigned parties through the <strong>TENLEA Platform</strong>:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3 items-stretch">
                  {/* Landowner Box */}
                  <div className="bg-slate-50 border border-slate-300 rounded-lg p-3.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                      FIRST PART — LESSOR / LANDOWNER
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{formData.landownerName}</p>
                    <p className="text-slate-600 mt-0.5">Phone: {formData.landownerPhone}</p>
                    <p className="text-slate-600">Govt ID / Aadhaar: {formData.landownerId}</p>
                    <p className="text-slate-600 mt-1 font-medium text-[10px]">{formData.landownerAddress}</p>
                  </div>

                  {/* Vehicle Owner Box */}
                  <div className="bg-slate-50 border border-slate-300 rounded-lg p-3.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
                      SECOND PART — LESSEE / VEHICLE OWNER
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{formData.vehicleOwnerName}</p>
                    <p className="text-slate-600 mt-0.5">Phone: {formData.vehicleOwnerPhone}</p>
                    <p className="text-slate-600">Govt ID / Aadhaar: {formData.vehicleOwnerId}</p>
                    <p className="text-slate-600 mt-1 font-medium text-[10px]">{formData.vehicleOwnerAddress}</p>
                  </div>
                </div>
              </div>

              {/* 3. SCHEDULE OF PREMISES & VEHICLE */}
              <div className="mb-6">
                <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  SCHEDULE A: PREMISES & VEHICLE SPECIFICATIONS
                </h3>

                <table className="w-full text-left border-collapse border border-slate-300">
                  <tbody>
                    <tr className="border-b border-slate-200 bg-slate-100/70">
                      <td className="p-2 font-bold w-1/3 text-slate-800">Land Space / Title:</td>
                      <td className="p-2 font-semibold text-slate-900">{formData.spaceName}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-bold text-slate-800">Space Type & Spot #:</td>
                      <td className="p-2 text-slate-900">{formData.spaceType} — <span className="font-mono font-bold bg-slate-200 px-1.5 py-0.5 rounded">{formData.spotNumber}</span></td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-100/70">
                      <td className="p-2 font-bold text-slate-800">Property Location:</td>
                      <td className="p-2 text-slate-900">{formData.spaceAddress}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-bold text-slate-800">Vehicle Make & Model:</td>
                      <td className="p-2 font-semibold text-slate-900">{formData.vehicleMakeModel} ({formData.vehicleType}, {formData.vehicleColor})</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-100/70">
                      <td className="p-2 font-bold text-slate-800">Vehicle Registration / Plate #:</td>
                      <td className="p-2 font-mono font-extrabold text-slate-900">{formData.vehicleRegNo}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-800">RC Reference #:</td>
                      <td className="p-2 font-mono text-slate-700">{formData.vehicleRcNo}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 4. FINANCIAL TERMS & FEES */}
              <div className="mb-6">
                <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  SCHEDULE B: FINANCIAL TERMS & DURATION
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-300 text-center">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">Agreed License Fee</span>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">₹{formData.rentalRate} / {formData.rateUnit}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">Security Deposit</span>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">₹{formData.securityDeposit}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">Effective From</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{formData.startDate}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">Valid Until</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{formData.endDate}</p>
                  </div>
                </div>
              </div>

              {/* 4.5 MANDATORY KYC IDENTITY VERIFICATION COMPLIANCE SCHEDULE */}
              <div className="mb-6">
                <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 flex items-center justify-between">
                  <span>SCHEDULE C: MANDATORY KYC IDENTITY & DOCUMENT VERIFICATION</span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    TENLEA Verified ✓
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-300 text-[10px]">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <p className="font-extrabold text-slate-900 uppercase text-[9px] tracking-wider">Lessor (Landowner) Identity KYC</p>
                    <p className="text-slate-700 mt-1">Govt ID Type: <strong>{formData.landownerDocType || 'Aadhaar Card'}</strong></p>
                    <p className="text-slate-700 font-mono">ID No: {formData.landownerId || 'Verified'}</p>
                    <p className="text-emerald-700 font-bold text-[9px] mt-1">✓ Identity &amp; Land Ownership Verified</p>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <p className="font-extrabold text-slate-900 uppercase text-[9px] tracking-wider">Lessee (Vehicle Owner) Identity KYC</p>
                    <p className="text-slate-700 mt-1">Govt ID Type: <strong>{formData.vehicleOwnerDocType || 'Aadhaar Card'}</strong></p>
                    <p className="text-slate-700 font-mono">ID No: {formData.vehicleOwnerId || 'Verified'}</p>
                    <p className="text-emerald-700 font-bold text-[9px] mt-1">✓ Identity &amp; Vehicle Registration Verified</p>
                  </div>
                </div>
              </div>

              {/* 5. STANDARD CLAUSES & RULES */}
              <div className="mb-6 space-y-2 text-[10px] text-slate-700 leading-normal">
                <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  TERMS, CONDITIONS & CODE OF CONDUCT
                </h3>
                
                <ol className="list-decimal pl-4 space-y-1.5">
                  <li>
                    <strong>Grant of License:</strong> The Lessor grants the Lessee a non-exclusive revocable license to park the designated vehicle inside the allocated spot ({formData.spotNumber}) at {formData.spaceName}.
                  </li>
                  <li>
                    <strong>Payment Escrow & Overstay:</strong> Payments are processed securely via {formData.paymentMethod}. Overstay beyond {formData.endDate} without formal renewal via TENLEA will incur automatic daily penalty rates.
                  </li>
                  <li>
                    <strong>Security & Vehicle Conduct:</strong> Lessee must maintain the vehicle in clean, non-leaking condition. No illegal items, volatile flammable fuels, or unregistered modifications are permitted.
                  </li>
                  <li>
                    <strong>Cancellation & Notice:</strong> Either party may terminate this agreement by providing a minimum of <strong>{formData.noticePeriodDays} days written notice</strong> via the TENLEA mobile or web platform.
                  </li>
                  {formData.specialTerms && (
                    <li className="text-slate-900 font-semibold bg-amber-50 p-1.5 rounded border border-amber-200">
                      <strong>Special Conditions:</strong> {formData.specialTerms}
                    </li>
                  )}
                </ol>
              </div>

              {/* 6. SIGNATURE BLOCK */}
              <div className="pt-6 border-t-2 border-slate-900 mt-8">
                <p className="text-[10px] text-slate-500 text-center mb-6 italic">
                  IN WITNESS WHEREOF, the Landowner and Vehicle Owner have executed this digital agreement on TENLEA on {formData.agreementDate}.
                </p>

                <div className="grid grid-cols-2 gap-8 text-center pt-4">
                  <div>
                    <div className="h-12 border-b border-slate-400 flex items-end justify-center pb-1">
                      <span className="font-serif italic text-slate-800 text-sm">{formData.landownerName}</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mt-1">
                      LANDOWNER SIGNATURE
                    </p>
                    <p className="text-[9px] text-slate-500">Date: {formData.agreementDate}</p>
                  </div>

                  <div>
                    <div className="h-12 border-b border-slate-400 flex items-end justify-center pb-1">
                      <span className="font-serif italic text-slate-800 text-sm">{formData.vehicleOwnerName}</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mt-1">
                      VEHICLE OWNER SIGNATURE
                    </p>
                    <p className="text-[9px] text-slate-500">Date: {formData.agreementDate}</p>
                  </div>
                </div>

                {/* TENLEA FOOTER STAMP */}
                <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <Logo size="sm" clickable={false} />
                    <span>TENLEA Mobility Platform — Monetize Your Space</span>
                  </div>
                  <div className="text-right">
                    <span>Verified Stamp Ref: {agreementRef}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Displayed Below Document Preview (Hidden on Print) */}
              <div className="no-print mt-8 flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-zinc-800">
                <button
                  onClick={handlePrint}
                  className="btn-silver-primary text-zinc-950 flex items-center space-x-2.5 px-7 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-xl hover:scale-105 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-zinc-950" />
                  <span>PRINT / SAVE PDF</span>
                </button>
                <button
                  onClick={handleDownloadText}
                  className="btn-silver-secondary text-zinc-950 px-7 py-3.5 rounded-2xl font-semibold text-xs transition-all flex items-center space-x-2.5 shadow-lg hover:scale-105 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-zinc-950" />
                  <span>Download Text</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  </main>

      {/* Footer (Hidden on Print) */}
      <div className="no-print">
        <Footer />
      </div>
    </AnimatedBackground>
  );
};
