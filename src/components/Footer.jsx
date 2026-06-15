import React, { useState, useEffect } from 'react';
import { subscribeToSettings, defaultSettings } from '../services/settingsService';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const unsubscribe = subscribeToSettings(setSettings);
    return () => unsubscribe();
  }, []);

  return (
    <footer className="bg-dark text-white pt-20 pb-10 border-t border-gray-800">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <a href="#home" className="inline-block text-2xl font-heading font-bold text-primary mb-6">
              {settings.businessName}
            </a>
            <p className="text-gray-400 mb-6 leading-relaxed">
              "If You Can Dream It, We Can Create It..."
              Professional event decoration and planning services making your special moments magical.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-primary transition-colors">
                <FiFacebook />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-primary transition-colors">
                <FiInstagram />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-primary transition-colors">
                <FiTwitter />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-primary transition-colors">
                <FiYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-heading font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-400 hover:text-primary transition-colors">Home</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-primary transition-colors">Services</a></li>
              <li><a href="#gallery" className="text-gray-400 hover:text-primary transition-colors">Gallery</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-primary transition-colors">Testimonials</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-heading font-bold mb-6 text-white">Our Services</h4>
            <ul className="space-y-3">
              <li className="text-gray-400">Wedding Decor</li>
              <li className="text-gray-400">Engagement Decor</li>
              <li className="text-gray-400">Birthday Parties</li>
              <li className="text-gray-400">Baby Showers</li>
              <li className="text-gray-400">Puberty Ceremonies</li>
              <li className="text-gray-400">Corporate Events</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-heading font-bold mb-6 text-white">Contact Info</h4>
            <ul className="space-y-4">
              <li className="text-gray-400">
                <span className="block text-white font-medium mb-1">Address:</span>
                {settings.address}
              </li>
              <li className="text-gray-400">
                <span className="block text-white font-medium mb-1">Phone:</span>
                {settings.phone1} <br/> {settings.phone2}
              </li>
              <li className="text-gray-400">
                <span className="block text-white font-medium mb-1">Email:</span>
                {settings.email}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© 2026 SK Decor & Event Planner. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
