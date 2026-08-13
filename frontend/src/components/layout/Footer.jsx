import React from 'react';
import { Logo } from '../common/Logo';
import { Twitter, Instagram, Linkedin, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Footer = () => {
  const location = useLocation();

  // Render footer ONLY on the home page ('/')
  if (location.pathname !== '/') {
    return null;
  }

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-16 pb-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Logo & Description */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="dark" size="lg" showTagline={true} />
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed mt-3">
              A secure marketplace for parking and land leasing, built from the ground up for India’s urban mobility.
            </p>

            {/* Direct Contact Details Block */}
            <div className="pt-3 space-y-2 text-xs text-zinc-300 border-t border-zinc-900">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-300 shrink-0" />
                <a href="tel:+919080173002" className="hover:text-white transition-colors font-bold">+91 9080173002</a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-300 shrink-0" />
                <a href="mailto:ramanans.master@gmail.com" className="hover:text-white transition-colors font-medium">ramanans.master@gmail.com</a>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              {[
                { Icon: Twitter, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Linkedin, href: "https://www.linkedin.com/in/ramanan-sethuraman/" },
                { Icon: Youtube, href: "#" },
              ].map(({ Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target={href !== '#' ? "_blank" : undefined}
                  rel={href !== '#' ? "noopener noreferrer" : undefined}
                  className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/find-parking" className="hover:text-white transition-colors">Find Parking</Link></li>
              <li><Link to="/agreement-generator" className="hover:text-white transition-colors">Agreement Generator</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/why-tenlea" className="hover:text-white transition-colors">Why TENLEA</Link></li>
              <li><Link to="/benefits" className="hover:text-white transition-colors">Benefits</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">For Users</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/register" className="hover:text-white transition-colors">Landowners</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Vehicle Owners</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Support & Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/contact" className="hover:text-white transition-colors text-slate-200 font-semibold">Contact Page</Link></li>
              <li><a href="tel:+919080173002" className="hover:text-white transition-colors text-xs block">+91 9080173002</a></li>
              <li><a href="mailto:ramanans.master@gmail.com" className="hover:text-white transition-colors text-xs block break-all">ramanans.master@gmail.com</a></li>
              <li><a href="https://www.linkedin.com/in/ramanan-sethuraman/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-xs block text-slate-300">Ramanan Sethuraman (Founder)</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="font-semibold text-zinc-400">
            © 2026 TENLEA PVT. LTD. All Rights Reserved. | Made in India 🇮🇳
          </div>
          <div className="flex items-center gap-1 text-zinc-500">
            <span>Designed for Indian Parking &amp; Land Mobility</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
