import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is the MYBUBU Ecosystem?',
    answer: 'MYBUBU is a comprehensive DeFi ecosystem on BSC featuring three interconnected smart contracts: MYBUBU Token (main utility), MYBUBU NFT Node (tiered dividend system), and MYMOMO Token (secondary token with burn mechanics). Together they create a sustainable reward and incentive system.',
  },
  {
    question: 'How does the LP mechanism work?',
    answer: '70% of LP deposits are split into 35% Labubu + 35% BNB, paired automatically on PancakeSwap. 20% goes to referral/network rewards, and 10% to the Global Pool for Node Dividend holders.',
  },
  {
    question: 'What are the NFT Node tiers and rewards?',
    answer: 'There are 6 NFT tiers with multipliers from 1x to 18x based on holdings. Every day, 10% of new BNB is distributed among NFT Node holders. Mint price is 500 USDT with max supply of 1,000 NFTs.',
  },
  {
    question: 'How does the referral system work?',
    answer: 'Multi-level referral rewards across 10 levels: Level 1 (1 invite) = 5%, Level 2 (3 invites) = 4%, Level 3 (5 invites) = 3%, Level 4 (7 invites) = 2%, Levels 5-10 (10 invites) = 1% each.',
  },
  {
    question: 'What are the tokenomics?',
    answer: 'Max supply is 21,000,000 MYBUBU with 2% transfer tax and 5% team reserve. Each wallet can hold maximum 20,000 MYBUBU. 1% of each transaction goes to LP and 1% is burned for deflation protection.',
  },
  {
    question: 'How do I activate dual token rewards?',
    answer: 'To activate Zimo mining and dual token rewards, you need to deposit 100 Labubu + BNB. For partner activation, send 2 Labubu to the new member, and they send 1 back to your wallet.',
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
