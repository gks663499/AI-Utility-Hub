
import React from 'react';
import { UserCredits } from '../types';

interface Props {
  setCredits: React.Dispatch<React.SetStateAction<UserCredits>>;
}

const Pricing: React.FC<Props> = ({ setCredits }) => {
  const plans = [
    { name: 'Starter', price: 'Free', credits: 10, features: ['Basic AI Access', 'Image Tools (1/day)', 'SEO Audit (Basic)'], color: 'border-gray-200' },
    { name: 'Pro', price: '$29', credits: 100, features: ['Priority Processing', 'High-Res Animations', 'Full SEO Reports', 'Transcription (60m)'], color: 'border-indigo-500', popular: true },
    { name: 'Business', price: '$99', credits: 500, features: ['Team Collaboration', 'Bulk Processing', 'White-label Reports', 'API Access'], color: 'border-purple-500' },
  ];

  const handleUpgrade = (amount: number) => {
    setCredits({ available: amount, total: amount });
    localStorage.setItem('hub_credits', JSON.stringify({ available: amount, total: amount }));
    alert(`Successfully upgraded to ${amount} credits!`);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black">Choose Your Plan</h2>
        <p className="text-gray-500 text-lg">Scale your productivity with flexible AI credits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.name} className={`relative bg-white dark:bg-gray-800 p-8 rounded-3xl border-2 shadow-sm flex flex-col ${plan.color}`}>
            {plan.popular && (
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Most Popular</div>
            )}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-5xl font-black">{plan.price}</span>
              {plan.price !== 'Free' && <span className="text-gray-400 ml-2 font-bold">/mo</span>}
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 mb-8 text-center">
              <span className="block text-3xl font-black text-indigo-600 dark:text-indigo-400">{plan.credits}</span>
              <span className="text-xs uppercase font-bold text-gray-400">Monthly Credits</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(plan.credits)}
              className={`w-full py-4 rounded-2xl font-black transition-all ${plan.popular ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200'}`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-800 text-center">
        <h4 className="font-bold mb-2">Need a custom enterprise solution?</h4>
        <p className="text-gray-500 text-sm mb-4">We offer bulk discounts for agencies and large teams.</p>
        <button className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Contact Sales Support &rarr;</button>
      </div>
    </div>
  );
};

export default Pricing;
