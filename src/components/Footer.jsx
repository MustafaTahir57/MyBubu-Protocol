import { motion } from 'framer-motion';
import { Twitter, MessageCircle, Github, Send } from 'lucide-react';
import mybubuLogo from '@/assets/mybubu-logo.png';

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: MessageCircle, href: '#', label: 'Discord' },
  { icon: Send, href: '#', label: 'Telegram' },
  { icon: Github, href: '#', label: 'GitHub' },
];

export const Footer = () => {
  return (
    <footer className="relative py-16 border-t border-border/50">
      {/* Floating paw prints */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/5 text-4xl"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${30 + Math.random() * 40}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
            }}
          >
            🐾
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <motion.img
              src={mybubuLogo}
              alt="MyBubu"
              className="w-16 h-16 object-contain"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <span className="font-display text-3xl font-bold gradient-text">
              MyBubu
            </span>
          </motion.a>

          {/* Social Links */}
          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.1 }}
                className="w-12 h-12 glass-card flex items-center justify-center rounded-xl hover:border-primary/50 transition-colors group"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground text-sm">
            © 2024 MyBubu Protocol. All rights reserved. 🐱💖
          </p>
        </div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-muted-foreground/60 mt-8 max-w-2xl mx-auto"
        >
          Disclaimer: Cryptocurrency investments carry inherent risks. Please do your own research 
          before participating. This is not financial advice. MyBubu is here for fun! 🐾
        </motion.p>
      </div>
    </footer>
  );
};
