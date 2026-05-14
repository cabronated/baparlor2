import { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { motion } from 'motion/react';

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  startingPrice?: number;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collection(db, 'services'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
        setServices(data);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Priority order for categories
  const priorityOrder = ['Skin & Beauty', 'Hair Services', 'Makeup Services', 'Nail Services'];
  
  // Extract unique categories from fetched services
  const uniqueCategories = Array.from(new Set(services.map(s => s.category))).filter(Boolean) as string[];
  
  // Sort categories according to priority Order, then alphabetical for the rest
  const sortedCategories = uniqueCategories.sort((a, b) => {
    const indexA = priorityOrder.indexOf(a);
    const indexB = priorityOrder.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  const STAGGER = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const FADE_UP = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="pt-40 pb-32 px-6 max-w-5xl mx-auto min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
        <h1 className="text-5xl md:text-7xl mb-6 text-center font-serif tracking-tight">Our <span className="italic text-brand-gold font-light">Services</span></h1>
        <p className="text-center font-light text-brand-black/60 max-w-2xl mx-auto mb-24 text-lg">
          Experience premium treatments curated to enhance your natural beauty.
        </p>

        {loading ? (
          <div className="text-center py-20 text-brand-gold tracking-widest uppercase text-sm">Loading...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 text-brand-black/60 tracking-widest uppercase text-sm">No services found. Please check back later.</div>
        ) : (
          <div className="space-y-32">
            {sortedCategories.map((cat, i) => {
              const catServices = services.filter(s => s.category === cat);

              return (
                <motion.div 
                  key={i} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true, margin: "-100px" }}
                  variants={STAGGER}
                  className="flex flex-col md:flex-row gap-12 md:gap-24 items-start"
                >
                  <motion.div variants={FADE_UP} className="w-full md:w-1/3 sticky top-32">
                    <h2 className="text-3xl md:text-4xl font-serif tracking-tight">{cat}</h2>
                    <div className="w-12 h-[1px] bg-brand-gold mt-6"></div>
                  </motion.div>
                  
                  <div className="w-full md:w-2/3 flex flex-col gap-12">
                    {catServices.map((item, j) => (
                      <motion.div key={item.id || j} variants={FADE_UP} className="group relative">
                        <div className="flex justify-between items-baseline mb-3">
                          <h3 className="text-2xl font-serif tracking-wide">{item.name}</h3>
                          {item.startingPrice && (
                            <span className="text-sm uppercase tracking-widest font-medium text-brand-gold">
                              from ₹{item.startingPrice}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-base font-light text-brand-black/60 leading-relaxed max-w-md">
                            {item.description}
                          </p>
                        )}
                        <div className="absolute -bottom-6 left-0 right-0 h-[1px] bg-brand-black/5 group-hover:bg-brand-gold/30 transition-colors duration-500"></div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
