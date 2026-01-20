import { motion } from 'framer-motion';
import { Key, Upload, Cpu, Shield, Zap, Brain } from 'lucide-react';

const Process = () => {
    return (
        <section id="process" className="py-40 bg-black relative overflow-hidden">
            {/* Visual Continuity Lines */}
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-emerald-500/20 via-transparent to-transparent" />
            <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-20 items-start mb-32">
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-emerald-500 font-bold tracking-[0.3em] text-xs uppercase mb-8"
                        >
                            Implementation Flow
                        </motion.div>
                        <h2 className="text-6xl md:text-8xl font-bold text-white mb-10 tracking-tight italic">
                            Simple. <br />
                            <span className="text-zinc-700 not-italic">Powerful.</span> <br />
                            Secure.
                        </h2>
                    </div>
                    <div className="lg:w-1/2 pt-10">
                        <p className="text-zinc-500 text-2xl leading-relaxed font-light">
                            We've eliminated the friction of the modern job hunt. No complex dashboards, no cloud delays. Just intelligence where you need it most.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    {[
                        {
                            icon: <Key className="w-8 h-8" />,
                            title: "Initialize Neural Core",
                            description: "Securely input your Gemini Pro API key to enable analysis. Your data remains in your local vault.",
                            step: "01"
                        },
                        {
                            icon: <Upload className="w-8 h-8" />,
                            title: "Ingest Resume DNA",
                            description: "Upload your PDF. Our engine extracts structure and skills with sub-pixel precision.",
                            step: "02"
                        },
                        {
                            icon: <Cpu className="w-8 h-8" />,
                            title: "Real-time Synthesis",
                            description: "Browse any portal. We map your potential to the job requirements in 60ms.",
                            step: "03"
                        }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="relative"
                        >
                            <div className="text-[120px] font-black leading-none text-white/[0.03] absolute -top-20 -left-4 pointer-events-none tracking-tighter">
                                {item.step}
                            </div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-[#09090b] border border-white/10 rounded-3xl flex items-center justify-center mb-10 shadow-2xl group">
                                    <div className="text-emerald-500 group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-6 tracking-tight">{item.title}</h3>
                                <p className="text-zinc-500 text-xl leading-relaxed font-medium">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Section */}
                <div className="mt-40 pt-20 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex gap-6 items-start">
                        <div className="p-3 rounded-2xl bg-emerald-500/5">
                            <Shield className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <div className="text-white font-bold mb-2">Local-First Privacy</div>
                            <p className="text-sm text-zinc-500 leading-relaxed">No tracking, no cloud storage. Just your data, on your terms.</p>
                        </div>
                    </div>
                    <div className="flex gap-6 items-start">
                        <div className="p-3 rounded-2xl bg-zinc-900">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-white font-bold mb-2">Instant Response</div>
                            <p className="text-sm text-zinc-500 leading-relaxed">Sub-60ms inference time for seamless job board interaction.</p>
                        </div>
                    </div>
                    <div className="flex gap-6 items-start">
                        <div className="p-3 rounded-2xl bg-zinc-900 text-emerald-500">
                            <Brain className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-white font-bold mb-2">Gemini Pro 1.5</div>
                            <p className="text-sm text-zinc-500 leading-relaxed">Leveraging the world's most capable AI for career analysis.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Process;
