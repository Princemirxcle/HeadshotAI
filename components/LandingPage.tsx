
import React, { useState } from 'react';
import { Button } from './Button';
import { XMarkIcon, ArrowRightIcon, CheckIcon, CameraIcon, SparklesIcon, DownloadIcon } from './Icons';
import { toast } from 'react-hot-toast';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface LandingPageProps {
  onLogin: () => void;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (isOpen: boolean) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, isAuthModalOpen, setAuthModalOpen }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // New state for name
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        toast.error("Please fill in all fields");
        return;
    }
    
    // Validate name for signup
    if (authMode === 'signup' && !fullName) {
        toast.error("Please enter your full name");
        return;
    }
    
    setIsSubmitting(true);
    
    // Check if we are in Demo Mode (No Supabase keys)
    if (!isSupabaseConfigured()) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Fake network delay
        toast.success("Demo Mode: Access Granted");
        onLogin();
        setIsSubmitting(false);
        return;
    }

    try {
        let error;
        if (authMode === 'signup') {
            // Pass metadata (full_name) to Supabase to be saved in the database
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                }
            });
            error = signUpError;

            if (!error) {
                // If Email Confirmation is disabled in Supabase, data.session will be present immediately.
                // The onAuthStateChange listener in App.tsx handles navigation automatically.
                if (data.session) {
                    toast.success("Welcome to ProHeadshot AI!");
                } else {
                    toast.success("Account created! Please check your email to verify.");
                }
            }
        } else {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            error = signInError;
            if (!error && data.session) {
                toast.success("Welcome back!");
                // The onAuthStateChange listener in App.tsx handles navigation automatically.
            }
        }

        if (error) {
             toast.error(error.message);
        }

    } catch (err) {
        console.error(err);
        toast.error("Authentication failed. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col relative bg-[#222222] font-sans text-white">
        
        {/* Auth Modal */}
        {isAuthModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 w-full max-w-md p-8 relative shadow-2xl shadow-black">
                    <button 
                        onClick={() => setAuthModalOpen(false)}
                        className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                    
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-serif font-medium text-white mb-2">
                            {authMode === 'signin' ? 'Welcome back' : 'Create your account'}
                        </h2>
                        <p className="text-zinc-400 text-sm">
                            {authMode === 'signin' 
                                ? 'Enter your details to access your headshots.' 
                                : 'Start creating professional headshots today.'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        {authMode === 'signup' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full Name</label>
                                <input 
                                    type="text" 
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all placeholder:text-zinc-700"
                                    placeholder="Jane Doe"
                                    required={authMode === 'signup'}
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email address</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all placeholder:text-zinc-700"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Password</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all placeholder:text-zinc-700"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <Button 
                            type="submit" 
                            variant="primary" 
                            className="w-full py-3 mt-2 bg-brand-600 hover:bg-brand-500 border-0 text-white"
                            isLoading={isSubmitting}
                        >
                            {authMode === 'signin' ? 'Sign In' : 'Sign Up Free'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-zinc-500">
                        {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                        <button 
                            onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                            className="text-brand-400 hover:text-brand-300 font-medium hover:underline"
                        >
                            {authMode === 'signin' ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    
                    <div className="flex flex-col gap-8 max-w-2xl">
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-medium text-zinc-300 tracking-wide uppercase">AI Model v2.5 Online</span>
                        </div>
                        
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-medium tracking-tight leading-[1.1]">
                            Headshots that <br/>
                            <span className="italic text-brand-300">mean business.</span>
                        </h1>
                        
                        <p className="text-lg text-zinc-400 font-light leading-relaxed max-w-lg">
                            Skip the expensive photographer. Create studio-quality professional headshots in seconds using our advanced AI engine. 
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mt-2">
                            <Button 
                                onClick={() => {
                                    setAuthMode('signup');
                                    setAuthModalOpen(true);
                                }}
                                className="h-12 px-8 text-base bg-white text-black hover:bg-zinc-200 rounded-full"
                            >
                                Get Started Free
                            </Button>
                            <button 
                                onClick={() => {
                                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="h-12 px-8 text-base text-white hover:text-zinc-300 transition-colors flex items-center gap-2 group"
                            >
                                See Examples <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-zinc-500 mt-4">
                            <div className="flex -space-x-2">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#222] bg-zinc-800 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <p>Trusted by 10,000+ professionals</p>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Decorative background blur */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-900/20 blur-[100px] rounded-full pointer-events-none"></div>
                        
                        {/* Masonry Grid of Headshots */}
                        <div className="grid grid-cols-2 gap-4 relative">
                            <div className="space-y-4 pt-12">
                                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl">
                                    <img 
                                        src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=800" 
                                        alt="Nigerian Professional Man in Suit" 
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                                    />
                                </div>
                                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl">
                                    <img 
                                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
                                        alt="Nigerian Professional Woman Banker Headshot" 
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl">
                                    <img 
                                        src="https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=800" 
                                        alt="Nigerian Professional Lady Headshot" 
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                                    />
                                </div>
                                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl">
                                    <img 
                                        src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800" 
                                        alt="Tech Founder Man" 
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-[#1c1c1c] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <span className="text-brand-400 font-medium tracking-wider text-xs uppercase mb-3 block">Simple Process</span>
                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Create in 3 Steps</h2>
                    <p className="text-zinc-400 font-light">
                        Our technology handles the complexity of lighting, depth, and composition. You just provide the face.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Upload Selfie",
                            desc: "Take a casual photo in good lighting. No need for a fancy camera.",
                            icon: <CameraIcon className="w-8 h-8" />,
                            img: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&q=80&w=600"
                        },
                        {
                            title: "Select Style",
                            desc: "Choose from Corporate, Creative, Studio, or Tech environments.",
                            icon: <SparklesIcon className="w-8 h-8" />,
                            img: "https://plus.unsplash.com/premium_photo-1682124752476-40db22034a58?auto=format&fit=crop&q=80&w=600"
                        },
                        {
                            title: "Download HD",
                            desc: "Get high-resolution professional headshots ready for LinkedIn.",
                            icon: <DownloadIcon className="w-8 h-8" />,
                            img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"
                        }
                    ].map((step, idx) => (
                        <div key={idx} className="group relative h-[500px] rounded-2xl overflow-hidden cursor-default">
                             <img 
                                src={step.img} 
                                alt={step.title} 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                            
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <div className="mb-4 text-brand-300 opacity-80">{step.icon}</div>
                                <div className="flex items-baseline gap-3 mb-2">
                                    <span className="text-5xl font-serif text-white/10 font-bold -ml-1">0{idx + 1}</span>
                                    <h3 className="text-2xl font-serif text-white">{step.title}</h3>
                                </div>
                                <p className="text-zinc-300 font-light leading-relaxed border-t border-white/10 pt-4 mt-2">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Why ProHeadshot (The Journal Style) */}
        <section className="py-24 bg-[#181818] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                 <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <span className="text-brand-400 font-medium tracking-wider text-xs uppercase mb-3 block">Why Choose Us</span>
                        <h2 className="text-3xl md:text-5xl font-serif text-white">The Pro Advantage</h2>
                    </div>
                    <p className="text-zinc-400 font-light max-w-sm text-sm md:text-base">
                        We combine artistic direction with algorithmic precision to deliver results that feel authentic.
                    </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-6">
                         <div className="aspect-video w-full overflow-hidden rounded-lg bg-zinc-900 border border-white/5 relative group">
                             <img 
                                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000" 
                                alt="Office" 
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
                             />
                         </div>
                         <div className="text-center px-4">
                             <span className="text-xs font-medium tracking-widest text-zinc-500 uppercase mb-2 block">Feature</span>
                             <h3 className="text-2xl font-serif text-white mb-2">Authentic Environments</h3>
                             <p className="text-zinc-400 font-light text-sm max-w-md mx-auto">
                                 Backgrounds that look real, with perfect depth-of-field blur and correct lighting interaction.
                             </p>
                         </div>
                     </div>

                     <div className="space-y-6">
                         <div className="aspect-video w-full overflow-hidden rounded-lg bg-zinc-900 border border-white/5 relative group">
                             <img 
                                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000" 
                                alt="Security" 
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
                             />
                         </div>
                         <div className="text-center px-4">
                             <span className="text-xs font-medium tracking-widest text-zinc-500 uppercase mb-2 block">Privacy</span>
                             <h3 className="text-2xl font-serif text-white mb-2">Your Data is Secure</h3>
                             <p className="text-zinc-400 font-light text-sm max-w-md mx-auto">
                                 Images are processed in memory and deleted shortly after generation. We never train on your face.
                             </p>
                         </div>
                     </div>
                 </div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 bg-[#222222] border-t border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-900/20 pointer-events-none"></div>
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
                    Ready to upgrade your professional image?
                </h2>
                <p className="text-lg text-zinc-400 font-light mb-10 max-w-2xl mx-auto">
                    Join thousands of professionals who have secured their dream jobs and clients with a ProHeadshot. 
                    It takes less than 2 minutes.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button 
                        onClick={() => {
                            setAuthMode('signup');
                            setAuthModalOpen(true);
                        }}
                        className="h-14 px-10 text-lg bg-white text-black hover:bg-zinc-200 rounded-full shadow-xl shadow-brand-900/30"
                    >
                        Get Started for Free
                    </Button>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-6 text-sm text-zinc-600">
                    <span className="flex items-center gap-1"><CheckIcon className="w-4 h-4" /> No credit card required</span>
                    <span className="flex items-center gap-1"><CheckIcon className="w-4 h-4" /> 100% Satisfaction</span>
                </div>
            </div>
        </section>

    </div>
  );
};
