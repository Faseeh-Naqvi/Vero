import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockUsers, quickLoginChips } from '../data/mockUsers';

function destinationFor(user) {
  if (user.role === 'patient') return '/patient/dashboard';
  if (user.role === 'physician') return '/physician/dashboard';
  if (user.role === 'admin') return '/admin/dashboard';
  return '/login';
}

export default function LoginPage() {
  const { setUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const doLogin = (e, creds) => {
    if (e) e.preventDefault();
    const tryEmail = creds?.email ?? email;
    const tryPassword = creds?.password ?? password;
    const found = mockUsers.find(
      (u) => u.email.toLowerCase() === tryEmail.trim().toLowerCase() && u.password === tryPassword
    );
    if (!found) {
      setError('Invalid email or password. Try the quick-login chips below.');
      return;
    }
    setError('');
    setUser(found);
    const from = location.state?.from;
    navigate(from || destinationFor(found), { replace: true });
  };

  const quickLogin = (chip) => {
    setEmail(chip.email);
    setPassword(chip.password);
    doLogin(null, chip);
  };

  return (
    <div className="min-h-screen flex bg-surface-page">
      <div className="hidden lg:flex flex-1 bg-brand text-white items-center justify-center p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-40 -left-20 w-[480px] h-[480px] rounded-full bg-white/30" />
          <div className="absolute -bottom-32 -right-10 w-[420px] h-[420px] rounded-full bg-white/20" />
        </div>
        <div className="relative max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 2L4 8v6c0 5 4 9 8 10 4-1 8-5 8-10V8l-8-6z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <span className="text-2xl font-semibold tracking-tight">Vero</span>
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Calm, modern clinic care, orchestrated.
          </h1>
          <p className="mt-4 text-white/80 text-base leading-relaxed">
            Vero gives patients, physicians, and admins one shared place to book, confirm, and reschedule visits without the back-and-forth.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/85">
            <li className="flex items-start gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-white/80"/> 1-tap rebooking when plans change</li>
            <li className="flex items-start gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-white/80"/> Physician-friendly schedule views</li>
            <li className="flex items-start gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-white/80"/> Admin oversight across the whole clinic</li>
          </ul>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center text-white" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 2L4 8v6c0 5 4 9 8 10 4-1 8-5 8-10V8l-8-6z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <span className="text-xl font-semibold">Vero</span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-ink-primary">Sign in to your account</h2>
          <p className="text-sm text-ink-secondary mt-1">Use your clinic email to continue.</p>

          <form className="mt-7 space-y-4" onSubmit={doLogin}>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" />
                <input
                  className="input pl-9"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@clinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" />
                <input
                  className="input pl-9"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-status-red bg-red-50 border border-red-100 rounded-btn px-3 py-2">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary-lg w-full">
              Sign in <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-8">
            <div className="flex items-center gap-3">
              <div className="h-px bg-line flex-1" />
              <span className="text-xs uppercase tracking-wider text-ink-secondary">Demo accounts</span>
              <div className="h-px bg-line flex-1" />
            </div>
            <div className="mt-4 flex items-start gap-2 text-xs text-ink-secondary">
              <Zap size={13} className="text-brand mt-0.5" />
              <span>Click any chip below to log in instantly. No real auth happens; this is a prototype.</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {quickLoginChips.map((chip) => (
                <button
                  key={chip.email}
                  type="button"
                  className="chip"
                  onClick={() => quickLogin(chip)}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
