'use client';

import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  Briefcase, 
  ArrowRight,
  Sliders,
  Scale,
  GitBranch,
  Globe,
  PieChart,
  Coins
} from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface OfferCalculatorProps {
  userProfile: UserProfile;
  onSendPrompt: (prompt: string) => void;
  isLoading: boolean;
}

export function OfferCalculator({
  userProfile,
  onSendPrompt,
  isLoading,
}: OfferCalculatorProps) {
  const [baseSalary, setBaseSalary] = useState<number>(220000);
  const [equityTotal, setEquityTotal] = useState<number>(180000);
  const [signOnBonus, setSignOnBonus] = useState<number>(30000);
  const [targetCompany, setTargetCompany] = useState<string>(userProfile.targetCompanies?.[0] || 'Stripe');

  // 1. Equity Schedule Modeler State
  const [vestingModel, setVestingModel] = useState<'standard' | 'backloaded' | 'frontloaded'>('standard');
  const [projectedGrowth, setProjectedGrowth] = useState<number>(2); // 1x, 2x, 5x
  const [strikePrice, setStrikePrice] = useState<number>(12);

  // 2. Multi-Currency & Tax Arbitrage State
  const [selectedGeo, setSelectedGeo] = useState<'sf' | 'london' | 'blr'>('sf');

  // 3. Dynamic Negotiation Branching Tree State
  const [activeBranch, setActiveBranch] = useState<'base_capped' | 'equity_fixed' | 'exploding_offer'>('base_capped');

  // Calculations for Vesting Schedule
  const vestingSchedules = {
    standard: [0.25, 0.25, 0.25, 0.25],
    backloaded: [0.05, 0.15, 0.40, 0.40], // Amazon-style
    frontloaded: [0.40, 0.30, 0.20, 0.10],
  };

  const currentSplit = vestingSchedules[vestingModel];
  const yearByYearEquity = currentSplit.map(pct => Math.round(equityTotal * pct * projectedGrowth));
  const yearOneTotal = baseSalary + yearByYearEquity[0] + signOnBonus;
  const fourYearGrandTotal = (baseSalary * 4) + yearByYearEquity.reduce((a, b) => a + b, 0) + signOnBonus;

  // Geo Tax Rates & Purchasing Power Index
  const geoData = {
    sf: { name: 'San Francisco, CA', taxRate: 0.38, colIndex: 100, currency: '$' },
    london: { name: 'London, UK', taxRate: 0.42, colIndex: 78, currency: '£' },
    blr: { name: 'Bengaluru / Hyderabad Remote', taxRate: 0.31, colIndex: 28, currency: '₹' },
  };

  const currentGeo = geoData[selectedGeo];
  const estNetTakeHomeYearOne = Math.round(yearOneTotal * (1 - currentGeo.taxRate));

  const handleGenerateScript = () => {
    onSendPrompt(
      `Please formulate a high-leverage compensation counter-offer script for ${targetCompany} (${userProfile.targetRoles?.[0] || 'Staff Engineer'}). Current Offer: $${baseSalary.toLocaleString()} Base, $${equityTotal.toLocaleString()} 4-yr Equity (${vestingModel} vesting schedule), $${signOnBonus.toLocaleString()} Sign-On ($${yearOneTotal.toLocaleString()} Year 1 TC). Target: Negotiate to $${(baseSalary * 1.1).toLocaleString()} Base, $${(equityTotal * 1.25).toLocaleString()} Equity, and $45,000 Sign-on. Address recruiter pushback scenario: "${activeBranch.replace('_', ' ')}".`
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-w-5xl mx-auto">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[var(--text-main)]">
                Advanced Compensation & Tax Engineering Lab
              </h2>
              <Badge variant="primary" className="text-[10px] py-0.5">
                Pillar 5 • Executive Quant
              </Badge>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              4-Year vesting schedules, multi-currency tax arbitrage, and branching negotiation trees for {targetCompany}.
            </p>
          </div>
        </div>

        <Button
          variant="gradient"
          size="sm"
          disabled={isLoading}
          onClick={handleGenerateScript}
          className="text-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generate Branching Script</span>
        </Button>
      </div>

      {/* Main Parameters & Year 1 Total Comp */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white border border-gray-200 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            Offer Parameters & Levers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                Base Salary ($ / yr)
              </label>
              <input
                type="number"
                step="5000"
                value={baseSalary}
                onChange={(e) => setBaseSalary(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)] font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                4-Year Total Equity Grant ($)
              </label>
              <input
                type="number"
                step="10000"
                value={equityTotal}
                onChange={(e) => setEquityTotal(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)] font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                Sign-on Bonus ($ Year 1)
              </label>
              <input
                type="number"
                step="5000"
                value={signOnBonus}
                onChange={(e) => setSignOnBonus(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)] font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                Target Company
              </label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Right Summary Card (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
              Year 1 Total Compensation (TC)
            </span>
            <div className="text-3xl font-extrabold text-[var(--text-main)] font-mono mt-1">
              ${yearOneTotal.toLocaleString()}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Base ${baseSalary.toLocaleString()} + Equity Y1 ${yearByYearEquity[0].toLocaleString()} + Sign-On ${signOnBonus.toLocaleString()}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span>4-Year Grand Total:</span>
              <span className="font-mono font-bold text-emerald-500">${fourYearGrandTotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span>Estimated Net Take-Home (Y1):</span>
              <span className="font-mono text-[var(--text-main)]">${estNetTakeHomeYearOne.toLocaleString()} (after {Math.round(currentGeo.taxRate * 100)}% est. tax)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Equity Schedule Modeler */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-[var(--text-main)]">4-Year Equity Schedule & Dilution Modeler</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)]">Growth Multiple:</span>
            {[1, 2, 3, 5].map(mult => (
              <button
                key={mult}
                onClick={() => setProjectedGrowth(mult)}
                className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-all ${
                  projectedGrowth === mult ? 'bg-emerald-500 text-white' : 'bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
                }`}
              >
                {mult}x
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Preset Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setVestingModel('standard')}
            className={`p-3 rounded-xl border text-left text-xs transition-all ${
              vestingModel === 'standard' ? 'border-indigo-500 bg-indigo-500/10' : 'border-[var(--border-color)] bg-[var(--bg-main)]'
            }`}
          >
            <div className={`font-bold ${vestingModel === 'standard' ? 'text-[var(--text-main)]' : 'text-[var(--text-main)]'}`}>Standard 25/25/25/25</div>
            <div className="text-[11px] text-[var(--text-muted)]">Equal 25% distribution each year with 1-year cliff.</div>
          </button>

          <button
            onClick={() => setVestingModel('backloaded')}
            className={`p-3 rounded-xl border text-left text-xs transition-all ${
              vestingModel === 'backloaded' ? 'border-indigo-500 bg-indigo-500/10' : 'border-[var(--border-color)] bg-[var(--bg-main)]'
            }`}
          >
            <div className="font-bold text-[var(--text-main)]">Backloaded 5/15/40/40 (Amazon)</div>
            <div className="text-[11px] text-[var(--text-muted)]">Requires high year-1 sign-on bonus to offset early lag.</div>
          </button>

          <button
            onClick={() => setVestingModel('frontloaded')}
            className={`p-3 rounded-xl border text-left text-xs transition-all ${
              vestingModel === 'frontloaded' ? 'border-indigo-500 bg-indigo-500/10' : 'border-[var(--border-color)] bg-[var(--bg-main)]'
            }`}
          >
            <div className="font-bold text-[var(--text-main)]">Frontloaded 40/30/20/10</div>
            <div className="text-[11px] text-[var(--text-muted)]">Maximizes liquidity during years 1 & 2 for accelerated upside.</div>
          </button>
        </div>

        {/* Year-by-Year Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {yearByYearEquity.map((val, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
              <span className="text-[11px] font-semibold text-[var(--text-muted)] block">Year {idx + 1} ({Math.round(currentSplit[idx] * 100)}%)</span>
              <span className="text-base font-bold font-mono text-emerald-500 mt-1 block">
                ${val.toLocaleString()}
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">Cash + Stock: ${(baseSalary + val).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Multi-Currency & Tax Arbitrage */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-[var(--text-main)]">Multi-Currency & Tax Arbitrage Calculator</h3>
          </div>
          <div className="flex gap-2">
            {(['sf', 'london', 'blr'] as const).map(geoKey => (
              <button
                key={geoKey}
                onClick={() => setSelectedGeo(geoKey)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedGeo === geoKey ? 'bg-blue-600 text-white' : 'bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
                }`}
              >
                {geoData[geoKey].name.split(',')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <span className="text-[var(--text-muted)] block text-[11px]">Effective Tax Bracket</span>
            <span className="text-base font-bold font-mono text-[var(--text-main)] mt-0.5 block">{Math.round(currentGeo.taxRate * 100)}%</span>
            <span className="text-[10px] text-[var(--text-muted)]">Includes Federal + State / Regional</span>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <span className="text-[var(--text-muted)] block text-[11px]">Cost of Living Index (COL)</span>
            <span className="text-base font-bold font-mono text-emerald-500 mt-0.5 block">{currentGeo.colIndex} / 100</span>
            <span className="text-[10px] text-[var(--text-muted)]">{currentGeo.colIndex < 50 ? 'High purchasing power arbitrage' : 'High cost of living metro'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <span className="text-[var(--text-muted)] block text-[11px]">Net Purchasing Power Equivalent</span>
            <span className="text-base font-bold font-mono text-indigo-400 mt-0.5 block">
              ${Math.round(estNetTakeHomeYearOne * (100 / currentGeo.colIndex)).toLocaleString()}
            </span>
            <span className="text-[10px] text-indigo-400">Normalized to Bay Area USD</span>
          </div>
        </div>
      </div>

      {/* 3. Dynamic Negotiation Branching Trees */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
          <GitBranch className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-[var(--text-main)]">Dynamic Negotiation Decision Trees & Counter-Scripts</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveBranch('base_capped')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              activeBranch === 'base_capped' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Branch A: &quot;Base salary is hard-capped&quot;
          </button>
          <button
            onClick={() => setActiveBranch('equity_fixed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              activeBranch === 'equity_fixed' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Branch B: &quot;Equity pool is non-negotiable&quot;
          </button>
          <button
            onClick={() => setActiveBranch('exploding_offer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              activeBranch === 'exploding_offer' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Branch C: &quot;48-Hour exploding offer deadline&quot;
          </button>
        </div>

        {/* Counter Script for Active Branch */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-2">
          <div className="font-semibold text-amber-500">
            {activeBranch === 'base_capped' && 'Strategic Pivot: Counter via Year-1 Sign-on + Accelerated RSUs'}
            {activeBranch === 'equity_fixed' && 'Strategic Pivot: Insert Mandatory 6-Month Review & Promotion Refresher Clause'}
            {activeBranch === 'exploding_offer' && 'Strategic Pivot: Professional 5-Day Extension Request leveraging competing final loops'}
          </div>
          <p className="text-[var(--text-muted)] font-sans leading-relaxed italic">
            {activeBranch === 'base_capped' && 
              `"I completely understand internal salary bands. Given that my target role scope directly leads the ${userProfile.targetRoles?.[0] || 'Staff'} roadmap, can we bridge the gap with a $40,000 sign-on bonus and a performance-based equity grant at the 6-month review?"`}
            {activeBranch === 'equity_fixed' && 
              `"I respect that the initial equity allocation is formulaic for this level. To align our long-term incentives, I would like to include a formal performance review at 6 months with eligibility for an executive equity refresher based on achieving our target Q1 milestones."`}
            {activeBranch === 'exploding_offer' && 
              `"I am very excited about the potential to join ${targetCompany}. Because making a multi-year career commitment is a significant decision for my family, I am requesting until next Friday so I can conclude remaining commitments with full diligence and arrive 100% focused."`}
          </p>
        </div>
      </div>

    </div>
  );
}
