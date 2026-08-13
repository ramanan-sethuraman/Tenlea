import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Phone, Mail, MapPin, Send, MessageSquare, CheckCircle2, Linkedin } from 'lucide-react';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* Hero Header */}
      <div className="pt-32 pb-16 bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full silver-badge mb-4 inline-block">
            Get In Touch With TENLEA
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display mb-6">
            Contact <span className="gradient-text-silver">Support & Assistance</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Have questions about listing your land, booking a space, or account verification? 
            Reach out to our support team directly.
          </p>
        </div>
      </div>

      {/* Contact Cards & Form Section */}
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Direct Contact Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold font-display text-white mb-2">Direct Contact Channels</h2>
              <p className="text-xs text-zinc-400 mb-6">Reach out to us directly through any of our official channels.</p>
            </div>

            <div className="space-y-4 flex-1 flex flex-col justify-between">
              {/* Call / WhatsApp Card */}
              <div className="p-5 rounded-3xl card-silver-rim flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-zinc-900 text-slate-100 border border-slate-300/30 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Call / WhatsApp</span>
                  <a href="tel:+919080173002" className="text-base font-extrabold text-white hover:text-slate-300 transition-colors">
                    +91 9080173002
                  </a>
                  <p className="text-xs text-zinc-400 mt-0.5">Direct support & WhatsApp query line</p>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-5 rounded-3xl card-silver-rim flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-zinc-900 text-slate-100 border border-slate-300/30 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Official Email</span>
                  <a href="mailto:ramanans.master@gmail.com" className="text-sm font-extrabold text-white hover:text-slate-300 transition-colors break-all">
                    ramanans.master@gmail.com
                  </a>
                  <p className="text-xs text-zinc-400 mt-0.5">For general inquiries & partnership support</p>
                </div>
              </div>

              {/* LinkedIn Card */}
              <div className="p-5 rounded-3xl card-silver-rim flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-zinc-900 text-slate-100 border border-slate-300/30 shrink-0">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Founder & Leadership</span>
                  <a
                    href="https://www.linkedin.com/in/ramanan-sethuraman/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-extrabold text-white hover:text-slate-300 transition-colors break-all"
                  >
                    Ramanan Sethuraman (Founder)
                  </a>
                  <p className="text-xs text-zinc-400 mt-0.5">Connect with the founder on LinkedIn</p>
                </div>
              </div>

              {/* Location Card */}
              <div className="p-5 rounded-3xl card-silver-rim flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-zinc-900 text-slate-100 border border-slate-300/30 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Headquarters</span>
                  <span className="text-xs font-bold text-white block mt-0.5">Chennai, Tamil Nadu, India 🇮🇳</span>
                  <p className="text-xs text-zinc-400 mt-0.5">Serving all major urban hubs in South & West India</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="p-8 sm:p-10 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold font-display text-white mb-2">Send Us a Message</h2>
                <p className="text-xs text-zinc-400 mb-6">Fill in your information and we will respond as soon as possible.</p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-zinc-950 border border-slate-300/30 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-white mx-auto" />
                  <h3 className="text-lg font-bold text-white">Message Received!</h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Thank you for contacting TENLEA. Our team will reach out to you shortly via phone or email.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', message: '' });
                    }}
                    className="px-6 py-2.5 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs mt-2"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 XXXXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="ramanans.master@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">Message / Inquiry</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="How can we assist you with parking or land listing?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl btn-silver-primary text-zinc-950 font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-zinc-950" />
                    <span>Submit Message</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
};
