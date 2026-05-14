import type React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, MessageCircle } from 'lucide-react';
import { useGlobalSettings } from '../lib/useGlobalSettings';
import { useSearchParams } from 'react-router-dom';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function Contact() {
  const [searchParams] = useSearchParams();
  const pkg = searchParams.get('package');
  const customPkg = searchParams.get('customPackage');
  const customPrice = searchParams.get('price');
  
  const [formData, setFormData] = useState({ name: '', service: 'Skin Treatment', message: '' });
  const { settings } = useGlobalSettings();

  useEffect(() => {
    if (pkg) {
      setFormData(prev => ({ 
        ...prev, 
        service: 'Other',
        message: `Hi, I am interested in the "${pkg}" package.` 
      }));
    } else if (customPkg) {
      setFormData(prev => ({ 
        ...prev, 
        service: 'Other',
        message: `Hi, I am interested in building a custom combo containing: ${customPkg}. The estimated price was ₹${customPrice}.` 
      }));
    }
  }, [pkg, customPkg, customPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    const waNumber = settings.whatsapp ? settings.whatsapp.replace(/\D/g, '') : settings.phone1.replace(/\D/g, '');
    if (!waNumber) return;

    let textMessage = `Hello, my name is ${formData.name}.\n`;
    textMessage += `Interested in: ${formData.service}\n\n`;
    if (formData.message) {
      textMessage += `Message: ${formData.message}`;
    }

    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(textMessage)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto min-h-screen">
      <motion.div initial="hidden" animate="visible" variants={STAGGER}>
        
        <motion.div variants={FADE_UP} className="flex justify-center items-center gap-4 mb-6">
          <div className="w-8 h-[1px] bg-brand-gold"></div>
          <span className="uppercase text-[10px] tracking-widest text-brand-gold font-medium">Connect With Us</span>
          <div className="w-8 h-[1px] bg-brand-gold"></div>
        </motion.div>

        <motion.h1 variants={FADE_UP} className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] mb-6 text-center font-serif tracking-tight">
          Get in <span className="italic text-brand-gold font-light">Touch</span>
        </motion.h1>
        <motion.p variants={FADE_UP} className="text-center font-light text-brand-black/60 max-w-2xl mx-auto mb-24 text-lg">
          We would love to hear from you. Book your appointment or reach out with any inquiries.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 mb-24">
          
          <motion.div variants={STAGGER} className="space-y-16">
            <motion.div variants={FADE_UP}>
              <h3 className="text-3xl font-serif mb-8 tracking-tight">Contact Information</h3>
              <div className="space-y-8">
                <a href={`tel:${settings.phone1.replace(/\s+/g, '')}`} className="flex items-center gap-6 group">
                  <div className="w-14 h-14 flex items-center justify-center bg-brand-ivory border border-brand-black/10 group-hover:border-brand-gold group-hover:bg-brand-gold/5 transition-colors duration-500 rounded-full">
                    <Phone className="w-5 h-5 group-hover:text-brand-gold group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <div>
                    <p className="uppercase text-[10px] tracking-widest font-medium text-brand-black/50 mb-1">Call Us directly</p>
                    <p className="text-xl font-light tracking-wide">{settings.phone1}</p>
                    {settings.phone2 && <p className="text-xl font-light tracking-wide">{settings.phone2}</p>}
                  </div>
                </a>
                
                {settings.whatsapp && (
                  <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-6 group">
                    <div className="w-14 h-14 flex items-center justify-center bg-brand-ivory border border-brand-black/10 group-hover:border-brand-gold group-hover:bg-brand-gold/5 transition-colors duration-500 rounded-full">
                      <MessageCircle className="w-5 h-5 group-hover:text-brand-gold group-hover:scale-110 transition-all duration-300" />
                    </div>
                    <div>
                      <p className="uppercase text-[10px] tracking-widest font-medium text-brand-black/50 mb-1">Chat on WhatsApp</p>
                      <p className="text-xl font-light tracking-wide">+{settings.whatsapp}</p>
                    </div>
                  </a>
                )}
                
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 flex items-center justify-center bg-brand-ivory border border-brand-black/10 group-hover:border-brand-gold group-hover:bg-brand-gold/5 transition-colors duration-500 rounded-full flex-shrink-0">
                    <MapPin className="w-5 h-5 group-hover:text-brand-gold group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <div className="mt-2">
                    <p className="uppercase text-[10px] tracking-widest font-medium text-brand-black/50 mb-2">Visit Our Studio</p>
                    <p className="text-lg leading-relaxed max-w-sm font-light">
                      {settings.address} <br/>
                      <span className="text-sm font-light text-brand-black/60 mt-2 block w-full">Walk-ins and appointments welcome. Experience our luxury environment. <a href={settings.mapsLink} target="_blank" rel="noreferrer" className="text-brand-gold hover:underline block mt-1">Get Directions</a></span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={FADE_UP} className="pt-8 border-t border-brand-black/10">
              <h3 className="text-3xl font-serif mb-6 tracking-tight">Opening Hours</h3>
              <ul className="space-y-4 font-light">
                <li className="flex justify-between items-center py-4 bg-brand-ivory/50 px-6 border border-brand-black/5 shadow-sm">
                  <span className="text-lg uppercase tracking-widest text-xs font-medium">Business Hours</span> 
                  <span className="font-serif text-xl tracking-tight text-brand-gold">{settings.businessHours.replace('Everyday — ', '')}</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>

          <motion.div variants={FADE_UP} className="bg-brand-beige/30 p-10 lg:p-14 border border-brand-black/5 shadow-sm relative overflow-hidden h-fit">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-[40px]"></div>
            <h3 className="text-3xl font-serif mb-10 text-center tracking-tight">Send an Inquiry</h3>
            <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
              <div className="group relative">
                <input 
                  type="text" 
                  id="name" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder=" " 
                  className="w-full bg-transparent border-b border-brand-black/20 py-3 peer focus:outline-none focus:border-brand-gold transition-colors text-lg font-light" 
                />
                <label htmlFor="name" className="absolute left-0 top-3 text-brand-black/50 font-light transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-gold peer-focus:uppercase peer-focus:tracking-widest peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:tracking-widest">Full Name</label>
              </div>
              <div>
                <label className="block uppercase text-[10px] tracking-widest text-brand-black/50 mb-3 font-medium">Service Interested In</label>
                <div className="relative">
                  <select 
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    className="w-full bg-transparent border-b border-brand-black/20 py-3 focus:outline-none focus:border-brand-gold transition-colors text-brand-black/80 font-light text-lg appearance-none"
                  >
                    <option>Skin Treatment</option>
                    <option>Hair Services</option>
                    <option>Bridal Makeup</option>
                    <option>Party Makeup</option>
                    <option>Other</option>
                  </select>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-brand-gold font-serif">▼</div>
                </div>
              </div>
              <div className="group relative">
                <textarea 
                  id="message" 
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder=" " 
                  className="w-full bg-transparent border-b border-brand-black/20 py-3 peer focus:outline-none focus:border-brand-gold transition-colors text-lg font-light resize-none" 
                ></textarea>
                <label htmlFor="message" className="absolute left-0 top-3 text-brand-black/50 font-light transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-gold peer-focus:uppercase peer-focus:tracking-widest peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:tracking-widest">Message (Optional)</label>
              </div>
              
              <div className="pt-8">
                <button 
                  type="submit" 
                  className="relative overflow-hidden w-full bg-brand-black text-brand-ivory py-5 uppercase text-xs tracking-[0.2em] transition-all duration-500 group shadow-xl"
                >
                  <span className="relative z-10 group-hover:text-brand-gold transition-colors duration-500 flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" /> Send Request on WhatsApp
                  </span>
                  <div className="absolute inset-0 bg-brand-ivory/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                </button>
              </div>
            </form>
          </motion.div>

        </div>

        {/* Maps */}
        <motion.div variants={FADE_UP} className="w-full h-[500px] border border-brand-black/10 overflow-hidden relative group mt-10 shadow-sm">
           <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112135.0344406184!2d76.95317926189914!3d28.42314546497491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19d582e38859%3A0x2cf5fe8e5c64b1e!2sGurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1707838183120!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale-[0.8] group-hover:grayscale-[0.3] transition-all duration-1000 ease-in-out"
          ></iframe>
           <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-brand-black/5 opacity-100 group-hover:opacity-0 transition-opacity duration-1000"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
             <a href="https://maps.app.goo.gl/uS2d4pQkcoweDyWZ8" target="_blank" rel="noreferrer" className="pointer-events-auto bg-brand-black text-brand-ivory px-10 py-5 text-xs tracking-[0.2em] font-medium uppercase hover:bg-brand-gold hover:text-brand-ivory shadow-xl transition-all duration-500 relative overflow-hidden group/btn flex mt-[100px]">
               <span className="relative z-10">Get Directions</span>
               <div className="absolute inset-0 bg-brand-ivory/10 translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-500 ease-in-out"></div>
             </a>
           </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
