
import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { EditorView } from './components/EditorView';
import { PricingView } from './components/PricingView';
import { LandingPage } from './components/LandingPage';
import { Button } from './components/Button';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';

type ViewState = 'landing' | 'editor' | 'pricing';

const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userProfile, setUserProfile] = useState<{ full_name: string | null } | null>(null);

  // Initialize Auth Session
  useEffect(() => {
    // 0. Check for Payment Redirects (Success or Failure)
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');

    if (status === 'succeeded' && params.get('payment_id')) {
        toast.success("Payment successful! Your plan has been upgraded.", {
            duration: 6000,
            icon: '🎉',
            style: {
                background: '#10B981', // Green background
                color: '#fff',
            }
        });
        // Clear query params to clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (status === 'failed') {
        toast.error("Payment failed or was cancelled. Please try again.", {
            duration: 5000,
            style: {
                background: '#991b1b', // Red background
                color: '#fff',
            }
        });
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (!isSupabaseConfigured()) return;

    // 1. Check for existing session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        fetchProfile(session.user.id);
        if (currentView === 'landing') setCurrentView('editor');
      }
    });

    // 2. Listen for auth changes (login/logout/signup)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        setUserId(session.user.id);
        setShowAuthModal(false);
        fetchProfile(session.user.id);
        if (currentView === 'landing') setCurrentView('editor');
      } else {
        setUserId(null);
        setUserProfile(null);
        setCurrentView('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (uid: string) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', uid)
            .single();
        if (!error && data) setUserProfile(data);
    } catch (e) {
        // Profile table may not exist yet - non-critical
    }
  };

  // Callback for Demo Mode (when Supabase is not configured)
  const handleLogin = () => {
    setIsAuthenticated(true);
    setUserId('demo-user-123'); // Fake ID for demo
    setShowAuthModal(false);
    setCurrentView('editor');
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setUserId(null);
    setUserProfile(null);
    setCurrentView('landing');
  };

  // Dynamic page titles for SEO and browser tab clarity
  useEffect(() => {
    const titles: Record<ViewState, string> = {
      landing: 'AI Headshot Maker - Professional Headshots from Selfies | ProHeadshot AI',
      editor: 'AI Headshot Editor - Create Professional Headshots | ProHeadshot AI',
      pricing: 'Pricing - AI Headshot Maker Plans | ProHeadshot AI',
    };
    document.title = titles[currentView];
  }, [currentView]);

  const navigateTo = (view: ViewState) => {
    // Redirect to landing if trying to access editor while not authenticated
    if (view === 'editor' && !isAuthenticated) {
        setCurrentView('landing');
        setShowAuthModal(true);
        return;
    }
    setCurrentView(view);
  };

  const handleAuthTrigger = () => {
    if (currentView !== 'landing') {
        setCurrentView('landing');
    }
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-brand-900 text-zinc-100 selection:bg-brand-500/30 flex flex-col font-sans">
      <Toaster 
        position="top-center"
        toastOptions={{
            style: {
                background: '#1e1b4b',
                color: '#fff',
                border: '1px solid #312e81',
                fontSize: '14px'
            }
        }}
      />

      {/* Header */}
      <header className="w-full z-50 border-b border-white/5 bg-brand-900/80 backdrop-blur-md sticky top-0" role="banner">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" aria-label="Main navigation">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); navigateTo(isAuthenticated ? 'editor' : 'landing'); }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none group"
            aria-label="ProHeadshot AI - AI Headshot Maker Home"
          >
             <span className="text-lg font-bold tracking-tight text-white group-hover:text-glow transition-all">ProHeadshot<span className="text-white font-normal">AI</span></span>
          </a>

          <div className="flex items-center gap-6 text-sm font-medium text-zinc-400">
            <button
                onClick={() => navigateTo('pricing')}
                className={`transition-colors hidden sm:block ${currentView === 'pricing' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
                aria-current={currentView === 'pricing' ? 'page' : undefined}
            >
                Pricing
            </button>
            
            {isAuthenticated ? (
                 <div className="flex items-center gap-4">
                     <button
                        onClick={() => navigateTo('editor')}
                        className={`${currentView === 'editor' ? 'text-white' : 'text-zinc-400 hover:text-white'} transition-colors hidden sm:block`}
                        aria-current={currentView === 'editor' ? 'page' : undefined}
                     >
                        Editor
                     </button>

                     <div className="flex items-center gap-3 pl-3 border-l border-zinc-700">
                         {userProfile?.full_name && (
                             <span className="text-xs text-zinc-300 hidden md:block">
                                 Hi, {userProfile.full_name.split(' ')[0]}
                             </span>
                         )}
                         <Button variant="outline" onClick={handleLogout} className="h-8 px-3 text-xs" aria-label="Sign out of your account">
                            Sign Out
                         </Button>
                     </div>
                 </div>
            ) : (
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleAuthTrigger}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        Sign in
                    </button>
                    <Button
                        variant="primary"
                        onClick={handleAuthTrigger}
                        className="h-9 px-4 text-xs bg-white text-black hover:bg-zinc-200"
                    >
                        Get Started
                    </Button>
                </div>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1 w-full flex flex-col">
        {currentView === 'landing' && (
            <LandingPage 
                onLogin={handleLogin} 
                isAuthModalOpen={showAuthModal}
                setAuthModalOpen={setShowAuthModal}
            />
        )}
        
        {currentView === 'editor' && (
             <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
                <EditorView />
             </div>
        )}

        {currentView === 'pricing' && (
            <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
                <PricingView 
                  userId={userId} 
                  onBack={() => navigateTo(isAuthenticated ? 'editor' : 'landing')} 
                />
            </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-8 bg-brand-900" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-zinc-500">
                <a href="/" onClick={(e) => { e.preventDefault(); navigateTo('landing'); }} className="hover:text-white transition-colors">AI Headshot Maker</a>
                <a href="#pricing" onClick={(e) => { e.preventDefault(); navigateTo('pricing'); }} className="hover:text-white transition-colors">Pricing</a>
                <a href="#faq" onClick={(e) => { e.preventDefault(); navigateTo('landing'); }} className="hover:text-white transition-colors">FAQ</a>
                <a href="mailto:support@proheadshot.ai" className="hover:text-white transition-colors">Contact</a>
            </div>
            <a href="https://www.producthunt.com/products/proheadshot-ai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-proheadshot-ai" target="_blank" rel="noopener noreferrer" aria-label="ProHeadshot AI on Product Hunt">
                <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1079365&theme=dark&t=1771077041545" alt="ProHeadshot AI featured on Product Hunt - AI headshot maker" width="250" height="54" loading="lazy" />
            </a>
            <p className="text-zinc-600 text-sm">&copy; {new Date().getFullYear()} ProHeadshot AI. The best AI headshot maker for professionals.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
