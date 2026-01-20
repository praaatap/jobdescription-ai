import { motion } from 'framer-motion';
import Button from '../ui/Button';
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
        <section id="pricing" className="py-40 bg-black">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-24">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Built for scale.</h2>
                    <p className="text-zinc-500 text-lg">
                        Transparent access to state-of-the-art career intelligence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={`p-10 rounded-3xl border ${plan.popular ? 'border-primary/20 bg-primary/[0.02]' : 'border-white/5 bg-transparent'
                                } flex flex-col justify-between`}
                        >
                            <div>
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                    {plan.popular && (
                                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                            Recommended
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                                    {plan.price !== "Custom" && <span className="text-zinc-600">/ forever</span>}
                                </div>
                                <p className="text-zinc-500 mb-10 text-lg leading-relaxed">{plan.description}</p>
                                <div className="space-y-4 mb-12">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-zinc-400">
                                            <Check className="w-4 h-4 text-primary shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Button
                                variant={plan.popular ? 'primary' : 'secondary'}
                                className={`w-full py-6 rounded-xl font-bold transition-all ${plan.popular ? 'bg-white text-black hover:bg-zinc-200' : 'bg-transparent border border-white/10 text-white hover:bg-zinc-900'
                                    }`}
                            >
                                {plan.price === "0" ? "Install Extension" : "Contact Sales"}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
