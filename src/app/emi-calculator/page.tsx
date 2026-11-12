import { Metadata } from 'next';
import EMICalculator from '@/components/EMICalculator';

export const metadata: Metadata = {
  title: 'EMI Calculator',
  description: 'Calculate your home loan EMI for properties in Jaipur with BT_Jaipur_Homes.',
  alternates: { canonical: '/emi-calculator' },
};

export default function EMIPage() {
  return (
    <div className="container-luxury py-16 max-w-2xl">
      <div className="text-center mb-10">
        <p className="section-label">Plan Your Finances</p>
        <h1 className="font-display text-4xl font-bold mt-2">Home Loan EMI Calculator</h1>
        <p className="text-charcoal-500 mt-2">Estimate your monthly installment before you buy.</p>
      </div>
      <EMICalculator />
    </div>
  );
}
