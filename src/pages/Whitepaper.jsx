import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import mybubuLogo from '@/assets/mybubu-logo.png';

const Whitepaper = () => {
  const navigate = useNavigate();

  const handlePrint = () => window.print();

  return (
    <>
      {/* Screen-only controls */}
      <div className="print:hidden fixed top-6 left-6 right-6 z-50 flex justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted transition-colors text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity text-sm">
          <Printer size={16} /> Save as PDF
        </button>
      </div>

      {/* Printable Document */}
      <div className="min-h-screen bg-background print:bg-white print:text-black">
        {/* PAGE 1 */}
        <div className="max-w-[800px] mx-auto px-8 pt-24 pb-12 print:pt-8 print:pb-0 print:px-12 page-break-after">
          {/* Header */}
          <div className="flex items-center gap-5 mb-10 print:mb-8">
            <img src={mybubuLogo} alt="MyBubu Logo" className="w-20 h-20 print:w-16 print:h-16 object-contain" />
            <div>
              <h1 className="text-4xl print:text-3xl font-bold gradient-text print:text-black" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                MYBUBU Ecosystem
              </h1>
              <p className="text-muted-foreground print:text-gray-500 text-sm mt-1 tracking-widest uppercase">
                DeFi Protocol on Binance Smart Chain
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-1 rounded-full bg-gradient-to-r from-primary via-secondary to-primary mb-8 print:from-pink-500 print:via-orange-400 print:to-pink-500" />

          {/* Overview */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-primary print:text-pink-600 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Overview
            </h2>
            <p className="text-foreground print:text-gray-800 leading-relaxed text-sm">
              MYBUBU is a comprehensive DeFi protocol on BSC featuring dual-token mechanics (MYBUBU + MYMOMO), 
              NFT Node dividends, and a 10-level referral system. The ecosystem is designed for sustainable growth 
              through deflationary tokenomics, automated liquidity provisioning, and community-driven rewards.
            </p>
          </section>

          {/* Tokenomics */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-primary print:text-pink-600 mb-4 uppercase tracking-wide" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Tokenomics
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                ['Max Supply', '21,000,000 MYBUBU'],
                ['Transfer Tax', '2% (1% LP + 1% Burn)'],
                ['Max Wallet', '20,000 MYBUBU'],
                ['Network', 'Binance Smart Chain'],
                ['Team Reserve', '5%'],
                ['Joining Fee', '1 MYBUBU'],
              ].map(([label, value]) => (
                <div key={label} className="border border-border print:border-gray-300 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground print:text-gray-500 uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-semibold text-foreground print:text-gray-900 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* LP Mechanism */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-primary print:text-pink-600 mb-4 uppercase tracking-wide" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              LP Mechanism (BNB Deposit Split)
            </h2>
            <div className="space-y-2">
              {[
                { pct: '70%', label: 'Liquidity Pool', desc: '35% MYBUBU + 35% BNB paired on PancakeSwap' },
                { pct: '20%', label: 'Referral & Network', desc: 'Distributed across 10-level referral system' },
                { pct: '10%', label: 'Global Pool', desc: 'Distributed daily to NFT Node dividend holders' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 border border-border print:border-gray-300 rounded-lg p-3">
                  <span className="text-lg font-bold text-primary print:text-pink-600 min-w-[50px]" style={{ fontFamily: 'Orbitron, sans-serif' }}>{item.pct}</span>
                  <div>
                    <p className="font-semibold text-sm text-foreground print:text-gray-900">{item.label}</p>
                    <p className="text-xs text-muted-foreground print:text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Referral System */}
          <section>
            <h2 className="text-xl font-bold text-primary print:text-pink-600 mb-4 uppercase tracking-wide" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              10-Level Referral System
            </h2>
            <div className="overflow-hidden rounded-lg border border-border print:border-gray-300">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 print:bg-gray-100">
                    <th className="text-left p-2.5 text-xs uppercase tracking-wide text-muted-foreground print:text-gray-600">Level</th>
                    <th className="text-left p-2.5 text-xs uppercase tracking-wide text-muted-foreground print:text-gray-600">Min Invites</th>
                    <th className="text-left p-2.5 text-xs uppercase tracking-wide text-muted-foreground print:text-gray-600">Reward %</th>
                  </tr>
                </thead>
                <tbody className="text-foreground print:text-gray-800">
                  {[
                    [1, 1, '5%'], [2, 3, '4%'], [3, 5, '3%'],
                    [4, 7, '2%'], ['5–10', 10, '1% each'],
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-border print:border-gray-200">
                      <td className="p-2.5 font-semibold">Level {row[0]}</td>
                      <td className="p-2.5">{row[1]} {row[1] === 1 ? 'person' : 'people'}</td>
                      <td className="p-2.5 font-semibold text-primary print:text-pink-600">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* PAGE 2 */}
        <div className="max-w-[800px] mx-auto px-8 pt-12 pb-16 print:pt-8 print:pb-0 print:px-12">
          {/* Page 2 header */}
          <div className="flex items-center gap-3 mb-8 print:mb-6">
            <img src={mybubuLogo} alt="MyBubu" className="w-10 h-10 print:w-8 print:h-8 object-contain" />
            <span className="text-lg font-bold gradient-text print:text-black" style={{ fontFamily: 'Orbitron, sans-serif' }}>MYBUBU Ecosystem</span>
            <div className="flex-1 h-px bg-border print:bg-gray-300 ml-4" />
          </div>

          {/* NFT Node System */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-primary print:text-pink-600 mb-4 uppercase tracking-wide" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              NFT Node Reward System
            </h2>
            <p className="text-sm text-foreground print:text-gray-800 leading-relaxed mb-4">
              NFT Nodes cost <strong>500 USDT</strong> each (max supply: 1,000). 
              10% of daily new BNB deposits are distributed to NFT holders. Higher tiers unlock greater multipliers.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { tier: 'Basic', nfts: '1 NFT', mult: '1x', color: 'border-gray-400 print:border-gray-400' },
                { tier: 'Bronze', nfts: '2 NFTs', mult: '2x', color: 'border-amber-600 print:border-amber-600' },
                { tier: 'Silver', nfts: '3 NFTs', mult: '3x', color: 'border-gray-300 print:border-gray-400' },
                { tier: 'Gold', nfts: '5 NFTs', mult: '5x', color: 'border-yellow-400 print:border-yellow-500' },
                { tier: 'Platinum', nfts: '10 NFTs', mult: '10x', color: 'border-cyan-400 print:border-cyan-500' },
                { tier: 'VIP', nfts: '18 NFTs', mult: '18x', color: 'border-primary print:border-pink-500' },
              ].map((t) => (
                <div key={t.tier} className={`border-2 ${t.color} rounded-lg p-3 text-center`}>
                  <p className="font-bold text-sm text-foreground print:text-gray-900">{t.tier}</p>
                  <p className="text-xl font-bold text-primary print:text-pink-600 my-1" style={{ fontFamily: 'Orbitron, sans-serif' }}>{t.mult}</p>
                  <p className="text-xs text-muted-foreground print:text-gray-500">{t.nfts}</p>
                </div>
              ))}
            </div>
          </section>

          {/* User Flow */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-primary print:text-pink-600 mb-4 uppercase tracking-wide" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              User Onboarding Flow
            </h2>
            <div className="space-y-3">
              {[
                { step: '1', title: 'Join the Ecosystem', desc: 'Enter a referrer address (or use the default). Pay 1 MYBUBU token as joining fee to activate your account.' },
                { step: '2', title: 'Deposit BNB', desc: 'Deposit 0.1 to 2 BNB. Funds are split: 70% to LP (35% MYBUBU + 35% BNB), 20% to referral rewards, 10% to the global dividend pool.' },
                { step: '3', title: 'Buy Tokens (Optional)', desc: 'Purchase MYBUBU tokens directly with USDT. A 2% buy tax applies (1% LP + 1% Burn). Max wallet limit of 20,000 MYBUBU.' },
                { step: '4', title: 'Mint NFT Nodes (Optional)', desc: 'Mint 1–18 NFT Nodes at 500 USDT each to unlock tiered reward multipliers and earn daily BNB dividends from the global pool.' },
              ].map((s) => (
                <div key={s.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary print:bg-pink-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary-foreground print:text-white">{s.step}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground print:text-gray-900">{s.title}</p>
                    <p className="text-xs text-muted-foreground print:text-gray-500 leading-relaxed mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Dual Token */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-primary print:text-pink-600 mb-4 uppercase tracking-wide" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Dual Token Mechanics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-border print:border-gray-300 rounded-lg p-4">
                <h3 className="font-bold text-foreground print:text-gray-900 mb-2">MYBUBU (Primary)</h3>
                <ul className="text-xs text-muted-foreground print:text-gray-600 space-y-1 list-disc list-inside">
                  <li>21M max supply</li>
                  <li>2% transfer tax</li>
                  <li>Deflationary via burn</li>
                  <li>LP paired with BNB</li>
                </ul>
              </div>
              <div className="border border-border print:border-gray-300 rounded-lg p-4">
                <h3 className="font-bold text-foreground print:text-gray-900 mb-2">MYMOMO (Secondary)</h3>
                <ul className="text-xs text-muted-foreground print:text-gray-600 space-y-1 list-disc list-inside">
                  <li>Burn mechanics</li>
                  <li>Dual reward mining</li>
                  <li>Activated via deposit</li>
                  <li>100 MYBUBU + BNB required</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Tech Stack */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-primary print:text-pink-600 mb-3 uppercase tracking-wide" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Technology Stack
            </h2>
            <p className="text-sm text-foreground print:text-gray-800 leading-relaxed">
              <strong>Frontend:</strong> React 18, Vite, TypeScript, Tailwind CSS, Framer Motion &nbsp;|&nbsp;
              <strong>Network:</strong> Binance Smart Chain (BEP-20) &nbsp;|&nbsp;
              <strong>DEX:</strong> PancakeSwap V2
            </p>
          </section>

          {/* Footer */}
          <div className="h-1 rounded-full bg-gradient-to-r from-primary via-secondary to-primary mt-8 mb-4 print:from-pink-500 print:via-orange-400 print:to-pink-500" />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground print:text-gray-400">© 2025 MYBUBU Ecosystem. All rights reserved.</p>
            <p className="text-xs text-muted-foreground print:text-gray-400">Built on Binance Smart Chain</p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page-break-after { page-break-after: always; }
          @page { margin: 0.5in; size: A4; }
        }
      `}</style>
    </>
  );
};

export default Whitepaper;
