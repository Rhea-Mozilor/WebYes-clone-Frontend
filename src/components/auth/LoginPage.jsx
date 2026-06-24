import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import AuthLeftPanel from './AuthLeftPanel'
import { authLogin, authMe, setToken } from '@/services/api'

export default function LoginPage({ onNavigateSignup, onLoginSuccess }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { access_token } = await authLogin({ email, password })
      setToken(access_token)
      const user = await authMe()
      onLoginSuccess(access_token, user)
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthLeftPanel
        headline="Streamline Your Web Journey"
        subtext="Access your website's insights effortlessly and make data-driven decisions for online success"
      />

      {/* Right — form */}
      <div className="flex flex-col items-center justify-center px-8 py-12 bg-white min-h-screen">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <span className="text-2xl font-black tracking-tight">
              <span style={{ color: '#1E2B4A' }}>Web</span><span style={{ color: '#2563EB' }}>Yes</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-1 text-center" style={{ color: '#1E2B4A' }}>Welcome back!</h1>
          <p className="text-sm text-center mb-7" style={{ color: '#64748B' }}>Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: '#1E2B4A' }}>Business email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@businessemail.com"
                required
                className="w-full px-4 py-3 rounded-xs text-sm outline-solid transition-colors"
                style={{ border: '1px solid #E2E8F0', color: '#1E2B4A' }}
                onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: '#1E2B4A' }}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xs text-sm outline-solid transition-colors"
                  style={{ border: '1px solid #E2E8F0', color: '#1E2B4A' }}
                  onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                  onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#94A3B8' }}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right">
                <button type="button" className="text-xs font-medium" style={{ color: '#444141' }}>
                  Forgot password?
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-center" style={{ color: '#EF4444' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xs text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 mt-2"
              style={{ backgroundColor: '#2563EB' }}
            >
              {loading ? 'Signing in…' : 'Log in'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }} />
            <span className="text-xs" style={{ color: '#94A3B8' }}>OR</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }} />
          </div>

          <button
            type="button"
            className="w-full py-3 rounded-xs text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:bg-gray-50"
            style={{ border: '1px solid #E2E8F0', color: '#1E2B4A' }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm mt-6" style={{ color: '#64748B' }}>
            New to WebYes?{' '}
            <button onClick={onNavigateSignup} className="font-semibold" style={{ color: '#2563EB' }}>
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
