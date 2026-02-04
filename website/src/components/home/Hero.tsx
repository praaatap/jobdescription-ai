import { motion } from 'framer-motion';
import { Settings, History, Brain, Terminal, Sun, Download, FileText, Check } from 'lucide-react';

const ExtensionPreview = () => {
    return (
        <div className="w-full max-w-[380px] bg-[#09090b] rounded-[24px] border border-white/10 shadow-2xl overflow-hidden font-sans text-left relative transform transition-all hover:scale-[1.02] duration-500">
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-black" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-bold leading-none mb-1 text-sm">JobFit AI</h4>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Smart Career Intelligence</p>
                    </div>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    <Sun className="w-3.5 h-3.5" />
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5">
                {/* Active File Badge */}
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl flex items-center justify-between mb-5 group hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                            <FileText className="w-3.5 h-3.5 text-zinc-300" />
                        </div>
                        <div>
                            <div className="text-white font-bold text-xs truncate max-w-[100px]">pratapsinghsis...</div>
                            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Active</div>
                        </div>
                    </div>
                    <div className="flex gap-1.5">
                        <button className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[8px] font-bold text-zinc-400 uppercase tracking-tighter hover:text-white transition-colors">Update</button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-3 gap-1 bg-white/[0.03] p-1 rounded-xl mb-5 border border-white/5">
                    <button className="flex items-center justify-center gap-1.5 py-2 bg-white text-black rounded-lg text-[10px] font-bold shadow-lg shadow-white/5 transition-all active:scale-95">
                        <Brain className="w-3 h-3" /> Analyze
                    </button>
                    <button className="flex items-center justify-center gap-1.5 py-2 text-zinc-500 text-[10px] font-bold hover:text-zinc-300 transition-colors">
                        <History className="w-3 h-3" /> History
                    </button>
                    <button className="flex items-center justify-center gap-1.5 py-2 text-zinc-500 text-[10px] font-bold hover:text-zinc-300 transition-colors">
                        <Settings className="w-3 h-3" /> Settings
                    </button>
                </div>

                {/* EXTRACT JOB Section */}
                <div className="mb-5">
                    <div className="flex items-center gap-2 text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2.5">
                        <Download className="w-2.5 h-2.5" /> Extract Job
                    </div>
                    <button className="w-full py-3 bg-white text-black rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-xl active:scale-98">
                        <Download className="w-3.5 h-3.5" /> Extract from Current Page
                    </button>
                </div>

                {/* JOB DETAILS Section */}
                <div>
                    <div className="flex items-center gap-2 text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2.5">
                        <FileText className="w-2.5 h-2.5" /> Job Details
                    </div>
                    <div className="space-y-2.5">
                        <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl text-[10px] font-bold text-white shadow-inner">
                            Senior Software Engineer
                        </div>
                        <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl text-[10px] font-bold text-zinc-600">
                            Company
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl text-[10px] leading-relaxed text-zinc-400 font-medium h-[80px] overflow-hidden relative">
                            <div className="mb-1">TC</div>
                            <div className="mb-1">TechCorp Inc.</div>
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#09090b] to-transparent" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Glass Overlays */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/[0.02] to-transparent" />
        </div>
    );
};

const Hero = () => {
    return (
        <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-black pt-32 pb-20">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-grid opacity-[0.15]" />
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)] blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-8 w-fit"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                            <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
                                Neural Career Intelligence v2.0
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight mb-8 text-white"
                        >
                            The intelligence layer <br />
                            for your <span className="text-zinc-500">career.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-lg text-zinc-400 mb-10 max-w-lg leading-relaxed font-light"
                        >
                            JobFit AI bridges the gap between your unique experience and complex requirements using local-first neural matching.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 items-start"
                        >
                            <button className="px-8 py-4 bg-white text-black rounded-xl font-bold text-sm hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all active:scale-95">
                                Start Free Analysis
                            </button>
                            <button className="px-8 py-4 bg-transparent border border-white/10 text-white rounded-xl font-bold text-sm hover:bg-white/5 transition-all active:scale-95 flex items-center justify-center gap-2 group">
                                <Terminal className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                                <span>View Documentation</span>
                            </button>
                        </motion.div>

                        <div className="mt-12 flex items-center gap-4 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                            <span>Trusted by engineers at</span>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
                        className="lg:col-span-5 relative hidden lg:flex justify-center items-center"
                    >
                        {/* More subtle decorative backdrop */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent blur-[100px] opacity-40" />

                        <div className="relative z-10 product-shadow hover:rotate-1 transition-transform duration-700 ease-out">
                            <ExtensionPreview />
                        </div>

                        {/* Feature Badges - Positioned more naturally */}
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-4 top-10 glass px-4 py-3 rounded-2xl z-20 border border-white/10 shadow-xl bg-black/60 backdrop-blur-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#10b981]/10 rounded-lg">
                                    <Brain className="w-4 h-4 text-[#10b981]" />
                                </div>
                                <div>
                                    <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Match Score</div>
                                    <div className="text-sm font-bold text-white leading-none">98.4%</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -left-8 bottom-20 glass px-4 py-3 rounded-2xl z-20 border border-white/10 shadow-xl bg-black/60 backdrop-blur-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/5 rounded-lg">
                                    <Check className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div>
                                    <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Optimize</div>
                                    <div className="text-sm font-bold text-white leading-none">Ready</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
