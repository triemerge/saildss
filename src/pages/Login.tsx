// src/pages/Login.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // If user arrived with a next param, preserve it.
  const next = searchParams.get('next') || '/'

  // If user is already logged in, go to next immediately
  useEffect(() => {
    supabase.auth.getSession().then(res => {
      if (res.data.session?.user) navigate(next, { replace: true })
    })
  }, [navigate, next])

  const handlePostLoginNavigation = () => {
    // If we have a next, remove stored key and navigate
    const stored = localStorage.getItem('post_login_next')
    if (stored) {
      localStorage.removeItem('post_login_next')
      navigate(stored, { replace: true })
    } else {
      navigate(next || '/', { replace: true })
    }
  }

  const signInWithPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setMessage(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setMessage(error.message)
    else {
      handlePostLoginNavigation()
    }
  }

  const signInWithMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setMessage(null)

    // store the intended next path so that when supabase redirects back,
    // the app-level auth listener can navigate to it.
    localStorage.setItem('post_login_next', next)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin } // ensure redirect returns to app
    })

    setLoading(false)
    if (error) setMessage(error.message)
    else setMessage('Magic link sent — check your email.')
  }

  const resetPassword = async () => {
    if (!email) { setMessage('Enter your email to reset'); return }
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-callback`,
    })
    setLoading(false)
    if (error) setMessage(error.message)
    else setMessage('Password reset email sent.')
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl grid grid-cols-12 gap-6">
        {/* Left: train illustration / theme */}
        <div className="col-span-12 lg:col-span-6 flex items-center justify-center">
          <div className="p-8 rounded-2xl bg-[color:var(--card)] shadow-card w-full max-w-md">
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-[color:var(--card-foreground)]">Welcome to SAIL DSS</h1>
              <p className="text-sm text-[color:var(--muted-foreground)] mt-1">Optimization & scheduling for rakes</p>
            </div>

            {/* simple animated train svg */}
            <div className="overflow-hidden">
              <div className="w-full h-36 relative">
                <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#1f6feb"/>
                      <stop offset="1" stopColor="#4cc9f0"/>
                    </linearGradient>
                  </defs>

                  {/* ground */}
                  <rect x="0" y="160" width="800" height="40" fill="#111827" opacity="0.08" />

                  {/* train group — translate animation by CSS */}
                  <g className="train" transform="translate(0,0)">
                    <rect x="20" y="70" rx="12" ry="12" width="220" height="60" fill="url(#g1)" />
                    <rect x="240" y="85" rx="6" ry="6" width="120" height="45" fill="#0f172a" opacity="0.12" />
                    <circle cx="70" cy="140" r="14" fill="#0f172a" />
                    <circle cx="190" cy="140" r="14" fill="#0f172a" />
                    <circle cx="300" cy="140" r="14" fill="#0f172a" />
                  </g>
                </svg>
                <style>{`
                  .train {
                    transform-origin: 0 0;
                    animation: train-move 6s linear infinite;
                  }
                  @keyframes train-move {
                    0% { transform: translateX(-20%); }
                    50% { transform: translateX(10%); }
                    100% { transform: translateX(-20%); }
                  }
                `}</style>
              </div>
            </div>

            <div className="mt-6 text-sm text-[color:var(--muted-foreground)]">
              <p>Fast deployment • Light UI • Designed for operations teams</p>
            </div>
          </div>
        </div>

        {/* Right: login form */}
        <div className="col-span-12 lg:col-span-6 flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-extrabold mb-2 text-slate-800">Sign in</h2>
            <p className="text-sm text-slate-500 mb-6">Enter your email to continue</p>

            <form onSubmit={signInWithPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="mt-2 w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <div className="relative mt-2">
                  <input
                    type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password (or use magic link)"
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-sky-300"
                  />
                  <button type="button" onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-600">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <button className="w-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-xl py-3 font-semibold"
                  type="submit" disabled={loading}>
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <button type="button" onClick={signInWithMagicLink} className="hover:underline">Send magic link</button>
                <button type="button" onClick={resetPassword} className="hover:underline">Forgot password?</button>
              </div>

              {message && <div className="mt-3 text-sm text-center text-slate-700">{message}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
