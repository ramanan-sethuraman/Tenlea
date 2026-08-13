import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Car, QrCode, IndianRupee, CheckCircle2 } from 'lucide-react';
import { AnimatedBackground } from '../common/AnimatedBackground';
import { useAuth } from '../../context/AuthContext';

export const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFindParkingClick = () => {
    if (user) {
      navigate('/find-parking');
    } else {
      navigate('/login?role=vehicle');
    }
  };

  const handleListSpaceClick = () => {
    if (user) {
      if (user.role === 'LANDOWNER' || user.role === 'ADMIN') {
        navigate('/dashboard/landowner');
      } else {
        navigate('/add-land');
      }
    } else {
      navigate('/login?role=landowner');
    }
  };

  return (
    <section className="relative bg-zinc-950 overflow-hidden text-white min-h-[85vh] flex flex-col justify-center">
      <AnimatedBackground variant="glow" showVideo={true} playbackRate={0.35} showGrid={false} showVehicles={false} className="pt-32 pb-20 md:pt-40 md:pb-28">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-8 sm:space-y-10 max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full silver-badge backdrop-blur-md"
          >
            <ShieldCheck className="w-4 h-4 text-slate-200" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-100">
              India’s Trusted Land &amp; Parking Marketplace
            </span>
          </motion.div>

          {/* Animated Hero Headline */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2, delayChildren: 0.1 }
              }
            }}
            className="font-extrabold tracking-tight select-none space-y-2 sm:space-y-3"
          >
            {/* First Line: UNUSED SPACE   +   IDLE VEHICLES */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-x-4 sm:gap-x-6 lg:gap-x-8 text-2xl sm:text-4xl lg:text-5xl select-none sm:whitespace-nowrap">
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 30, rotateX: -30, filter: 'blur(10px)' },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    rotateX: 0, 
                    filter: 'blur(0px)',
                    transition: { type: 'spring', stiffness: 220, damping: 18 }
                  }
                }}
                className="inline-block font-sans font-bold uppercase tracking-[0.06em] bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent drop-shadow-md"
              >
                Unused Space
              </motion.span>

              <span className="text-slate-400 font-light text-2xl sm:text-3xl lg:text-4xl mx-2 sm:mx-4 select-none font-raleway">+</span>

              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 30, rotateX: -30, filter: 'blur(10px)' },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    rotateX: 0, 
                    filter: 'blur(0px)',
                    transition: { type: 'spring', stiffness: 220, damping: 18 }
                  }
                }}
                className="inline-block font-sans font-bold uppercase tracking-[0.06em] bg-gradient-to-r from-slate-100 via-white to-slate-300 bg-clip-text text-transparent drop-shadow-md"
              >
                Idle Vehicles
              </motion.span>
            </div>

            {/* Second Line: One Trusted Connection (Close Vertically) */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30, rotateX: -30, filter: 'blur(10px)' },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  rotateX: 0, 
                  filter: 'blur(0px)',
                  transition: { type: 'spring', stiffness: 200, damping: 18 }
                }
              }}
              className="flex items-center justify-center gap-2 text-2xl sm:text-4xl lg:text-5xl pt-0.5 sm:pt-1"
            >
              <span className="font-raleway font-extralight tracking-widest bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent drop-shadow-lg">
                One Trusted Connection
              </span>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-400 font-normal max-w-2xl mx-auto leading-relaxed pt-2 sm:pt-3"
          >
            Turn unused land into income and give vehicle owners a safe place to park. Direct digital agreements, QR check-in, and escrow payments.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 sm:pt-6"
          >
            <button
              onClick={handleFindParkingClick}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl btn-silver-primary text-zinc-950 font-bold text-base flex items-center justify-center gap-3 group cursor-pointer"
            >
              <Car className="w-5 h-5 text-zinc-950 group-hover:scale-110 transition-transform duration-300" />
              <span>Find Parking</span>
            </button>

            <button
              onClick={handleListSpaceClick}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl btn-silver-primary text-zinc-950 font-bold text-base flex items-center justify-center gap-3 group cursor-pointer"
            >
              <MapPin className="w-5 h-5 text-zinc-950 group-hover:scale-110 transition-transform duration-300" />
              <span>List Your Space</span>
            </button>
          </motion.div>

          <div className="pt-6 sm:pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-slate-300" /> Verified KYC Landowners
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-slate-300" /> Contactless QR Check-In
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-slate-300" /> Escrow Protection
            </span>
          </div>
        </div>
      </div>
      </AnimatedBackground>
    </section>
  );
};
