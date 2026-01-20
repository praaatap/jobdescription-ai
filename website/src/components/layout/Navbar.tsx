import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, LayoutGrid, Zap, Shield, Search } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const { scrollY } = useScroll();

    // Smooth responsive transforms
    const width = useTransform(scrollY, [0, 50], ["100%", "90%"]);
    const maxWidth = useTransform(scrollY, [0, 50], ["1440px", "1100px"]);
    const y = useTransform(scrollY, [0, 50], [0, 12]);
    const borderRadius = useTransform(scrollY, [0, 50], [0, 24]);
    const borderColor = useTransform(scrollY, [0, 50], ["rgba(255,255,255,0)", "rgba(255,255,255,0.1)"]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Features', icon: <LayoutGrid className="w-3.5 h-3.5" />, href: '#features' },
        { name: 'Process', icon: <Zap className="w-3.5 h-3.5" />, href: '#process' },
        { name: 'Pricing', icon: <Shield className="w-3.5 h-3.5" />, href: '#pricing' },
    ];

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
            <motion.header
                style={{
                    width,
                    maxWidth,
                    y,
                    borderRadius,
                    borderColor,
                }}
                className={`flex items-center justify-between h-20 transition-all duration-500 glass-container pointer-events-auto border ${isScrolled
                        ? 'bg-black/40 backdrop-blur-xl px-8 shadow-[0_0_80px_-20px_rgba(0,0,0,0.5)]'
                        : 'bg-transparent px-6'
                    }`}
            >
                {/* Logo Area */}
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center group-hover:rotate-6 group-active:scale-90 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        <div className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-black" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-2xl tracking-tighter text-white leading-tight">
                            JOBFIT<span className="text-emerald-500">.AI</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-bold text-zinc-500 tracking-[0.25em] uppercase">
                                Neural OPS
                            </span>
                        </div>
                    </div>
                </div>

                {/* Central Navigation Dock */}
                <nav className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-2xl p-1.5 backdrop-blur-sm relative">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            onMouseEnter={() => setHoveredItem(item.name)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className="relative px-6 py-2.5 flex items-center gap-2.5 group group-active:scale-95 transition-transform"
                        >
                            <span className={`text-zinc-500 group-hover:text-emerald-500 transition-colors ${hoveredItem === item.name ? 'scale-110' : 'scale-100'}`}>
                                {item.icon}
                            </span>
                            <span className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all ${hoveredItem === item.name ? 'text-white translate-x-0.5' : 'text-zinc-500'
                                }`}>
                                {item.name}
                            </span>

                            {hoveredItem === item.name && (
                                <motion.div
                                    layoutId="nav-bg"
                                    className="absolute inset-0 bg-white/5 rounded-xl -z-10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}
                        </a>
                    ))}
                </nav>

                {/* Action Area */}
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-zinc-500 hover:text-white hover:border-white/10 transition-all group cursor-pointer active:scale-95">
                        <Search className="w-4 h-4 mr-2" />
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Docs</span>
                    </div>

                    <button className="relative group overflow-hidden bg-white text-black px-8 h-12 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95">
                        <div className="relative z-10 flex items-center gap-2">
                            Install <ChevronRight className="w-3.5 h-3.5 rotate-[-45deg] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                        <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out -z-0" />
                    </button>
                </div>
            </motion.header>
        </div>
    );
};

export default Navbar;
