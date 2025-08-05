'use client';

import React, { useState, useEffect } from 'react';
import { Check, Zap, Shield, Mail, Star, X, Github, Users, Clock } from 'lucide-react';
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

    const handleEmailSubmit = async () => {

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

    const handlePurchase = () => {
        if (!isEmailVerified) {
            setShowEmailPopup(true);
            setError('');
            setSuccess('');
        } else {
            proceedWithPayment();
        }
    };

    const proceedWithPayment = () => {
        const gumroadUrl = `https://gitforge.gumroad.com/l/ypgvsr?email=${encodeURIComponent(email)}&limited_offer=true`;
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
                {/* Main Offer */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl border border-slate-700/50 p-6 md:p-12 relative overflow-hidden">
                        {/* Gradient background accent */}
                        <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full -translate-y-8 translate-x-8"></div>



                        <div className="text-center mb-6 md:mb-8 pt-6 md:pt-4">
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent mb-3 md:mb-4">
                                Lifetime Access
                            </h2>
                            <div className="flex flex-col sm:flex-row items-center justify-center mb-4 gap-2 sm:gap-4">
                                <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">${lifetimePlan.price}</span>
                                <div className="text-center sm:text-left">
                                    <div className="text-xl md:text-2xl text-gray-400 line-through font-medium">${lifetimePlan.originalPrice.toFixed(2)}</div>
                                    <div className="text-sm md:text-base text-green-400 font-semibold bg-green-900/20 px-2 py-1 rounded-md inline-block">
                                        Save {limitedTimeOffer.discountPercent}%
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-300 text-base md:text-lg">One payment. Unlimited docs. Forever.</p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 gap-3 md:gap-4 mb-6 md:mb-8">
                            {lifetimePlan.features.map((feature, i) => (
                                <div key={i} className="flex items-start group">
                                    <div className="w-5 h-5 md:w-6 md:h-6 bg-green-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover:bg-green-500/30 transition-colors flex-shrink-0">
                                        <Check className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                                    </div>
                                    <span className="text-gray-300 font-medium text-sm md:text-base leading-relaxed">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <button
                            onClick={handlePurchase}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl transition-all duration-200 text-base md:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Get Lifetime Access Now
                        </button>

                        <p className="text-center text-gray-400 text-xs md:text-sm mt-3 md:mt-4 px-2">
                            30-day money-back guarantee • Secure payment via Gumroad
                        </p>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <div className="text-center group">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500/20 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:bg-green-500/30 transition-colors">
                                <Shield className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
                            </div>
                            <h4 className="font-bold text-white mb-2 text-sm md:text-base">Secure Payment</h4>
                            <p className="text-gray-400 text-xs md:text-sm">SSL encrypted checkout via Gumroad</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-500/20 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:bg-indigo-500/30 transition-colors">
                                <Zap className="w-6 h-6 md:w-8 md:h-8 text-indigo-400" />
                            </div>
                            <h4 className="font-bold text-white mb-2 text-sm md:text-base">Instant Access</h4>
                            <p className="text-gray-400 text-xs md:text-sm">Start generating docs immediately</p>
                        </div>

                        <div className="text-center group">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-500/20 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:bg-purple-500/30 transition-colors">
                                <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                            </div>
                            <h4 className="font-bold text-white mb-2 text-sm md:text-base">Money Back Guarantee</h4>
                            <p className="text-gray-400 text-xs md:text-sm">30 days, no questions asked</p>
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
                            Your lifetime access is now active
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