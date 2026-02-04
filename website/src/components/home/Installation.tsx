import { Download, Chrome, CheckCircle2, Box } from 'lucide-react';
import React from 'react';

const Installation = () => {
    return (
        <section className="py-32 bg-zinc-900/50 relative overflow-hidden" id="installation">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-sm font-bold tracking-[0.2em] text-emerald-500 uppercase mb-4">
                        Get Started
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
                        Install JobFit AI <span className="text-zinc-500">Today</span>
                    </h3>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        Choose your preferred installation method. Currently available for Chromium-based browsers (Chrome, Edge, Brave).
                    </p>
                </div>

                <div className="max-w-xl mx-auto">
                    {/* Method 1: ZIP Installation */}
                    <div className="group relative p-1 rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative h-full bg-black/90 rounded-xl p-8 border border-white/5">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <Box className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white">Manual Installation (ZIP)</h4>
                                    <p className="text-zinc-500 text-sm">Recommended for Chrome users</p>
                                </div>
                            </div>

                            <div className="space-y-6 mb-8">
                                <Step
                                    number="01"
                                    title="Download Extension"
                                    desc="Download the latest release zip file from our GitHub."
                                />
                                <Step
                                    number="02"
                                    title="Unzip Package"
                                    desc="Extract the zip file to a permanent folder on your computer."
                                />
                                <Step
                                    number="03"
                                    title="Load Extension"
                                    desc="Open Extensions page, enable Developer Mode, and 'Load Unpacked'."
                                />
                            </div>

                            <a
                                href="https://github.com/praaatap/jobdescription-ai/releases/download/v0.3/resume-analyzer-pro-v0.3.zip"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-emerald-500 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Download for Chrome (ZIP)
                            </a>
                        </div>
                    </div>
                </div>

                {/* Browser Specific Instructions */}
                <div className="max-w-4xl mx-auto mt-20">
                    <h4 className="text-center text-zinc-500 font-medium mb-10 uppercase tracking-widest text-sm">Browser Specific Instructions</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <BrowserCard
                            icon={<Chrome className="w-6 h-6 text-white" />}
                            name="Google Chrome"
                            steps={[
                                "Go to chrome://extensions",
                                "Toggle 'Developer mode' (top right)",
                                "Click 'Load unpacked'",
                                "Select the extracted folder"
                            ]}
                        />
                        <BrowserCard
                            icon={<div className="w-6 h-6 text-white font-bold text-lg">E</div>} // Simple Edge Icon
                            name="Microsoft Edge"
                            steps={[
                                "One-click installation from Edge Add-ons",
                                "Automatic updates enabled",
                                "Secure and verified",
                            ]}
                            action={
                                <a
                                    href="https://microsoftedge.microsoft.com/addons/detail/jobfit-ai-resume-analyz/ebdeefegbajpgbhagfaogejgobaphdpf"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 mt-2 bg-emerald-600/20 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-600/30 font-bold rounded-lg transition-colors text-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    Get it on Edge Add-ons
                                </a>
                            }
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

const Step = ({ number, title, desc }: { number: string; title: string; desc: React.ReactNode }) => (
    <div className="flex gap-4">
        <span className="font-mono text-zinc-600 font-bold pt-1">{number}</span>
        <div>
            <h5 className="font-bold text-white mb-1">{title}</h5>
            <div className="text-zinc-400 text-sm leading-relaxed">{desc}</div>
        </div>
    </div>
);

const BrowserCard = ({ icon, name, steps, action }: { icon: React.ReactNode; name: string; steps: string[]; action?: React.ReactNode }) => (
    <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center border border-white/10">
                {icon}
            </div>
            <span className="font-bold text-white">{name}</span>
        </div>
        <ul className="space-y-3 mb-6 flex-grow">
            {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 w-full text-sm text-zinc-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{step}</span>
                </li>
            ))}
        </ul>
        {action}
    </div>
);

export default Installation;
