'use client';
import React, { useState, useEffect } from 'react';
import { Check, Zap, Shield, Mail, X, Clock, CreditCard } from 'lucide-react';
import { useAuth } from '../../app/context/AuthContext';

const PaymentPage = () => {
    const { token, userId, isAuthenticated, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showEmailPopup, setShowEmailPopup] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [selectedPlanType, setSelectedPlanType] = useState<'lifetime' | 'credits'>('lifetime');
    const [selectedCreditPackage, setSelectedCreditPackage] = useState(0);

    // Limited time offer
    const limitedTimeOffer = {
        discountPercent: 60,
        daysRemaining: 2
    };

    // Lifetime plan details
    const lifetimePlan = {
        price: 39.00,
        originalPrice: 99,
        features: [
            'Unlimited documentation generation',
            'AI-powered README',
            'Priority support',
            'Early access to new features',
            'No monthly fees, ever'
        ]
    };

    // Credit packages with Gumroad links
    const creditPackages = [
        {
            credits: 10,
            price: 12.50,
            perCredit: 1.25,
            recommended: false,
            features: [
                '10 documentation generations',
                'Basic support',
                '1 month access'
            ],
            gumroadLink: 'https://gitforge.gumroad.com/l/bwqvf'
        },
        {
            credits: 25,
            price: 24.75,
            perCredit: 0.99,
            recommended: false,
            features: [
                '25 documentation generations',
                'Priority support',
                '3 months access'
            ],
            gumroadLink: 'https://gitforge.gumroad.com/l/tgajw'
        },
        {
            credits: 50,
            price: 44.50,
            perCredit: 0.89,
            recommended: true,
            features: [
                '50 documentation generations',
                'Priority support',
                '6 months access',
                'Early access to beta features'
            ],
            gumroadLink: 'https://gitforge.gumroad.com/l/ilbmi'
        }
    ];

    // Redirect if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            window.location.href = '/login';
        }
    }, [isAuthenticated, isLoading]);

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({
            x: (e.clientX / window.innerWidth) * 2 - 1,
            y: (e.clientY / window.innerHeight) * 2 - 1,
        });
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);

        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

            const response = await fetch(`${backendUrl}/api/user/update-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: userId,
                    email: email
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update email');
            }

            setSuccess('Email verified successfully!');
            setIsEmailVerified(true);

            setTimeout(() => {
                setShowEmailPopup(false);
                proceedWithPayment();
            }, 1500);

        } catch (err) {
            setError('Failed to update email. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePurchase = (planType: 'lifetime' | 'credits' = 'lifetime', creditIndex: number = 0) => {
        setSelectedPlanType(planType);
        setSelectedCreditPackage(creditIndex);

        if (!isEmailVerified) {
            setShowEmailPopup(true);
            setError('');
            setSuccess('');
        } else {
            proceedWithPayment();
        }
    };

    const proceedWithPayment = () => {
        let gumroadUrl = '';

        if (selectedPlanType === 'lifetime') {
            gumroadUrl = `https://gitforge.gumroad.com/l/ypgvsr?email=${encodeURIComponent(email)}&limited_offer=true`;
        } else {
            const creditPackage = creditPackages[selectedCreditPackage];
            gumroadUrl = `${creditPackage.gumroadLink}?email=${encodeURIComponent(email)}`;
        }

        setSuccess('Redirecting to secure payment...');
        setTimeout(() => {
            window.location.href = gumroadUrl;
        }, 1500);
    };

    const closeEmailPopup = () => {
        setShowEmailPopup(false);
        setError('');
        setSuccess('');
        setEmail('');
    };

    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-slate-900 overflow-x-hidden relative"
            onMouseMove={handleMouseMove}
        >
            {/* Animated Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div
                    className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-1000 ease-out"
                    style={{
                        background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
                        transform: `translate(${mousePos.x * 100}px, ${mousePos.y * 100}px) scale(${1 + mousePos.x * 0.1})`,
                        left: '10%',
                        top: '10%',
                    }}
                />
                <div
                    className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl transition-all duration-1000 ease-out"
                    style={{
                        background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
                        transform: `translate(${mousePos.x * -150}px, ${mousePos.y * -100}px)`,
                        right: '10%',
                        top: '50%',
                    }}
                />
                <div
                    className="absolute w-72 h-72 rounded-full opacity-10 blur-3xl transition-all duration-1000 ease-out"
                    style={{
                        background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
                        transform: `translate(${mousePos.x * 80}px, ${mousePos.y * 120}px)`,
                        left: '50%',
                        bottom: '20%',
                    }}
                />
            </div>

            {/* Header */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                <div className="text-center">
                    <div className="inline-flex items-center bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs sm:text-sm font-semibold py-2 px-3 sm:px-4 rounded-full mb-4 animate-pulse shadow-lg">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        {limitedTimeOffer.discountPercent}% OFF ends in {limitedTimeOffer.daysRemaining} days
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent mb-3 px-4">
                        Generate docs in seconds, not hours
                    </h1>
                    <p className="text-base sm:text-lg text-gray-400 px-4 max-w-2xl mx-auto">
                        Join thousands of developers who&apos;ve automated their documentation
                    </p>
                </div>
            </div>

            <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 py-12">
                {/* Plan Type Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-1.5 flex border border-slate-700/50 shadow-inner">
                        <button
                            onClick={() => setSelectedPlanType('lifetime')}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${selectedPlanType === 'lifetime'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            Lifetime Access
                        </button>
                        <button
                            onClick={() => setSelectedPlanType('credits')}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${selectedPlanType === 'credits'
                                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg'
                                : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            Pay As You Go
                        </button>
                    </div>
                </div>

                {/* Plans Content */}
                {selectedPlanType === 'lifetime' ? (
                    // Lifetime Access Plan
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-indigo-500/50 p-8 relative overflow-hidden">
                            {/* Badge */}
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold py-1 px-3 rounded-full z-10">
                                MOST POPULAR
                            </div>

                            <div className="text-center mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent mb-4">
                                    Lifetime Access
                                </h2>
                                <div className="flex flex-col sm:flex-row items-center justify-center mb-4 gap-4">
                                    <span className="text-4xl md:text-5xl font-bold text-white">${lifetimePlan.price}</span>
                                    <div className="text-center sm:text-left">
                                        <div className="text-xl md:text-2xl text-gray-400 line-through font-medium">${lifetimePlan.originalPrice.toFixed(2)}</div>
                                        <div className="text-sm md:text-base text-green-400 font-semibold bg-green-900/20 px-2 py-1 rounded-md inline-block">
                                            Save {limitedTimeOffer.discountPercent}%
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-300 text-lg">One payment. Unlimited docs. Forever.</p>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 gap-4 mb-8">
                                {lifetimePlan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start group">
                                        <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover:bg-green-500/30 transition-colors flex-shrink-0">
                                            <Check className="w-4 h-4 text-green-400" />
                                        </div>
                                        <span className="text-gray-300 font-medium text-base leading-relaxed">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <button
                                onClick={() => handlePurchase('lifetime')}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Get Lifetime Access Now
                            </button>

                            <p className="text-center text-gray-400 text-sm mt-4 px-2">
                                30-day money-back guarantee • Secure payment via Gumroad
                            </p>
                        </div>
                    </div>
                ) : (
                    // Pay As You Go Plans
                    <div>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent inline-flex items-center">
                                <CreditCard className="w-6 h-6 mr-2" />
                                Pay As You Go
                            </h2>
                            <p className="text-gray-400 mt-2 text-lg max-w-2xl mx-auto">
                                For occasional users (1 credit = 1 documentation generation)
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {creditPackages.map((pkg, index) => (
                                <div
                                    key={index}
                                    className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border ${pkg.recommended
                                        ? 'border-cyan-500/50 shadow-lg transform hover:scale-[1.03]'
                                        : 'border-slate-700/50 hover:border-cyan-500/30'
                                        } relative transition-all duration-300`}
                                >
                                    {pkg.recommended && (
                                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cyan-600 text-white text-xs font-bold py-1 px-3 rounded-full">
                                            BEST VALUE
                                        </div>
                                    )}

                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-white mb-2">
                                            {pkg.credits} Credits
                                        </h3>
                                        <div className="flex flex-col items-center justify-center mb-4">
                                            <span className="text-3xl font-bold text-cyan-300">
                                                ${pkg.price}
                                            </span>
                                            <span className="text-gray-400 text-sm">
                                                (${pkg.perCredit.toFixed(2)}/credit)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-6 pt-4 border-t border-slate-700/50">
                                        <ul className="space-y-3">
                                            {pkg.features.map((feature, i) => (
                                                <li key={i} className="flex items-start">
                                                    <Check className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                                    <span className="text-gray-300 text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <button
                                        onClick={() => handlePurchase('credits', index)}
                                        className={`w-full py-3 rounded-xl font-medium transition-all ${pkg.recommended
                                            ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-md'
                                            : 'bg-slate-700 hover:bg-slate-600 text-gray-200'
                                            }`}
                                    >
                                        Get {pkg.credits} Credits
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Credit Disclaimer */}
                        <div className="mt-8 text-center text-gray-500 text-sm max-w-2xl mx-auto">
                            <p className="mb-2">Credits expire after 1 year of inactivity</p>
                            <p>Lifetime access saves you ${(creditPackages[0].price * 6).toFixed(2)} compared to buying 10 credits monthly</p>
                        </div>
                    </div>
                )}

                {/* Trust Indicators */}
                <div className="max-w-4xl mx-auto mt-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-colors">
                                <Shield className="w-8 h-8 text-green-400" />
                            </div>
                            <h4 className="font-bold text-white mb-2 text-base">Secure Payment</h4>
                            <p className="text-gray-400 text-sm">SSL encrypted checkout via Gumroad</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-500/30 transition-colors">
                                <Zap className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h4 className="font-bold text-white mb-2 text-base">Instant Access</h4>
                            <p className="text-gray-400 text-sm">Start generating docs immediately</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                                <CreditCard className="w-8 h-8 text-purple-400" />
                            </div>
                            <h4 className="font-bold text-white mb-2 text-base">Money Back Guarantee</h4>
                            <p className="text-gray-400 text-sm">30 days, no questions asked</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Email Verification Popup */}
            {showEmailPopup && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-3xl p-8 max-w-md w-full relative shadow-2xl border border-slate-700/50 animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={closeEmailPopup}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-200 transition-colors p-1"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Mail className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent mb-3">
                                Almost there!
                            </h2>
                            <p className="text-gray-300 leading-relaxed">Enter your email to get your access</p>
                        </div>

                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-4 rounded-xl border-2 border-slate-600 bg-slate-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-lg"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !email}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                                        Verifying...
                                    </div>
                                ) : (
                                    'Continue to Payment'
                                )}
                            </button>

                            {error && (
                                <div className="bg-red-500/20 border-2 border-red-500/50 rounded-xl p-4">
                                    <p className="text-red-300 text-sm text-center font-medium">{error}</p>
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-500/20 border-2 border-green-500/50 rounded-xl p-4">
                                    <div className="flex items-center justify-center">
                                        <Check className="w-5 h-5 text-green-400 mr-2" />
                                        <p className="text-green-400 text-sm font-medium">{success}</p>
                                    </div>
                                </div>
                            )}
                        </form>

                        <p className="text-center text-gray-500 text-xs mt-6">
                            We&apos;ll never spam you or share your email
                        </p>
                    </div>
                </div>
            )}

            {/* Processing Screen */}
            {success.includes('Redirecting') && (
                <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-6"></div>
                        <h3 className="text-2xl font-bold text-white mb-3">Redirecting to secure checkout</h3>
                        <p className="text-gray-300 mb-4">You&apos;ll complete your purchase on Gumroad</p>
                        <p className="text-gray-400 text-sm">Email: {email}</p>
                    </div>
                </div>
            )}

            {/* Success Screen */}
            {success.includes('Payment successful') && (
                <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="text-center p-8">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10 text-green-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-green-400 mb-4">Welcome aboard! 🎉</h3>
                        <p className="text-gray-300 text-lg mb-8">
                            {selectedPlanType === 'lifetime'
                                ? 'Your lifetime access is now active'
                                : `Your ${creditPackages[selectedCreditPackage].credits} credits have been added to your account`}
                        </p>
                        <button
                            onClick={() => window.location.href = '/repos'}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg"
                        >
                            Start Generating Docs
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;