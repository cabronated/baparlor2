import { useEffect, useState, useMemo } from 'react';
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Plus, Minus, Tag, Zap, Crown, X, MessageCircle } from 'lucide-react';
import { useGlobalSettings } from '../lib/useGlobalSettings';

interface PremiumPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  image?: string;
  isPopular?: boolean;
  isBestValue?: boolean;
  services: string[];
}

interface Service {
  id: string;
  name: string;
  category: string;
  startingPrice?: number;
}

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function Packages() {
  const [packages, setPackages] = useState<PremiumPackage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [builderConfig, setBuilderConfig] = useState({
    enabled: true,
    tier1Count: 2,
    tier1DiscountPercent: 10,
    tier2Count: 3,
    tier2DiscountPercent: 15,
    tier3Count: 5,
    tier3DiscountPercent: 20,
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const { settings } = useGlobalSettings();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState<{ title: string; price: number; details?: string } | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgSnap, srvSnap, builderSnap] = await Promise.all([
          getDocs(query(collection(db, 'packages'))),
          getDocs(query(collection(db, 'services'))),
          getDoc(doc(db, 'global', 'builder'))
        ]);
        
        const pkgs = pkgSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PremiumPackage));
        setPackages(pkgs);
        
        const srvs = srvSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
        setServices(srvs);

        if (builderSnap.exists()) {
          setBuilderConfig({ ...builderConfig, ...builderSnap.data() as any });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'packages');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openModal = (data: { title: string; price: number; details?: string }) => {
    setBookingData(data);
    setIsModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !bookingData) return;

    const waNumber = settings.whatsapp ? settings.whatsapp.replace(/\D/g, '') : settings.phone1.replace(/\D/g, '');
    let textMessage = `Hello, my name is ${userName}.\n\n`;
    textMessage += `I would like to book the following package:\n`;
    textMessage += `*${bookingData.title}*\n`;
    textMessage += `Price: ₹${bookingData.price}\n`;
    if (bookingData.details) {
      textMessage += `\nDetails: ${bookingData.details}`;
    }

    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(textMessage)}`;
    window.open(waUrl, '_blank');
    setIsModalOpen(false);
    setUserName('');
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const builderSummary = useMemo(() => {
    const selected = services.filter(s => selectedServices.includes(s.id));
    const totalPrice = selected.reduce((sum, s) => sum + (s.startingPrice || 0), 0);
    const count = selected.length;
    
    let discountPercent = 0;
    if (count >= builderConfig.tier3Count) discountPercent = builderConfig.tier3DiscountPercent;
    else if (count >= builderConfig.tier2Count) discountPercent = builderConfig.tier2DiscountPercent;
    else if (count >= builderConfig.tier1Count) discountPercent = builderConfig.tier1DiscountPercent;

    const discountAmount = Math.round(totalPrice * (discountPercent / 100));
    const finalPrice = totalPrice - discountAmount;

    return {
      selected,
      totalPrice,
      count,
      discountPercent,
      discountAmount,
      finalPrice
    };
  }, [selectedServices, services, builderConfig]);

  const uniqueCategories = Array.from(new Set(services.map(s => s.category))).filter(Boolean);

  const defaultImage = "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="pt-40 pb-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" animate="visible" variants={STAGGER}>
          <motion.div variants={FADE_UP} className="flex justify-center items-center gap-4 mb-6">
            <div className="w-8 h-[1px] bg-brand-gold"></div>
            <span className="uppercase text-[10px] tracking-widest text-brand-gold font-medium">Invest In Yourself</span>
            <div className="w-8 h-[1px] bg-brand-gold"></div>
          </motion.div>
          
          <motion.h1 variants={FADE_UP} className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] mb-6 text-center font-serif tracking-tight">
            Premium <span className="italic text-brand-gold font-light">Packages</span>
          </motion.h1>
          <motion.p variants={FADE_UP} className="text-center font-light text-brand-black/60 max-w-2xl mx-auto mb-24 text-lg">
            Curated beauty experiences designed for your ultimate transformation, or build your own custom combination.
          </motion.p>
        </motion.div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-brand-gold tracking-widest uppercase text-sm">Loading Premium Offers...</div>
      ) : (
        <>
          {/* Ready-Made Packages */}
          {packages.length > 0 && (
            <div className="max-w-7xl mx-auto px-6 mb-32">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg) => (
                  <motion.div key={pkg.id} variants={FADE_UP} className="group flex flex-col bg-white border border-brand-black/5 hover:border-brand-gold transition-all duration-500 shadow-sm hover:shadow-2xl relative overflow-hidden h-full">
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                      {pkg.isPopular && (
                        <div className="bg-brand-black text-brand-ivory text-[10px] uppercase tracking-widest px-3 py-1 flex items-center gap-1.5 shadow-lg">
                          <Zap className="w-3 h-3 text-brand-gold" /> Popular
                        </div>
                      )}
                      {pkg.isBestValue && (
                        <div className="bg-brand-gold text-brand-ivory text-[10px] uppercase tracking-widest px-3 py-1 flex items-center gap-1.5 shadow-lg">
                          <Crown className="w-3 h-3" /> Best Value
                        </div>
                      )}
                    </div>

                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-brand-black/20 group-hover:bg-brand-black/0 transition-colors duration-500 z-10"></div>
                      <img src={pkg.image || defaultImage} alt={pkg.title} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-out" />
                    </div>
                    
                    <div className="p-8 lg:p-10 flex-grow flex flex-col">
                      <h3 className="text-2xl font-serif mb-3 tracking-tight group-hover:text-brand-gold transition-colors duration-500">{pkg.title}</h3>
                      <p className="text-sm font-light text-brand-black/60 mb-6 leading-relaxed line-clamp-3 min-h-[60px]">{pkg.description}</p>
                      
                      <div className="mb-8">
                        <div className="flex items-end gap-3 mb-1">
                          <span className="text-4xl font-sans font-semibold tracking-tight">₹{pkg.price}</span>
                          {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                            <span className="text-lg text-brand-black/40 line-through mb-1 font-sans">₹{pkg.originalPrice}</span>
                          )}
                        </div>
                        {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                          <div className="inline-flex items-center gap-1.5 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 mt-2">
                            <Tag className="w-3 h-3" /> Save ₹{pkg.originalPrice - pkg.price}
                          </div>
                        )}
                      </div>
                      
                      <div className="h-[1px] w-full bg-brand-black/5 mb-6"></div>
                      
                      <ul className="space-y-3 mb-10 flex-grow">
                        {(pkg.services || []).slice(0, 5).map((service, i) => (
                          <li key={i} className="flex gap-3 text-sm font-light items-start">
                             <Check className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" /> 
                             <span className="text-brand-black/80">{service}</span>
                          </li>
                        ))}
                        {(pkg.services || []).length > 5 && (
                          <li className="text-xs text-brand-black/40 italic mt-2">+ {(pkg.services || []).length - 5} more elegant services</li>
                        )}
                      </ul>

                      <div className="mt-auto">
                        <button 
                          onClick={() => openModal({ title: pkg.title, price: pkg.price, details: (pkg.services || []).join(', ') })}
                          className="relative overflow-hidden flex items-center justify-center w-full bg-brand-ivory hover:bg-brand-black border border-brand-black/20 hover:border-brand-black group/btn transition-colors duration-500 py-4"
                        >
                          <span className="text-xs uppercase tracking-[0.2em] font-medium text-brand-black group-hover/btn:text-brand-gold transition-colors duration-500">Book Package</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* Custom Package Builder */}
          {builderConfig.enabled && services.length > 0 && (
            <div className="bg-brand-ivory/50 border-t border-b border-brand-black/5 py-32">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">Build Your Own <span className="italic text-brand-gold font-light">Makeover</span></h2>
                  <p className="font-light text-brand-black/60 max-w-2xl mx-auto">
                    Select the services you desire and watch as our smart pricing applies fair combo discounts automatically. The more you add, the more you save.
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                  {/* Service Selection */}
                  <div className="w-full lg:w-2/3 space-y-12">
                    {uniqueCategories.map(category => {
                      const catServices = services.filter(s => s.category === category);
                      if (catServices.length === 0) return null;
                      return (
                        <div key={category}>
                          <h3 className="text-xl font-serif tracking-tight mb-6 flex items-center gap-4">
                            {category}
                            <div className="flex-grow h-[1px] bg-brand-black/5"></div>
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {catServices.map(service => {
                              const isSelected = selectedServices.includes(service.id);
                              return (
                                <button
                                  key={service.id}
                                  onClick={() => toggleService(service.id)}
                                  className={`flex justify-between items-center p-4 border transition-all duration-300 text-left ${
                                    isSelected 
                                      ? 'border-brand-gold bg-brand-gold/5 shadow-md' 
                                      : 'border-brand-black/10 bg-white hover:border-brand-black/30'
                                  }`}
                                >
                                  <div className="flex items-center gap-4">
                                    <div className={`w-5 h-5 flex items-center justify-center border transition-colors ${
                                      isSelected ? 'border-brand-gold bg-brand-gold text-brand-ivory' : 'border-brand-black/20'
                                    }`}>
                                      {isSelected && <Check className="w-3 h-3" />}
                                    </div>
                                    <div>
                                      <div className={`text-sm ${isSelected ? 'font-medium' : 'font-light'}`}>{service.name}</div>
                                      <div className="text-xs text-brand-black/50 mt-1">₹{service.startingPrice || '-'}</div>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Package Summary */}
                  <div className="w-full lg:w-1/3">
                    <div className="sticky top-32 bg-white border border-brand-black/10 p-8 shadow-xl">
                      <h3 className="text-2xl font-serif tracking-tight mb-6">Your Summary</h3>
                      
                      {builderSummary.count === 0 ? (
                        <div className="text-center py-10">
                          <p className="text-sm font-light text-brand-black/40 italic">Select services to build your custom package.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {builderSummary.selected.map(s => (
                              <div key={s.id} className="flex justify-between text-sm font-light items-start gap-4">
                                <span>{s.name}</span>
                                <span className="text-brand-black/60">₹{s.startingPrice || '-'}</span>
                              </div>
                            ))}
                          </div>

                          <div className="h-[1px] bg-brand-black/10"></div>

                          <div className="space-y-3">
                            <div className="flex justify-between text-sm font-light">
                              <span>Subtotal</span>
                              <span>₹{builderSummary.totalPrice}</span>
                            </div>
                            
                            {builderSummary.discountPercent > 0 && (
                              <div className="flex justify-between text-sm font-medium text-green-600 bg-green-50/50 p-2 -mx-2 rounded">
                                <span>Combo Discount ({builderSummary.discountPercent}%)</span>
                                <span>-₹{builderSummary.discountAmount}</span>
                              </div>
                            )}
                          </div>

                          <div className="h-[1px] bg-brand-black/10"></div>

                          <div className="flex justify-between items-end">
                            <div>
                              <span className="block text-[10px] uppercase tracking-widest text-brand-black/50 mb-1 font-medium">Total Combo Price</span>
                              <span className="text-4xl font-sans font-semibold tracking-tight">₹{builderSummary.finalPrice}</span>
                            </div>
                          </div>

                          <div className="pt-4">
                            <button 
                              onClick={() => openModal({ 
                                title: 'Custom Beauty Combo', 
                                price: builderSummary.finalPrice, 
                                details: builderSummary.selected.map(s => s.name).join(', ') 
                              })}
                              className="relative overflow-hidden flex items-center justify-center w-full bg-brand-black py-4 group/btn"
                            >
                              <span className="text-xs uppercase tracking-[0.2em] font-medium text-brand-ivory group-hover/btn:text-brand-gold transition-colors duration-500">Book Custom Combo</span>
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-8 bg-brand-ivory/50 p-4 border border-brand-black/5">
                        <h4 className="text-[10px] uppercase tracking-widest text-brand-black/50 mb-3 font-medium">Smart Savings Guide</h4>
                        <ul className="text-xs font-light text-brand-black/70 space-y-2">
                          <li className={`flex items-center gap-2 ${builderSummary.count >= builderConfig.tier1Count && builderSummary.count < builderConfig.tier2Count ? 'text-brand-gold font-medium' : ''}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {builderConfig.tier1Count} services: {builderConfig.tier1DiscountPercent}% off
                          </li>
                          <li className={`flex items-center gap-2 ${builderSummary.count >= builderConfig.tier2Count && builderSummary.count < builderConfig.tier3Count ? 'text-brand-gold font-medium' : ''}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {builderConfig.tier2Count}-{builderConfig.tier3Count - 1} services: {builderConfig.tier2DiscountPercent}% off
                          </li>
                          <li className={`flex items-center gap-2 ${builderSummary.count >= builderConfig.tier3Count ? 'text-brand-gold font-medium' : ''}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {builderConfig.tier3Count}+ services: {builderConfig.tier3DiscountPercent}% off
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Booking Modal */}
      <AnimatePresence>
        {isModalOpen && bookingData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white shadow-2xl p-8 lg:p-12 overflow-hidden"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-brand-black/40 hover:text-brand-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative z-10">
                <div className="flex flex-col items-center text-center mb-10">
                  <div className="w-12 h-[1px] bg-brand-gold mb-4"></div>
                  <h3 className="text-3xl font-serif tracking-tight mb-2">Book Your Experience</h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-gold font-medium">Luxury is Awaiting You</p>
                </div>

                <div className="bg-brand-ivory/50 p-6 border border-brand-black/5 mb-8">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest text-brand-black/40 mb-1">Inquiry for</p>
                    <h4 className="text-xl font-serif mb-2">{bookingData.title}</h4>
                    <p className="text-2xl text-brand-gold font-sans font-semibold tracking-tight">₹{bookingData.price}</p>
                    {bookingData.details && (
                      <p className="text-[10px] text-brand-black/40 mt-3 line-clamp-2 italic">{bookingData.details}</p>
                    )}
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="group relative">
                    <input 
                      type="text" 
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder=" " 
                      className="w-full bg-transparent border-b border-brand-black/20 py-3 peer focus:outline-none focus:border-brand-gold transition-colors text-lg font-light" 
                    />
                    <label className="absolute left-0 top-3 text-brand-black/50 font-light transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-gold peer-focus:uppercase peer-focus:tracking-widest peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:tracking-widest">Your Full Name</label>
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit" 
                      className="relative overflow-hidden w-full bg-brand-black text-brand-ivory py-5 uppercase text-xs tracking-[0.2em] transition-all duration-500 group shadow-xl flex items-center justify-center gap-3"
                    >
                      <MessageCircle className="w-4 h-4 text-brand-gold" />
                      <span className="relative z-10 group-hover:text-brand-gold transition-colors duration-500">Confirm on WhatsApp</span>
                      <div className="absolute inset-0 bg-brand-ivory/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                    </button>
                  </div>
                </form>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl -ml-12 -mb-12"></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

