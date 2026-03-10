import { motion } from 'framer-motion';
import { Brain, Activity, Shield, Zap, ArrowRight } from 'lucide-react';

const features = [
    {
        icon: <Brain className="w-6 h-6" />,
        title: "Intelligent Matching",
        description: "Moving beyond simple keywords. Our engine analyzes the core intent of job descriptions to match your exact achievements.",
        accent: "from-sky-500/10 to-transparent"
    },
    {
        icon: <Zap className="w-6 h-6" />,
        title: "Instant Extraction",
        description: "Extract job details from any recruiting portal in milliseconds right from your browser, securely and efficiently.",
        accent: "from-white/5 to-transparent"
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: "Privacy First",
        description: "All resume parsing and matching logic runs entirely locally in your browser. Your data never leaves your device.",
        accent: "from-white/5 to-transparent"
    }
];

const Features = () => {
    return (
        <section id="features" className="py-32 bg-black relative">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] right-[-5%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05),transparent_50%)] blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_50%)] blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-end mb-24">
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 mb-8 w-fit"
                        >
                            <span className="text-[11px] font-semibold text-sky-400">
                                Core Features
                            </span>
                        </motion.div>
                        <h2 className="text-4xl md:text-[64px] font-bold text-white leading-[1.05] tracking-tight mb-4">
                            Built for the next <br />
                            <span className="text-zinc-500">generation of talent.</span>
                        </h2>
                    </div>
                    <div className="lg:col-span-4 lg:text-right">
                        <p className="text-zinc-400 text-lg leading-relaxed max-w-sm ml-auto">
                            A seamless bridge between your talent and the perfect opportunity.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-[#09090b] border border-white/[0.08] hover:border-white/20 rounded-[28px] p-8 transition-all overflow-hidden"
                        >
                            {/* Accent Glow */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="p-3 bg-white/5 border border-white/5 rounded-xl w-fit mb-6 group-hover:bg-white/10 transition-colors">
                                    <div className="text-white">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                                <p className="text-zinc-400 text-base leading-relaxed">
                                    {feature.description}
                                </p>

                                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-zinc-500 group-hover:text-white transition-colors cursor-pointer w-fit">
                                    Learn more <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Dashboard Preview Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-32 p-1 lg:p-12 bg-transparent border-t border-white/5 relative group"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-sky-500/10 rounded-xl flex items-center justify-center border border-sky-500/20">
                                    <Activity className="w-5 h-5 text-sky-400" />
                                </div>
                                <h4 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Status Tracking</h4>
                            </div>
                            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                                Track your applications effortlessly. Our extension automatically syncs status updates as you browse job portals.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <span className="bg-white/5 text-zinc-300 px-4 py-2 rounded-full text-xs font-medium border border-white/5">Applied</span>
                                <span className="bg-sky-500/10 text-sky-400 px-4 py-2 rounded-full text-xs font-medium border border-sky-500/20">Interviewing</span>
                                <span className="bg-white/5 text-zinc-300 px-4 py-2 rounded-full text-xs font-medium border border-white/5">Offer</span>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-[#09090b] border border-white/10 rounded-[32px] p-6 lg:p-8 shadow-2xl">
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                                    <span className="text-sm font-semibold text-zinc-400">Application History</span>
                                    <div className="flex gap-1.5 items-center">
                                        <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_10px_#0ea5e9] animate-pulse" />
                                        <span className="text-xs text-zinc-500 font-medium">Live sync</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { company: 'Apple', role: 'Frontend Engineer', time: '2m ago', state: 'Active' },
                                        { company: 'Meta', role: 'Product Designer', time: '1h ago', state: 'Interview' },
                                        { company: 'Stripe', role: 'Staff Engineer', time: '1d ago', state: 'Applied' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-default">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-bold text-white border border-white/5">
                                                    {item.company.substring(0, 1)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-white">{item.role}</span>
                                                    <span className="text-xs text-zinc-500 mt-0.5">{item.company} · {item.time}</span>
                                                </div>
                                            </div>
                                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${i === 0 ? 'text-sky-400 bg-sky-500/10 border border-sky-500/20' : 'text-zinc-400 bg-white/5 border border-white/5'
                                                }`}>
                                                {item.state}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Decorative Blur */}
                            <div className="absolute -inset-10 bg-sky-500/5 blur-3xl -z-10 group-hover:bg-sky-500/10 transition-all rounded-[32px] pointer-events-none" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
