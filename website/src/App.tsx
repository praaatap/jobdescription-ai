import Navbar from './components/layout/Navbar';
import Hero from './components/home/Hero';
import Features from './components/home/Features';
import Process from './components/home/Process';
import Pricing from './components/home/Pricing';
import Installation from './components/home/Installation';

function App() {
  return (
    <main className="bg-black min-h-screen text-white selection:bg-emerald-500/30 font-sans selection:text-white">
      {/* Global Grain/Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] bg-noise opacity-[0.05]" />

      <Navbar />

      <div className="relative">
        <Hero />
        <Features />
        <Process />
        <Installation />
        <Pricing />
      </div>

      {/* Premium Dark Footer */}
      <footer className="py-32 bg-black border-t border-white/5 relative z-10 overflow-hidden">
        {/* Subtle Bottom Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full border-2 border-black flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-black" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-2xl tracking-tighter text-white">JOBFIT.AI</span>
                  <span className="text-[10px] font-bold text-zinc-600 tracking-[0.3em] uppercase">Neural Career Intelligence</span>
                </div>
              </div>
              <p className="text-zinc-500 max-w-sm mb-12 text-lg leading-relaxed font-medium">
                Redefining the relationship between talent and opportunity through advanced local inference and semantic matching.
              </p>
            </div>

            <div>
              <h4 className="text-[11px] font-bold tracking-[0.4em] uppercase text-zinc-300 mb-10">Product</h4>
              <ul className="space-y-6 text-sm font-semibold text-zinc-500">
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">Extension Browser</li>
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">Neural Matcher</li>
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">Documentation</li>
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">Status Board</li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold tracking-[0.4em] uppercase text-zinc-300 mb-10">Labs</h4>
              <ul className="space-y-6 text-sm font-semibold text-zinc-500">
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">X / Twitter</li>
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">Discord Community</li>
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">LinkedIn Portal</li>
                <li className="hover:text-emerald-500 cursor-pointer transition-colors">GitHub Dev</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5">
            <div className="text-[11px] font-bold tracking-[0.3em] text-zinc-600 uppercase">
              © {new Date().getFullYear()} NEURAL CAREER LABS. ALL INTELLECT RESERVED.
            </div>
            <div className="flex gap-12 mt-8 md:mt-0 text-[11px] font-bold tracking-[0.3em] text-zinc-600 uppercase">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Privacy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Ops</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default App;
