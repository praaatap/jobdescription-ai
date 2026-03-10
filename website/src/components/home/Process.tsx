import { motion } from 'framer-motion';
import { Key, Upload, Cpu, Shield, Zap, Brain } from 'lucide-react';

const Process = () => {
    return (
        <section id="process" className="py-32 bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05),transparent_50%)] blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-start mb-24">
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 mb-8 w-fit"
                        >
                            <span className="text-[11px] font-semibold text-sky-400">Workflow</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-[64px] font-bold text-white leading-[1.05] tracking-tight mb-6">
                            Simple. Powerful. <br />
                            <span className="text-zinc-500">Secure.</span>
                        </h2>
                    </div>
                    <div className="lg:w-1/2 lg:pt-14">
                        <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                            We've eliminated the friction of the modern job hunt. No complex dashboards, no cloud delays. Just intelligence where you need it most.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Key className="w-6 h-6" />,
                            title: "Initialize Core",
                            description: "Input your Gemini API key to enable analysis. Your credentials remain secure in local storage.",
                            step: "01"
                        },
                        {
                            icon: <Upload className="w-6 h-6" />,
                            title: "Add Profile",
                            description: "Upload your resume. Our engine extracts structure and skills immediately.",
                            step: "02"
                        },
                        {
                            icon: <Cpu className="w-6 h-6" />,
                            title: "Instant Synthesis",
                            description: "Browse any portal. We map your potential to job requirements in milliseconds.",
                            step: "03"
                        }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative group bg-[#09090b] border border-white/[0.05] p-8 rounded-[32px] hover:border-white/10 transition-colors"
                        >
                            <div className="text-[80px] font-bold leading-none text-white/[0.02] absolute top-4 right-6 pointer-events-none tracking-tighter transition-all group-hover:text-white/[0.04]">
                                {item.step}
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                                    <div className="text-sky-400">
                                        {item.icon}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">{item.title}</h3>
                                <p className="text-zinc-400 text-base leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Section */}
                <div className="mt-32 pt-16 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="flex gap-5 items-start bg-white/[0.01] p-6 rounded-3xl border border-white/5">
                        <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                            <Shield className="w-5 h-5 text-sky-400" />
                        </div>
                        <div>
                            <div className="text-white font-semibold mb-1 text-sm">Local-First Privacy</div>
                            <p className="text-sm text-zinc-500 leading-relaxed">No tracking, no cloud storage. Just your data, on your terms.</p>
                        </div>
                    </div>
                    <div className="flex gap-5 items-start bg-white/[0.01] p-6 rounded-3xl border border-white/5">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                            <Zap className="w-5 h-5 text-zinc-300" />
                        </div>
                        <div>
                            <div className="text-white font-semibold mb-1 text-sm">Instant Response</div>
                            <p className="text-sm text-zinc-500 leading-relaxed">Sub-60ms inference time for seamless job board interaction.</p>
                        </div>
                    </div>
                    <div className="flex gap-5 items-start bg-white/[0.01] p-6 rounded-3xl border border-white/5">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-sky-400">
                            <Brain className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-white font-semibold mb-1 text-sm">Advanced LLMs</div>
                            <p className="text-sm text-zinc-500 leading-relaxed">Leveraging capable local AI models for career analysis.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Process;
