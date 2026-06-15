import React from 'react';
import { motion } from 'framer-motion';

const services = [
  {
    id: 1,
    title: 'Photo Booth',
    desc: 'Fun and elegant photo booth setups to capture beautiful memories.',
    img: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Welcome Decor',
    desc: 'Grand entrance decor that gives your guests a warm, royal welcome.',
    img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2069&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Wedding Garland',
    desc: 'Fresh, beautiful custom-designed garlands for the bride and groom.',
    img: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'Mini Entrance Decor',
    desc: 'Charming mini entrances for intimate gatherings and home functions.',
    img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 5,
    title: 'Welcome Name Board',
    desc: 'Personalized, stylish name boards customized to your theme.',
    img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop'
  },
  {
    id: 6,
    title: 'Classic Wedding Decor',
    desc: 'Traditional and modern stage decorations for a picture-perfect wedding.',
    img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Services = () => {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="w-12 h-[2px] bg-primary"></span>
            <span className="text-primary font-medium tracking-widest uppercase">Our Services</span>
            <span className="w-12 h-[2px] bg-primary"></span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-6">
            What We Offer
          </h2>
          <p className="text-gray-600 text-lg">
            From intimate gatherings to grand celebrations, we provide comprehensive decoration services to make your event truly spectacular.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <motion.div 
              key={service.id} 
              variants={itemVariants}
              className="group rounded-2xl overflow-hidden shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/20 transition-shadow bg-cream cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-dark/20 group-hover:bg-dark/0 transition-colors z-10"></div>
                <img 
                  src={service.img} 
                  alt={service.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8 text-center">
                <h3 className="text-2xl font-heading font-bold text-dark mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
