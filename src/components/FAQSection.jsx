import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';

export const FAQSection = () => {
  const { t } = useTranslation();
  const faqs = t('faq.items', { returnObjects: true }) || [];

  return (
    <section id="faq" className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-primary font-medium uppercase tracking-widest text-sm mb-4 block">{t('faq.kicker')}</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            {t('faq.title')} <span className="gradient-text">{t('faq.titleHighlight')}</span>
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <AccordionItem value={`item-${index}`} className="glass-card border-0 px-6 overflow-hidden">
                  <AccordionTrigger className="text-left font-display hover:text-primary transition-colors py-6">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
