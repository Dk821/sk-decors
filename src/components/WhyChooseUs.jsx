import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

const features = [
  'Customized Decorations',
  'Premium Quality Materials',
  'Affordable Pricing',
  'Experienced Team',
  'On-Time Setup',
  'Customer Satisfaction'
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-dark text-white">
      {/* Background Decor */}
      <div 
        className="absolute inset-0 opacity-5 bg-center bg-cover"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop')" }}
      ></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="w-12 h-[2px] bg-primary"></span>
                <span className="text-primary font-medium tracking-widest uppercase">Why Choose Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 leading-tight">
                Turning Your Vision <br /> Into Reality
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                With years of experience in the event industry, SK Decor & Event Planner guarantees a seamless, stress-free decoration process. We prioritize your preferences and deliver beyond expectations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <FiCheckCircle className="text-primary text-xl flex-shrink-0" />
                  <span className="text-gray-200 font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 w-full mt-10 lg:mt-0">
             <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-primary/20 p-8 rounded-2xl border border-primary/30 text-center flex flex-col items-center justify-center transform translate-y-8"
                >
                  <h3 className="text-5xl font-heading font-bold text-primary mb-2">500+</h3>
                  <p className="text-gray-300">Events Completed</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white/10 p-8 rounded-2xl border border-white/20 text-center flex flex-col items-center justify-center"
                >
                  <h3 className="text-5xl font-heading font-bold text-white mb-2">100%</h3>
                  <p className="text-gray-300">Client Satisfaction</p>
                </motion.div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
