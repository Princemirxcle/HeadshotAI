import React from 'react';
import { CheckIcon } from './Icons';
import { Button } from './Button';

interface PricingViewProps {
  onBack: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onBack }) => {
  const plans = [
    {
      name: 'Pro Monthly',
      price: '$10',
      period: '/month',
      description: 'Flexible billing for short-term projects.',
      features: ['Unlimited generations', 'High-res downloads', 'Commercial usage rights', 'Access to all styles'],
      highlight: false,
      btnText: 'Subscribe Monthly',
      // REPLACE with your actual Dodo Payments Monthly Product Link
      paymentLink: 'https://checkout.dodopayments.com/buy/YOUR_MONTHLY_PRODUCT_ID' 
    },
    {
      name: 'Pro Annual',
      price: '$99',
      period: '/year',
      description: 'Save 17% with yearly billing.',
      features: ['Everything in Monthly', 'Priority generation speed', 'Early access to new models', 'Premium support'],
      highlight: false,
      badge: 'Best Value',
      btnText: 'Subscribe Annually',
      // REPLACE with your actual Dodo Payments Annual Product Link
      paymentLink: 'https://checkout.dodopayments.com/buy/YOUR_ANNUAL_PRODUCT_ID'
    },
    {
      name: 'Lifetime',
      price: '$150',
      period: 'one-time',
      description: 'Pay once, own Pro forever.',
      features: ['Everything in Annual', 'Lifetime updates', 'No recurring fees', 'Founder community access'],
      highlight: true,
      badge: 'Limited Time',
      btnText: 'Get Lifetime Access',
      // REPLACE with your actual Dodo Payments Lifetime Product Link
      paymentLink: 'https://checkout.dodopayments.com/buy/YOUR_LIFETIME_PRODUCT_ID'
    }
  ];

  const handleSubscribe = (link: string) => {
    // Open the payment link in a new tab
    if (link.includes('YOUR_')) {
        alert("Please configure your Dodo Payment links in components/PricingView.tsx");
        return;
    }
    window.open(link, '_blank');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <button onClick={onBack} className="mb-8 text-zinc-400 hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors text-sm font-medium bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
            ← Back to Editor
        </button>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Simple, transparent pricing</h2>
        <p className="mt-4 text-lg text-zinc-400">
          Upgrade to ProHeadshot AI for professional results. Choose the plan that fits your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 ${
                plan.highlight 
                ? 'bg-gradient-to-b from-zinc-800 to-zinc-900 border-2 border-blue-500/50 shadow-2xl shadow-blue-900/20 transform md:-translate-y-2' 
                : 'bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'
            }`}
          >
            {plan.badge && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-lg ${
                    plan.highlight ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white' : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                }`}>
                    {plan.badge}
                </div>
            )}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <p className="mt-2 text-zinc-400 text-sm h-10">{plan.description}</p>
            </div>
            <div className="mb-8 flex items-baseline">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-zinc-500 ml-2 font-medium">{plan.period}</span>
            </div>
            
            <div className="border-t border-zinc-800 my-6"></div>

            <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                        <CheckIcon className={`w-5 h-5 mr-3 shrink-0 ${plan.highlight ? 'text-blue-400' : 'text-zinc-500'}`} />
                        <span className="text-zinc-300 text-sm">{feature}</span>
                    </li>
                ))}
            </ul>

            <Button 
                variant={plan.highlight ? 'primary' : 'outline'} 
                className={`w-full ${plan.highlight ? 'shadow-lg shadow-blue-500/20' : ''}`}
                onClick={() => handleSubscribe(plan.paymentLink)} 
            >
                {plan.btnText}
            </Button>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center text-xs text-zinc-600">
         Secure payment processing via Dodo Payments. <br/> 
         Questions? Contact support@proheadshot.ai
      </div>
    </div>
  );
};