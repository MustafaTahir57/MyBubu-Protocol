import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is NEXUS Protocol?',
    answer: 'NEXUS Protocol is a next-generation decentralized ecosystem built on blockchain technology, offering ultra-fast transactions, military-grade security, and community-driven governance.',
  },
  {
    question: 'How do I participate in the presale?',
    answer: 'Simply connect your Web3 wallet (MetaMask, Trust Wallet, etc.), ensure you have ETH or USDT, and purchase NEXUS tokens directly through our presale interface.',
  },
  {
    question: 'When will I receive my tokens?',
    answer: 'Tokens will be claimable immediately after the presale ends and the token generation event (TGE) is complete. You\'ll be able to claim them directly to your wallet.',
  },
  {
    question: 'Is the smart contract audited?',
    answer: 'Yes, our smart contracts have been thoroughly audited by leading blockchain security firms. Audit reports are available in our documentation.',
  },
  {
    question: 'What happens after the presale?',
    answer: 'After the presale, NEXUS will be listed on major decentralized exchanges (DEXs) with locked liquidity. The launch price will be 2x the presale price.',
  },
  {
    question: 'Is there a minimum or maximum purchase?',
    answer: 'The minimum purchase is $50 worth of tokens. There is no maximum during the public presale phase, but early phases may have tier-based limits.',
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium uppercase tracking-widest text-sm mb-4 block">
            Got Questions?
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Frequently <span className="gradient-text">Asked</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AccordionItem 
                  value={`item-${index}`} 
                  className="glass-card border-0 px-6 overflow-hidden"
                >
                  <AccordionTrigger className="text-left font-display hover:text-primary transition-colors py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">
                    {faq.answer}
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
