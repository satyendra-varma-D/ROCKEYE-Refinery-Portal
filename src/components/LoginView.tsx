import React, { useState } from "react"
import { Icon } from "./DesignSystem"

interface LoginViewProps {
  onLogin: () => void
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setError("Please enter your Operational ID and Password.")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulated auth delay
    setTimeout(() => {
      onLogin()
    }, 1500)
  }

  return (
    <div className="flex w-full h-screen bg-slate-900 overflow-hidden font-sans">
      
      {/* Left Panel: High-End Industrial Branding Presentation */}
      <div className="hidden lg:flex relative w-[55%] h-full flex-col justify-between p-16 overflow-hidden">
        
        {/* Dynamic Abstract Refinery Background using CSS Gradients instead of raw image for reliable high-res quality */}
        <div className="absolute inset-0 z-0 bg-slate-900">
           {/* Geometric shapes representing tanks/pipes */}
           <div className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-blue-900/40 to-slate-900/5 blur-3xl mix-blend-screen opacity-70"></div>
           <div className="absolute top-[40%] -right-[20%] w-[60%] h-[90%] rounded-full bg-gradient-to-tl from-amber-600/20 via-amber-700/10 to-transparent blur-3xl mix-blend-screen opacity-80"></div>
           <div className="absolute -bottom-[20%] left-[10%] w-[70%] h-[50%] rounded-full bg-gradient-to-tr from-emerald-900/30 to-transparent blur-3xl mix-blend-screen opacity-60"></div>
           
           {/* Subtle Grid Overlay for Engineering Feel */}
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>

        {/* Animated Liquid Droplets (Representing Golden Palm Oil) */}
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none opacity-50">
          <div className="absolute top-[25%] left-[25%] w-48 h-48 bg-amber-500/20 rounded-full blur-2xl animate-[pulse_5s_infinite]"></div>
          <div className="absolute bottom-[30%] right-[30%] w-64 h-64 bg-amber-400/10 rounded-full blur-3xl animate-[pulse_7s_infinite_delay-2s]"></div>
        </div>

        {/* Top Header Logo */}
        <div className="relative z-30 animate-[slide-up_0.6s_ease-out]">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/20">
              <img src="/assets/palm-logo.png" alt="ROCKEYE" className="w-12 h-12 object-contain" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-3xl font-extrabold text-white tracking-widest uppercase shadow-black/50 drop-shadow-md">Rockeye</h2>
              <span className="text-amber-500 font-bold text-sm tracking-[0.2em] uppercase mt-0.5">Palm Oil Ecosystem</span>
            </div>
          </div>
        </div>

        {/* Main Value Proposition Text */}
        <div className="relative z-30 animate-[slide-up_0.8s_ease-out] mt-auto mb-20 max-w-xl">
          <h1 className="text-5xl font-bold text-white tracking-tight leading-[1.15]">
            Precision control for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Modern Refineries.
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-300 font-light leading-relaxed">
            Centralized intelligence for CPO tank farm telemetry, real-time yield optimization, quality control, and automated dispatch routing.
          </p>
          
          <div className="flex items-center gap-6 mt-10">
            <div className="flex flex-col gap-1 border-l-2 border-amber-500 pl-4">
              <span className="text-3xl font-bold text-white">99.8%</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Uptime</span>
            </div>
            <div className="flex flex-col gap-1 border-l-2 border-emerald-500 pl-4">
              <span className="text-3xl font-bold text-white">ISO</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">22000 Ready</span>
            </div>
          </div>
        </div>

        <div className="relative z-30 text-slate-500 text-xs font-medium animate-[slide-up_1s_ease-out]">
          <p>&copy; {new Date().getFullYear()} ROCKEYE Industrial Systems. Secure Terminal.</p>
        </div>
      </div>

      {/* Right Panel: Clean, Premium Login Form */}
      <div className="flex-1 h-full flex items-center justify-center p-8 bg-slate-950 relative shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-40">
        
        {/* Subtle right-side background texture */}
        <div className="absolute inset-0 z-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="relative z-10 w-full max-w-[420px] animate-[slide-up_0.6s_ease-out]">
          
          {/* Mobile Logo Fallback */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
             <div className="bg-white p-2 rounded-xl border border-slate-700 shadow-sm">
              <img src="/assets/palm-logo.png" alt="ROCKEYE" className="w-8 h-8 object-contain" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-white tracking-widest uppercase">Rockeye</h2>
              <span className="text-amber-500 font-semibold text-[10px] tracking-widest uppercase">Refinery OS</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-10">
            <h2 className="text-3xl font-bold text-white tracking-tight">Operator Login</h2>
            <p className="text-sm text-slate-400 font-medium">Please authenticate to access the Control Center.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 animate-[shake_0.4s_ease-in-out]">
                <Icon name="alert-triangle" size={16} />
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Operational ID / Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors">
                  <Icon name="user" size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-600 rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
                  placeholder="e.g. shift_supervisor_01"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Security Key</label>
                <a href="#" className="text-xs font-semibold text-amber-500 hover:text-amber-400 transition-colors">Reset Access?</a>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors">
                  <Icon name="lock" size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-600 rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-4 relative overflow-hidden group bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-sm py-4 rounded-xl transition-all shadow-[0_4px_20px_0_rgba(217,119,6,0.3)] hover:shadow-[0_6px_25px_rgba(217,119,6,0.4)] ${isLoading ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Animated Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
              
              <div className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Establishing Secure Connection...
                  </>
                ) : (
                  <>
                    Initialize Session
                    <Icon name="arrow-right" size={18} />
                  </>
                )}
              </div>
            </button>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Icon name="shield" size={14} />
              <span>End-to-End Encrypted Facility Connection</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
