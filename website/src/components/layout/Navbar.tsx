import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, LayoutGrid, Zap, Shield } from 'lucide-react';

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
        { name: 'Features', icon: <LayoutGrid className="w-4 h-4" />, href: '#features' },
        { name: 'Process', icon: <Zap className="w-4 h-4" />, href: '#process' },
        { name: 'Pricing', icon: <Shield className="w-4 h-4" />, href: '#pricing' },
    ];

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none mt-2">
            <motion.header
                style={{
                    width,
                    maxWidth,
                    y,
                    borderRadius,
                    borderColor,
                }}
                className={`flex items-center justify-between h-16 transition-all duration-500 pointer-events-auto border border-transparent ${isScrolled
                    ? 'bg-black/60 backdrop-blur-2xl px-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]'
                    : 'bg-transparent px-6'
                    }`}
            >
                {/* Logo Area */}
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white to-zinc-300 flex items-center justify-center p-[1px] shadow-sm">
                        <div className="w-full h-full bg-black rounded-[7px] flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full border-[1.5px] border-white flex items-center justify-center">
                                <div className="w-1 h-1 rounded-full bg-sky-400" />
                            </div>
                        </div>
                    </div>
                    <span className="font-bold text-lg tracking-tight text-white leading-tight">
                        JobFit AI
                    </span>
                </div>

                {/* Central Navigation */}
                <nav className="hidden md:flex items-center gap-2">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            onMouseEnter={() => setHoveredItem(item.name)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className="relative px-4 py-2 flex items-center gap-2 transition-all rounded-full"
                        >
                            <span className={`text-sm font-medium transition-colors ${hoveredItem === item.name ? 'text-white' : 'text-zinc-400'
                                }`}>
                                {item.name}
                            </span>
                        </a>
                    ))}
                </nav>

                {/* Action Area */}
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer">
                        Documentation
                    </div>

                    <button className="flex items-center gap-2 bg-white text-black px-5 h-9 rounded-full font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
                        Install Extension <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </motion.header>
        </div>
    );
};

export default Navbar;
