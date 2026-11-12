'use client';
import { useMemo, useState } from 'react';
import { calculateEMI, formatPrice } from '@/lib/utils';

export default function EMICalculator({ defaultPrincipal = 5000000 }: { defaultPrincipal?: number }) {
  const [principal, setPrincipal] = useState(defaultPrincipal);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const emi = useMemo(() => calculateEMI(principal, rate, tenure), [principal, rate, tenure]);
  const totalPayment = emi * tenure * 12;
  const totalInterest = totalPayment - principal;

  return (
    <div className="card-luxury p-8">
      <h3 className="font-display text-2xl font-bold mb-6">EMI Calculator</h3>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-charcoal-600">Loan Amount</span>
            <span className="font-semibold">{formatPrice(principal)}</span>
          </div>
          <input type="range" min={500000} max={50000000} step={100000} value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full accent-gold-500" />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-charcoal-600">Interest Rate (p.a.)</span>
            <span className="font-semibold">{rate}%</span>
          </div>
          <input type="range" min={6} max={15} step={0.1} value={rate}
            onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-gold-500" />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-charcoal-600">Tenure</span>
            <span className="font-semibold">{tenure} Years</span>
          </div>
          <input type="range" min={1} max={30} step={1} value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))} className="w-full accent-gold-500" />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-charcoal-100">
        <div>
          <p className="text-xs text-charcoal-500 uppercase tracking-wide">Monthly EMI</p>
          <p className="text-xl font-bold text-gold-700">₹{Math.round(emi).toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-xs text-charcoal-500 uppercase tracking-wide">Total Interest</p>
          <p className="text-xl font-bold text-charcoal-900">{formatPrice(totalInterest)}</p>
        </div>
        <div>
          <p className="text-xs text-charcoal-500 uppercase tracking-wide">Total Payment</p>
          <p className="text-xl font-bold text-charcoal-900">{formatPrice(totalPayment)}</p>
        </div>
      </div>
    </div>
  );
}
