import Navbar from './components/layout/Navbar';
import Hero from './components/home/Hero';
import Features from './components/home/Features';
import Process from './components/home/Process';
import Pricing from './components/home/Pricing';
import Installation from './components/home/Installation';

function App() {
  return (
    <main className="bg-black min-h-screen text-white selection:bg-sky-500/30 selection:text-white antialiased">
      <Navbar />

      <div className="relative">
        <Hero />
        <Features />
        <Process />
        <Installation />
        <Pricing />
      </div>

      {/* Premium Dark Footer */}
      <footer className="py-24 bg-black border-t border-white/5 relative z-10 overflow-hidden">
        {/* Subtle Bottom Glow */}
        <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-full max-w-2xl h-[300px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 mb-24">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white to-zinc-300 flex items-center justify-center p-[1px]">
                  <div className="w-full h-full bg-black rounded-[11px] flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full border-[1.5px] border-white flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-sky-400" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl tracking-tight text-white">JobFit AI</span>
                  <span className="text-[11px] font-medium text-zinc-500">Smart Resume Matching</span>
                </div>
              </div>
              <p className="text-zinc-500 max-w-sm mb-8 text-base leading-relaxed">
                Matches your specific experience to job requirements in milliseconds. Runs entirely locally in your browser.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-zinc-400">
                <li className="hover:text-white cursor-pointer transition-colors">Extension Browser</li>
                <li className="hover:text-white cursor-pointer transition-colors">Features</li>
                <li className="hover:text-white cursor-pointer transition-colors">Documentation</li>
                <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-zinc-400">
                <li className="hover:text-white cursor-pointer transition-colors">X / Twitter</li>
                <li className="hover:text-white cursor-pointer transition-colors">GitHub</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
            <div className="text-sm text-zinc-500">
              © {new Date().getFullYear()} JobFit AI. All rights reserved.
            </div>
            <div className="flex gap-6 mt-4 md:mt-0 text-sm text-zinc-500">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default App;
