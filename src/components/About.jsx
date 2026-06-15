import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiHeart, FiUsers, FiClock } from 'react-icons/fi';

const features = [
  { icon: <FiHeart />, title: 'Creative Designs', desc: 'Unique concepts tailored to your vision.' },
  { icon: <FiStar />, title: 'Affordable Packages', desc: 'Premium quality within your budget.' },
  { icon: <FiUsers />, title: 'Professional Team', desc: 'Experienced decorators and planners.' },
  { icon: <FiClock />, title: 'Timely Execution', desc: 'Punctual setup and flawless execution.' },
];

const About = () => {
  return (
    <section id="about" className="py-24 bg-cream">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop" 
                alt="Wedding Decoration" 
                className="rounded-2xl shadow-xl w-full h-auto object-cover aspect-[4/5]"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl hidden md:block">
                <p className="text-4xl font-heading text-primary font-bold">10+</p>
                <p className="text-gray-600 font-medium">Years of Experience</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="mb-4 flex items-center gap-4">
              <span className="w-12 h-[2px] bg-primary"></span>
              <span className="text-primary font-medium tracking-widest uppercase">About Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-dark mb-6">
              Making Your Special Moments Magical
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              SK Decor & Event Planner is a professional event decoration and planning service specializing in creating memorable celebrations. We design elegant engagements, weddings, baby showers, birthday parties, puberty ceremonies, and other special occasions tailored to your style and budget.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-start"
                >
                  <div className="text-primary text-2xl bg-cream p-3 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-dark mb-1 font-heading text-lg">{feature.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
