import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import AuthLeftPanel from './AuthLeftPanel'

export default function SignupPage({ onNavigateLogin }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPw, setShowPw]       = useState(false)
  const [agreed, setAgreed]       = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Auth integration goes here
  }

  const inputStyle = {
    border: '1px solid #E2E8F0',
    color: '#1E2B4A',
  }

  const focusStyle  = (e) => e.target.style.borderColor = '#2563EB'
  const blurStyle   = (e) => e.target.style.borderColor = '#E2E8F0'

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthLeftPanel
        headline="Embark on Website Excellence"
        subtext="Join us to unlock a world of website audits, turning potential challenges into opportunities for growth"
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

          <h1 className="text-2xl font-bold mb-1 text-center" style={{ color: '#1E2B4A' }}>
            Start your 3 day free trial
          </h1>
          <p className="text-sm text-center mb-7" style={{ color: '#64748B' }}>
            Free for 3 days, then $59/Month. Cancel anytime.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First + Last name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium" style={{ color: '#1E2B4A' }}>
                  First name<span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  required
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                  style={inputStyle}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium" style={{ color: '#1E2B4A' }}>
                  Last name<span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  required
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                  style={inputStyle}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: '#1E2B4A' }}>
                Business email<span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: '#1E2B4A' }}>
                Password<span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3 pr-11 rounded-lg text-sm outline-none"
                  style={inputStyle}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
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
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 shrink-0"
              />
              <span className="text-xs leading-relaxed" style={{ color: '#64748B' }}>
                I agree to the{' '}
                <span className="font-semibold underline cursor-pointer" style={{ color: '#2563EB' }}>Terms and Conditions</span>
                {' '}&amp;{' '}
                <span className="font-semibold underline cursor-pointer" style={{ color: '#2563EB' }}>Privacy Policy</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={!agreed}
              className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#2563EB' }}
            >
              Get Started
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }} />
            <span className="text-xs" style={{ color: '#94A3B8' }}>OR</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }} />
          </div>

          <button
            type="button"
            className="w-full py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:bg-gray-50"
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
            Already have an account?{' '}
            <button onClick={onNavigateLogin} className="font-semibold" style={{ color: '#2563EB' }}>
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
