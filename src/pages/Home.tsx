import { motion } from 'motion/react';
import { ArrowRight, MapPin, Phone } from 'lucide-react';
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

export default function Home() {
  const { settings, images } = useGlobalSettings();

  return (
    <div className="pt-0">
      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center pt-20">
        <div className="absolute inset-0 z-0 flex">
          <div className="w-full md:w-1/2 bg-brand-ivory hidden md:block" />
          <motion.div 
            initial={{ opacity: 0, scale: 1.05 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full md:w-1/2 h-full absolute md:relative inset-0"
          >
            <div className="absolute inset-0 bg-brand-black/20 md:bg-transparent z-10" />
            <img 
              src={images.heroBackground} 
              alt="Luxury Beauty"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="w-full md:w-1/2 md:pr-16 lg:pr-24">
            <motion.div initial="hidden" animate="visible" variants={STAGGER} className="md:bg-transparent bg-brand-ivory/90 md:p-0 p-8 md:backdrop-blur-none backdrop-blur-md shadow-xl md:shadow-none">
              <motion.div variants={FADE_UP} className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[1px] bg-brand-gold"></div>
                <p className="uppercase tracking-[0.3em] text-[10px] font-semibold text-brand-gold">
                  Gurugram's Premium Women's Salon
                </p>
              </motion.div>
              <motion.h1 variants={FADE_UP} className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] mb-8 font-serif tracking-tight text-brand-black">
                {settings.heroHeadline} <br/>
                <span className="italic font-light text-brand-gold">{settings.heroSubheadline}</span>
              </motion.h1>
              <motion.p variants={FADE_UP} className="max-w-md text-brand-black/70 font-light leading-relaxed mb-10 text-lg">
                {settings.heroDescription}
              </motion.p>
              <motion.div variants={FADE_UP} className="flex flex-wrap gap-6 items-center">
                <Link to="/contact" className="group relative overflow-hidden bg-brand-black text-brand-ivory px-10 py-4 uppercase text-xs tracking-widest transition-all duration-500 shadow-xl shadow-brand-black/20">
                  <span className="relative z-10 group-hover:text-brand-gold transition-colors duration-500">Book Visit</span>
                  <div className="absolute inset-0 bg-brand-ivory/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                </Link>
                <Link to="/services" className="uppercase text-xs tracking-widest text-brand-black font-medium hover:text-brand-gold transition-colors duration-300 border-b border-brand-black hover:border-brand-gold pb-1">
                  Explore Services
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Services Showcase */}
      <section className="py-32 px-6 bg-brand-ivory">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={STAGGER}
            className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
          >
            <div>
              <motion.div variants={FADE_UP} className="flex items-center gap-4 mb-4">
                <div className="w-8 h-[1px] bg-brand-gold"></div>
                <span className="uppercase text-[10px] tracking-widest text-brand-gold font-medium">Curated Elegance</span>
              </motion.div>
              <motion.h2 variants={FADE_UP} className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight">Our Expertise</motion.h2>
            </div>
            <motion.div variants={FADE_UP}>
              <Link to="/services" className="flex items-center gap-3 uppercase tracking-widest text-xs font-medium hover:text-brand-gold transition-colors group">
                All Services <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {[
              { title: 'Skin Treatments', img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=800&auto=format&fit=crop' },
              { title: 'Hair Styling', img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=800&auto=format&fit=crop' },
              { title: 'Bridal Makeup', img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=800&auto=format&fit=crop' },
              { title: 'Nail Art', img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop' },
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={FADE_UP}
                transition={{ delay: i * 0.15 }}
                className="group cursor-pointer block"
              >
                <div className="aspect-[3/4] overflow-hidden mb-6 relative">
                  <div className="absolute inset-0 bg-brand-black/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1s] ease-out" />
                </div>
                <h3 className="text-2xl font-serif tracking-wide mb-3">{s.title}</h3>
                <div className="h-[1px] w-8 bg-brand-gold group-hover:w-full transition-all duration-[1s] ease-out"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Image Grid */}
      <section className="py-24 md:py-32 px-6 bg-brand-beige">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
            className="md:col-span-6 lg:col-span-5 relative h-[60vh] md:h-[90vh] w-full"
          >
            <img src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover shadow-2xl" alt="Luxury Salon" />
            {/* Decorative block */}
            <div className="absolute -bottom-8 -right-8 w-2/3 aspect-square bg-brand-gold/10 -z-10 hidden md:block"></div>
          </motion.div>
          
          <div className="md:col-span-6 lg:col-span-6 lg:col-start-7 flex flex-col justify-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER}>
              <motion.div variants={FADE_UP} className="flex items-center gap-4 mb-6">
                <span className="uppercase text-[10px] tracking-widest text-brand-gold font-medium">Our Philosophy</span>
                <div className="w-12 h-[1px] bg-brand-gold"></div>
              </motion.div>
              <motion.h2 variants={FADE_UP} className="text-4xl md:text-5xl lg:text-7xl mb-10 font-serif leading-[1.1] tracking-tight">
                A Sanctuary <br/>
                <span className="italic text-brand-gold font-light">for Women</span>
              </motion.h2>
              <motion.p variants={FADE_UP} className="font-light text-brand-black/70 mb-12 leading-loose text-lg">
                Step into an environment crafted exclusively for your comfort and elegance. At Beauty Attraction Parlor, we believe every woman deserves a space to relax, refresh, and redefine her aesthetic.
              </motion.p>
              
              <motion.div variants={FADE_UP} className="grid grid-cols-2 gap-10 mb-12 border-y border-brand-black/10 py-10">
                <div>
                  <p className="text-4xl lg:text-5xl font-serif text-brand-gold mb-3">10+</p>
                  <p className="uppercase text-xs tracking-[0.2em] font-medium text-brand-black/60">Years Experience</p>
                </div>
                <div>
                  <p className="text-4xl lg:text-5xl font-serif text-brand-gold mb-3">100%</p>
                  <p className="uppercase text-xs tracking-[0.2em] font-medium text-brand-black/60">Hygiene Standards</p>
                </div>
              </motion.div>
              
              <motion.div variants={FADE_UP}>
                <Link to="/about" className="uppercase text-xs tracking-widest text-brand-black font-medium hover:text-brand-gold transition-colors duration-300 border-b border-brand-black hover:border-brand-gold pb-1 group flex items-center gap-3 w-max">
                  Discover Our Story <ArrowRight className="w-3 h-3 group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA banner */}
      <section className="bg-brand-black text-brand-ivory py-32 lg:py-40 px-6 text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-brand-gold/5 blur-[100px] rounded-full point-events-none"></div>
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER} className="max-w-4xl mx-auto relative z-10">
          <motion.div variants={FADE_UP} className="flex justify-center items-center gap-4 mb-8">
            <div className="w-8 h-[1px] bg-brand-gold/50"></div>
            <span className="uppercase text-[10px] tracking-[0.3em] text-brand-gold/80 font-medium">Book An Appointment</span>
            <div className="w-8 h-[1px] bg-brand-gold/50"></div>
          </motion.div>
          
          <motion.h2 variants={FADE_UP} className="text-4xl md:text-6xl lg:text-7xl mb-8 font-serif font-light tracking-tight">
            Ready for your <span className="italic text-brand-gold">transformation?</span>
          </motion.h2>
          <motion.p variants={FADE_UP} className="font-light text-brand-ivory/60 mb-14 text-lg md:text-xl max-w-2xl mx-auto">
            Experience the epitome of luxury beauty treatments. Contact us today or walk into our Gurugram studio.
          </motion.p>
          
          <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row justify-center gap-6 items-center">
            <a href="tel:+919643522754" className="w-full sm:w-auto flex items-center justify-center gap-4 bg-brand-ivory text-brand-black px-10 py-5 uppercase text-xs tracking-[0.2em] hover:bg-brand-gold hover:text-brand-ivory transition-all duration-500 shadow-[0_0_40px_rgba(255,253,208,0.1)] group font-medium">
              <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" /> Call Now
            </a>
            <a href="https://maps.app.goo.gl/uS2d4pQkcoweDyWZ8" target="_blank" rel="noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-4 border border-brand-ivory/30 px-10 py-5 uppercase text-xs tracking-[0.2em] hover:bg-brand-ivory hover:text-brand-black transition-all duration-500 group text-brand-ivory/80 hover:border-brand-ivory font-medium">
              <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform" /> Get Directions
            </a>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}
