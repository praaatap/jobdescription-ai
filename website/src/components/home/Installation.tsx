import { Download, Chrome, CheckCircle2, Box } from 'lucide-react';
const Installation = () => {
    return (
        <section className="py-32 bg-black relative overflow-hidden border-t border-white/5" id="installation">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.06),transparent_50%)] blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20 md:mb-24 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 mb-8 w-fit">
                        <h2 className="text-[11px] font-semibold text-sky-400">
                            Get Started
                        </h2>
                    </div>
                    <h3 className="text-4xl md:text-[64px] font-bold leading-[1.05] tracking-tight mb-8 text-white">
                        Install JobFit AI <span className="text-zinc-500">Today</span>
                    </h3>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-base">
                        Choose your preferred installation method. Currently available for Chromium-based browsers (Chrome, Edge, Brave).
                    </p>
                </div>

                <div className="max-w-xl mx-auto">
                    {/* Method 1: ZIP Installation */}
                    <div className="group relative rounded-3xl bg-[#111113] overflow-hidden border border-white/10 shadow-xl">
                        <div className="relative h-full p-8 md:p-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
                                        <Box className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white">Manual Installation</h4>
                                        <p className="text-zinc-500 text-sm">Recommended for Chrome users</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-white/5 border border-white/10 text-zinc-400 rounded text-xs font-mono">.ZIP</span>
                            </div>

                            <div className="space-y-4 mb-10">
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
                                href="https://github.com/praaatap/jobdescription-ai/releases/latest/download"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors shadow-md active:scale-[0.98]"
                            >
                                <Download className="w-4 h-4" />
                                Download for Chrome
                            </a>
                        </div>
                    </div>
                </div>

                {/* Browser Specific Instructions */}
                <div className="max-w-4xl mx-auto mt-24">
                    <h4 className="text-center text-zinc-500 font-medium mb-8 text-sm">Browser Specific Instructions</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <BrowserCard
                            icon={<Chrome className="w-5 h-5 text-white" />}
                            name="Google Chrome"
                            steps={[
                                "Go to chrome://extensions",
                                "Toggle 'Developer mode' (top right)",
                                "Click 'Load unpacked'",
                                "Select the extracted folder"
                            ]}
                        />
                        <BrowserCard
                            icon={<div className="w-5 h-5 text-white font-bold text-base flex justify-center items-center">E</div>} // Simple Edge Icon
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
                                    className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 font-semibold rounded-lg transition-colors text-sm"
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
        <span className="font-mono text-zinc-500 font-medium text-sm pt-1">{number}</span>
        <div>
            <h5 className="font-semibold text-white mb-0.5 text-sm">{title}</h5>
            <div className="text-zinc-500 text-sm leading-relaxed">{desc}</div>
        </div>
    </div>
);

const BrowserCard = ({ icon, name, steps, action }: { icon: React.ReactNode; name: string; steps: string[]; action?: React.ReactNode }) => (
    <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-colors flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                {icon}
            </div>
            <span className="font-semibold text-white text-sm">{name}</span>
        </div>
        <ul className="space-y-4 mb-6 flex-grow">
            {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 w-full text-sm text-zinc-400">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{step}</span>
                </li>
            ))}
        </ul>
        {action}
    </div>
);

export default Installation;
