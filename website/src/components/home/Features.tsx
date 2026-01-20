import { motion } from 'framer-motion';
import { Brain, Target, Activity, Shield, Zap } from 'lucide-react';

const features = [
    {
        icon: <Brain className="w-8 h-8" />,
        title: "Neural Context Engine",
        description: "Moving beyond simple keywords. Our engine performs deep linguistic analysis to match the latent intent of job descriptions with your specific achievements.",
        accent: "from-emerald-500/20 to-transparent"
    },
    {
        icon: <Zap className="w-8 h-8" />,
        title: "Sub-Second Extraction",
        description: "Optimized browser-level automation that scrapes job details from any recruiter portal in milliseconds, without interfering with your browsing experience.",
        accent: "from-zinc-500/10 to-transparent"
    },
    {
        icon: <Shield className="w-8 h-8" />,
        title: "Privacy-First Intel",
        description: "Zero cloud-dependency. All resume parsing and matching logic runs locally within your browser extension, ensuring your data never leaves your control.",
        accent: "from-zinc-500/10 to-transparent"
    }
];

const Features = () => {
    return (
        <section id="features" className="py-40 bg-black relative">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-end mb-32">
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full inline-block mb-8"
                        >
                            <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-500 uppercase">Architecture</span>
                        </motion.div>
                        <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                            Built for the next <br />
                            <span className="text-zinc-500">generation of talent.</span>
                        </h2>
                    </div>
                    <div className="lg:col-span-4">
                        <p className="text-zinc-500 text-xl leading-relaxed italic border-l-2 border-emerald-500/50 pl-8">
                            "We didn't just build a matcher; we built a bridge between talent and opportunity."
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-[#09090b] border border-white/5 rounded-[32px] p-10 hover:border-white/20 transition-all overflow-hidden"
                        >
                            {/* Accent Glow */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="p-4 bg-white/5 rounded-2xl w-fit mb-8 group-hover:bg-white/10 transition-colors">
                                    <div className="text-white">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-6">{feature.title}</h3>
                                <p className="text-zinc-500 text-lg leading-relaxed font-medium">
                                    {feature.description}
                                </p>

                                <div className="mt-auto pt-10 flex items-center gap-2 text-xs font-bold text-zinc-600 group-hover:text-emerald-500 transition-colors uppercase tracking-widest">
                                    Exploration <Target className="w-3 h-3" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Status Dashboard Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-32 p-12 bg-[#09090b] border border-white/10 rounded-[40px] relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-emerald-500" />
                                </div>
                                <h4 className="text-2xl font-bold text-white">Live Status Monitoring</h4>
                            </div>
                            <p className="text-zinc-500 text-xl leading-relaxed mb-8">
                                Track your application lifecycle with high-fidelity status updates. Our system automatically synchronizes your history across platforms.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <span className="bg-[#10b981]/10 text-[#10b981] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">Applied</span>
                                <span className="bg-white/5 text-zinc-400 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">Interviewed</span>
                                <span className="bg-white/5 text-emerald-500 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border border-emerald-500/20">Offer Made</span>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-black/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Application History</span>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                                </div>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-xs font-bold text-zinc-600">
                                                    {i === 1 ? 'GOO' : i === 2 ? 'META' : 'APL'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white">{i === 1 ? 'Frontend Engineer' : i === 2 ? 'Product Designer' : 'Staff Engineer'}</div>
                                                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Synced 2m ago</div>
                                                </div>
                                            </div>
                                            <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Decorative Blur */}
                            <div className="absolute -inset-10 bg-emerald-500/10 blur-3xl -z-10 group-hover:bg-emerald-500/20 transition-all" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
