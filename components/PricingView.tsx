
import React from 'react';
import { toast } from 'react-hot-toast';
import { CheckIcon } from './Icons';
import { Button } from './Button';

interface PricingViewProps {
  onBack: () => void;
  userId: string | null;
}

export const PricingView: React.FC<PricingViewProps> = ({ onBack, userId }) => {
  const plans = [
    {
      name: 'Pro Monthly',
      price: '$10',
      period: '/month',
      description: 'Flexible billing for short-term projects.',
      features: ['Unlimited generations', 'High-res downloads', 'Commercial usage rights', 'Access to all styles'],
      highlight: false,
      btnText: 'Subscribe Monthly',
      // Real Dodo Product ID: pdt_3aVAmpWj3afidH9fHcaTE
      paymentLink: 'https://checkout.dodopayments.com/buy/pdt_3aVAmpWj3afidH9fHcaTE' 
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
      // Real Dodo Product ID: pdt_s9jBBy4nhitAcBtt25zqX
      paymentLink: 'https://checkout.dodopayments.com/buy/pdt_s9jBBy4nhitAcBtt25zqX'
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
      // Real Dodo Product ID: pdt_A2VyEzVG0z8LgBSTtu8mA
      paymentLink: 'https://checkout.dodopayments.com/buy/pdt_A2VyEzVG0z8LgBSTtu8mA'
    }
  ];

  const handleSubscribe = (link: string) => {
    // 1. Validation
    if (!userId) {
        toast.error("Please sign in to subscribe.");
        return;
    }

    try {
        // 2. Construct the Dodo Payments URL safely
        const url = new URL(link);
        
        // Ensure quantity is set
        url.searchParams.set('quantity', '1');
        
        // Attach Return URL (Where to send user after payment)
        url.searchParams.set('redirect_url', window.location.origin);
        
        // Attach Metadata (The "Sticky Note" with User ID for the backend)
        url.searchParams.set('metadata_user_id', userId);
        
        // 3. Redirect user
        window.location.href = url.toString();
        
    } catch (e) {
        console.error("Invalid Payment Link:", e);
        toast.error("Could not initiate payment. Please contact support.");
    }
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
