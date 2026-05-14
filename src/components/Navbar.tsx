import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGlobalSettings } from '../lib/useGlobalSettings';

const links = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Packages', path: '/packages' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useGlobalSettings();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-500 border-b border-transparent ${
        scrolled ? 'bg-brand-ivory/80 backdrop-blur-xl py-4 shadow-sm border-brand-black/5' : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-serif tracking-tight uppercase leading-none group">
          {settings.heroHeadline}<br/><span className="text-[10px] tracking-[0.4em] opacity-60 font-sans group-hover:opacity-100 transition-opacity">{settings.heroSubheadline}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-10 items-center">
          {links.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`uppercase text-[10px] md:text-xs tracking-[0.2em] transition-all hover:text-brand-gold relative group py-2 ${
                location.pathname === link.path ? 'text-brand-gold font-medium' : 'text-brand-black'
              }`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-0 right-0 h-[1px] bg-brand-gold" />
              )}
              {location.pathname !== link.path && (
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-gold group-hover:w-full transition-all duration-300"></div>
              )}
            </Link>
          ))}
          <Link 
            to="/contact" 
            className="border border-brand-black px-8 py-3 uppercase text-xs tracking-[0.2em] relative overflow-hidden group ml-4 bg-transparent transition-all"
          >
            <span className="relative z-10 group-hover:text-brand-ivory transition-colors duration-300">Book Now</span>
            <div className="absolute inset-0 bg-brand-black translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></div>
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 -mr-2 text-brand-black hover:text-brand-gold transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
            className="fixed inset-0 bg-brand-ivory z-50 flex flex-col pt-8 px-6 pb-12 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-16">
              <Link to="/" className="text-xl font-serif tracking-tight uppercase leading-none" onClick={() => setIsOpen(false)}>
                {settings.heroHeadline}<br/><span className="text-[9px] tracking-[0.3em] opacity-60 font-sans">{settings.heroSubheadline}</span>
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 rounded-full border border-brand-black/10 hover:border-brand-gold hover:text-brand-gold transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex flex-col flex-grow gap-8 w-full max-w-sm mx-auto">
              {links.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                >
                  <Link 
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block text-4xl font-serif tracking-tight uppercase border-b border-brand-black/5 pb-4 ${
                      location.pathname === link.path ? 'text-brand-gold italic' : 'text-brand-black hover:text-brand-gold transition-colors duration-300'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.8 }}
               className="mt-auto w-full max-w-sm mx-auto pt-8 border-t border-brand-black/10"
            >
               <p className="uppercase text-[10px] tracking-widest text-brand-black/50 mb-2 font-medium">Contact</p>
               <p className="font-light tracking-wide text-lg mb-6">{settings.phone1}</p>
               <Link to="/contact" className="block w-full bg-brand-black text-brand-ivory text-center py-4 uppercase text-xs tracking-widest font-medium" onClick={() => setIsOpen(false)}>
                 Book Appointment
               </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
