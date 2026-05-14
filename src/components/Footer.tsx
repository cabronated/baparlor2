import { Link } from 'react-router-dom';
import { Instagram, Facebook, MapPin, Phone, Clock } from 'lucide-react';
import { useGlobalSettings } from '../lib/useGlobalSettings';

export default function Footer() {
  const { settings } = useGlobalSettings();

  return (
    <footer className="bg-brand-black text-brand-ivory pt-32 pb-10 border-t-8 border-brand-gold">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-20">
        
        <div className="md:col-span-4 flex flex-col items-start">
          <Link to="/" className="text-3xl font-serif tracking-tight uppercase mb-8 leading-none">
            {settings.heroHeadline}<br/><span className="text-[10px] tracking-[0.4em] opacity-60 font-sans">{settings.heroSubheadline}</span>
          </Link>
          <p className="text-brand-ivory/60 text-base font-light leading-loose mb-10 max-w-xs">
            Elegance. Confidence. Beauty. A premium women-only salon experience located in the heart of Gurugram.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-12 h-12 flex items-center justify-center border border-brand-ivory/20 rounded-full hover:bg-brand-ivory hover:text-brand-black transition-all duration-300 group">
              <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="w-12 h-12 flex items-center justify-center border border-brand-ivory/20 rounded-full hover:bg-brand-ivory hover:text-brand-black transition-all duration-300 group">
              <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>

        <div className="md:col-span-2 md:col-start-6">
          <h4 className="font-serif text-2xl tracking-tight mb-8 text-brand-ivory">Menu</h4>
          <ul className="flex flex-col gap-5 text-sm font-light text-brand-ivory/60">
            <li><Link to="/about" className="uppercase tracking-widest text-[10px] hover:text-brand-gold transition-colors block">About Us</Link></li>
            <li><Link to="/services" className="uppercase tracking-widest text-[10px] hover:text-brand-gold transition-colors block">Services</Link></li>
            <li><Link to="/packages" className="uppercase tracking-widest text-[10px] hover:text-brand-gold transition-colors block">Packages</Link></li>
            <li><Link to="/contact" className="uppercase tracking-widest text-[10px] hover:text-brand-gold transition-colors block">Contact</Link></li>
          </ul>
        </div>

        <div className="md:col-span-4 group">
          <h4 className="font-serif text-2xl tracking-tight mb-8 text-brand-ivory">Contact Us</h4>
          <ul className="flex flex-col gap-6 text-sm font-light text-brand-ivory/60">
            <li className="flex items-start gap-4">
              <MapPin className="w-5 h-5 flex-shrink-0 mt-1 text-brand-gold" />
              <span className="leading-relaxed">{settings.address}<br/><a href={settings.mapsLink} target="_blank" rel="noreferrer" className="text-brand-gold hover:text-brand-ivory transition-colors mt-2 inline-block text-[10px] uppercase tracking-widest font-medium">Get Directions</a></span>
            </li>
            <li className="flex items-center gap-4">
              <Phone className="w-5 h-5 flex-shrink-0 text-brand-gold" />
              <div className="space-y-1">
                <p className="tracking-wide text-base">{settings.phone1}</p>
                {settings.phone2 && <p className="tracking-wide text-base">{settings.phone2}</p>}
              </div>
            </li>
            <li className="flex items-start gap-4 mt-6 pt-6 border-t border-brand-ivory/10">
              <Clock className="w-5 h-5 flex-shrink-0 mt-0.5 text-brand-gold" />
              <div>
                <p className="uppercase text-[10px] tracking-[0.2em] font-medium text-brand-ivory/40 mb-2">Business Hours</p>
                <span className="tracking-wide text-base text-brand-ivory/90">{settings.businessHours}</span>
              </div>
            </li>
          </ul>
          {settings.whatsapp && (
            <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="inline-block mt-10 border-b border-brand-gold text-brand-gold pb-1 uppercase tracking-[0.2em] text-xs hover:text-brand-ivory hover:border-brand-ivory transition-colors">
              Chat on WhatsApp
            </a>
          )}
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-32 pt-8 border-t border-brand-ivory/10 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] uppercase tracking-[0.2em] font-medium text-brand-ivory/40">
        <p>&copy; {new Date().getFullYear()} Beauty Attraction Parlor. All rights reserved.</p>
        <Link to="/admin" className="hover:text-brand-gold transition-colors">Admin Dashboard</Link>
      </div>
    </footer>
  );
}
