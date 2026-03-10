import { motion } from 'framer-motion';
import { Settings, History, Brain, Target, ArrowRight, Download, FileText, Check } from 'lucide-react';

const ExtensionPreview = () => {
    return (
        <div className="w-full max-w-[380px] bg-[#09090b] rounded-[24px] border border-white/10 shadow-2xl overflow-hidden font-sans text-left relative transform transition-all hover:scale-[1.02] duration-500 flex flex-col items-center">
            {/* Header */}
            <div className="w-full p-4 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white to-zinc-300 flex items-center justify-center p-[1px]">
                        <div className="w-full h-full rounded-[7px] bg-black flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full border border-white flex items-center justify-center">
                                <div className="w-1 h-1 rounded-full bg-sky-400" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-medium leading-none mb-0.5 text-sm">JobFit AI</h4>
                        <p className="text-[11px] text-zinc-500 font-medium">Smart Matcher</p>
                    </div>
                </div>
                <div className="w-8 h-8 rounded-md hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    <Settings className="w-4 h-4" />
                </div>
            </div>

            {/* Content Area */}
            <div className="w-full p-5 flex flex-col gap-4">
                {/* Active File Badge */}
                <div className="bg-white/[0.03] border border-white/10 p-3 rounded-xl flex items-center justify-between group hover:bg-white/[0.05] transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-sky-500/10 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-sky-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-medium text-sm">My_Resume_2025.pdf</span>
                            <span className="text-[11px] text-zinc-500">Active Profile</span>
                        </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-medium border border-green-500/20">Ready</span>
                </div>

                {/* EXTRACT JOB Section */}
                <button className="w-full py-3.5 bg-white text-black rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-xl active:scale-[0.98]">
                    <Target className="w-4 h-4" /> Analyze Current Job Posting
                </button>

                {/* Insights / Stats Preview */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex flex-col gap-1">
                        <span className="text-[11px] text-zinc-500">Match Score</span>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-semibold text-white">92%</span>
                            <Brain className="w-4 h-4 text-sky-400" />
                        </div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex flex-col gap-1">
                        <span className="text-[11px] text-zinc-500">Missing keywords</span>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-semibold text-white">3</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Glass Overlays */}
            <div className="absolute inset-0 pointer-events-none rounded-[24px] border border-white/10" />
        </div>
    );
};

const Hero = () => {
    return (
        <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-black pt-32 pb-20">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08),transparent_50%)] blur-[100px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_50%)] blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 mb-8 w-fit"
                        >
                            <span className="text-[11px] font-semibold text-sky-400">
                                JobFit AI Extension v2.0
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-5xl md:text-[80px] font-bold leading-[1.05] tracking-tight mb-6 text-white"
                        >
                            Beat the ATS.<br />
                            Land the <span className="text-zinc-500">interview.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-lg md:text-xl text-zinc-400 mb-10 max-w-lg leading-relaxed"
                        >
                            Instantly match your resume with any job posting. Stop guessing what recruiters want, and start applying with confidence.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 items-start"
                        >
                            <button className="px-8 py-4 bg-white text-black rounded-full font-semibold text-sm hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                Add to Chrome <ArrowRight className="w-4 h-4" />
                            </button>
                            <button className="px-8 py-4 bg-zinc-900 border border-white/10 text-white rounded-full font-semibold text-sm hover:bg-zinc-800 transition-all active:scale-[0.98]">
                                How it works
                            </button>
                        </motion.div>

                        <div className="mt-12 flex items-center gap-4 text-xs text-zinc-500 font-medium">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-zinc-800" />
                                ))}
                            </div>
                            <span>Join 10,000+ job seekers</span>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
                        className="lg:col-span-5 relative hidden lg:flex justify-center items-center"
                    >
                        {/* More subtle decorative backdrop */}
                        <div className="absolute inset-0 bg-sky-500/10 blur-[100px] rounded-full opacity-50" />

                        <div className="relative z-10 product-shadow">
                            <ExtensionPreview />
                        </div>

                        {/* Feature Badges - Positioned more naturally */}
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-4 top-10 glass px-4 py-3 rounded-2xl z-20 border border-white/10 shadow-xl bg-black/80 backdrop-blur-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-sky-500/10 rounded-lg">
                                    <Check className="w-4 h-4 text-sky-400" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-medium text-zinc-400">Perfect Match</div>
                                    <div className="text-sm font-semibold text-white leading-none mt-0.5">Recommended</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -left-10 bottom-24 glass px-4 py-3 rounded-2xl z-20 border border-white/10 shadow-xl bg-black/80 backdrop-blur-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/5 rounded-lg text-white font-mono text-xs font-bold w-8 h-8 flex justify-center items-center">
                                    ATS
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="w-[90%] h-full bg-sky-400 rounded-full" />
                                    </div>
                                    <div className="text-[10px] font-medium text-zinc-400">Parsing Resume</div>
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
