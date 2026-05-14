import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useGlobalSettings } from '../lib/useGlobalSettings';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function About() {
  const { images } = useGlobalSettings();

  return (
    <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto min-h-screen">
      <motion.div initial="hidden" animate="visible" variants={STAGGER}>
        
        <motion.div variants={FADE_UP} className="flex justify-center items-center gap-4 mb-6">
          <div className="w-8 h-[1px] bg-brand-gold"></div>
          <span className="uppercase text-[10px] tracking-widest text-brand-gold font-medium">Our Story</span>
          <div className="w-8 h-[1px] bg-brand-gold"></div>
        </motion.div>

        <motion.h1 variants={FADE_UP} className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] mb-24 text-center font-serif tracking-tight">
          About <span className="italic text-brand-gold font-light">Us</span>
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <motion.div variants={FADE_UP} className="lg:col-span-5 relative group">
            <div className="absolute inset-0 bg-brand-gold/10 translate-x-4 translate-y-4 -z-10 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-700"></div>
            <img 
              src={images.aboutSignature} 
              alt="Salon interior" 
              className="w-full aspect-[4/5] object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-[1s] shadow-xl" 
            />
          </motion.div>
          
          <motion.div variants={STAGGER} className="lg:col-span-7 space-y-8 lg:pl-10">
            <motion.h2 variants={FADE_UP} className="text-3xl md:text-4xl font-serif text-brand-black tracking-tight mb-2">Our Philosophy</motion.h2>
            <motion.div variants={FADE_UP} className="w-12 h-[1px] bg-brand-gold mb-10"></motion.div>
            
            <motion.div variants={FADE_UP} className="space-y-6 text-brand-black/70 font-light leading-loose text-lg">
              <p>
                Located in the heart of Gurugram, Beauty Attraction Parlor is more than just a salon; it is a sanctuary crafted exclusively for women seeking unparalleled beauty services in a pristine, relaxing environment.
              </p>
              <p>
                We believe that true beauty stems from confidence. Our core mission is to empower every woman who walks through our doors. By marrying the expertise of seasoned professionals with premium, curated products, we ensure every treatment is performed with absolute precision and genuine care.
              </p>
              <p>
                Our women-focused environment guarantees absolute privacy and comfort, allowing you to completely surrender to relaxation while we architect your aesthetic vision.
              </p>
            </motion.div>

            <motion.div variants={FADE_UP} className="pt-10">
              <Link to="/services" className="relative overflow-hidden inline-flex items-center justify-center border border-brand-black px-10 py-4 uppercase text-xs tracking-[0.2em] transition-all duration-500 group hover:bg-brand-black hover:text-brand-ivory font-medium">
                <span className="relative z-10">Explore Our Services</span>
                <div className="absolute inset-0 bg-brand-ivory/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
              </Link>
            </motion.div>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}
