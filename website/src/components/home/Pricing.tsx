import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
    {
        name: "Professional",
        price: "0",
        description: "Empowering individual job seekers with advanced AI capabilities.",
        features: [
            "Gemini 1.5 Pro Analysis",
            "One-click Job Board Extraction",
            "SWOT & Keyword Gap Reports",
            "Local Resume Parsing",
            "Privacy-First Intelligence"
        ],
        popular: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Custom solutions for teams and recruitment agencies.",
        features: [
            "Bulk Analysis Pipeline",
            "Team Workspace Sync",
            "Priority Support",
            "Custom Model Fine-tuning",
            "Advanced Analytics"
        ],
        popular: false
    }
];

const Pricing = () => {
    return (
        <section id="pricing" className="py-32 bg-black relative overflow-hidden border-t border-white/5">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05),transparent_50%)] blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-20 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 mb-8 w-fit">
                        <span className="text-[11px] font-semibold text-sky-400">Pricing</span>
                    </div>
                    <h2 className="text-4xl md:text-[64px] font-bold leading-[1.05] tracking-tight mb-8 text-white">Built for scale.</h2>
                    <p className="text-zinc-500 text-lg">
                        Transparent access to state-of-the-art career intelligence. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={`p-10 rounded-3xl border ${plan.popular ? 'border-sky-500/20 bg-sky-500/[0.02]' : 'border-white/5 bg-[#09090b]'
                                } flex flex-col justify-between relative overflow-hidden`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[80px] rounded-full pointer-events-none -mr-32 -mt-32" />
                            )}
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                                    {plan.popular && (
                                        <span className="px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
                                            Recommended
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                                    {plan.price !== "Custom" && <span className="text-zinc-500 font-medium">/ forever</span>}
                                </div>
                                <p className="text-zinc-400 mb-8 text-sm leading-relaxed min-h-[40px]">{plan.description}</p>
                                <div className="space-y-4 mb-10 text-sm">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-zinc-300">
                                            <Check className="w-4 h-4 text-sky-400 shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                className={`w-full py-4 rounded-xl font-semibold transition-all relative z-10 text-sm active:scale-[0.98] ${plan.popular ? 'bg-white text-black hover:bg-zinc-200' : 'bg-transparent border border-white/10 text-white hover:bg-white/5'
                                    }`}
                            >
                                {plan.price === "0" ? "Install Extension" : "Contact Sales"}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
