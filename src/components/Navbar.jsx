import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GlowButton } from './GlowButton';
import { LanguageSwitcher } from './LanguageSwitcher';
import mybubuLogo from '@/assets/mybubu-logo.png';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navLinks = [
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.mechanism'), href: '#mechanism' },
    { label: t('nav.tokenomics'), href: '#tokenomics' },
    { label: t('nav.nftNodes'), href: '#nft-nodes' },
    { label: t('nav.referral'), href: '#referral' },
    { label: t('nav.faq'), href: '#faq' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-0 border-b border-border/50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <motion.a href="#" whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
            <motion.img
              src={mybubuLogo}
              alt="MyBubu"
              className="w-12 h-12 object-contain"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="font-display text-2xl font-bold gradient-text">MyBubu</span>
          </motion.a>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-muted-foreground hover:text-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
            <LanguageSwitcher />
            <GlowButton onClick={() => navigate('/app')}>{t('nav.buyNow')}</GlowButton>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-foreground">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        className="md:hidden overflow-hidden bg-card/95 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-muted-foreground hover:text-primary transition-colors py-2"
            >
              {link.label}
            </a>
          ))}
          <GlowButton onClick={() => { setIsOpen(false); navigate('/app'); }}>{t('nav.buyNow')}</GlowButton>
        </div>
      </motion.div>
    </motion.nav>
  );
};
