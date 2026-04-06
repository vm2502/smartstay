import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let user;
      if (isLogin) {
        user = await login(email, password);
      } else {
        user = await signup(name, email, password, role);
      }
      navigate(user.role === 'admin' ? '/admin' : '/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f9ff] font-['Inter'] text-[#121c2a] antialiased overflow-hidden">
      <main className="flex min-h-screen">
        {/* Left Side: Hero */}
        <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#eff4ff]">
          <div className="absolute inset-0 z-0">
            <div className="h-full w-full bg-gradient-to-br from-blue-600 to-blue-800"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
          </div>
          <div className="relative z-10 flex flex-col justify-between p-16 w-full h-full text-white">
            <div>
              <h1 className="text-4xl font-black tracking-tight" style={{ letterSpacing: '-0.02em' }}>SmartStay</h1>
              <p className="text-lg opacity-90 mt-2 font-medium">Digital Concierge</p>
            </div>
            <div className="max-w-md">
              <h2 className="text-5xl font-bold leading-tight mb-6">Redefining the modern living experience.</h2>
              <p className="text-xl opacity-80 leading-relaxed">Join a community built on seamless management and premium comfort. Your stay, elevated.</p>
            </div>
            <div className="flex items-center gap-4 text-sm font-semibold tracking-wider">
              <span className="w-12 h-[2px] bg-white opacity-50"></span>
              <span>ESTABLISHED 2024</span>
            </div>
          </div>
        </section>

        {/* Right Side: Login Form */}
        <section className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#f8f9ff]">
          <div className="w-full max-w-md space-y-10">
            {/* Mobile branding */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-3xl font-black text-blue-600" style={{ letterSpacing: '-0.02em' }}>SmartStay</h1>
              <p className="text-sm text-[#424754] font-semibold tracking-widest uppercase mt-1">Digital Concierge</p>
            </div>

            <header>
              <h3 className="text-3xl font-bold text-[#121c2a] tracking-tight mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="text-[#424754]">
                {isLogin ? 'Access your digital concierge dashboard below.' : 'Register for your SmartStay account.'}
              </p>
            </header>

            <div className="space-y-8">
              {/* Role Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#eff4ff] rounded-xl">
                <button
                  onClick={() => setRole('student')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-200 ${
                    role === 'student' ? 'bg-white shadow-sm text-blue-600' : 'text-[#424754] hover:text-[#121c2a]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">school</span>
                  Student
                </button>
                <button
                  onClick={() => setRole('admin')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-200 ${
                    role === 'admin' ? 'bg-white shadow-sm text-blue-600' : 'text-[#424754] hover:text-[#121c2a]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                  Admin
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#424754] ml-1" htmlFor="name">
                        Full Name
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#424754] group-focus-within:text-blue-600 transition-colors">
                          <span className="material-symbols-outlined">person</span>
                        </div>
                        <input
                          className="w-full pl-12 pr-4 py-4 bg-[#d9e3f6] border-none rounded-2xl text-[#121c2a] placeholder:text-[#727785] focus:ring-2 focus:ring-blue-600/40 transition-all outline-none"
                          id="name"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#424754] ml-1" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#424754] group-focus-within:text-blue-600 transition-colors">
                        <span className="material-symbols-outlined">mail</span>
                      </div>
                      <input
                        className="w-full pl-12 pr-4 py-4 bg-[#d9e3f6] border-none rounded-2xl text-[#121c2a] placeholder:text-[#727785] focus:ring-2 focus:ring-blue-600/40 transition-all outline-none"
                        id="email"
                        type="email"
                        placeholder="alex.hall@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#424754]" htmlFor="password">
                        Password
                      </label>
                      {isLogin && <a className="text-xs font-bold text-blue-600 hover:underline" href="#">Forgot?</a>}
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#424754] group-focus-within:text-blue-600 transition-colors">
                        <span className="material-symbols-outlined">lock</span>
                      </div>
                      <input
                        className="w-full pl-12 pr-12 py-4 bg-[#d9e3f6] border-none rounded-2xl text-[#121c2a] placeholder:text-[#727785] focus:ring-2 focus:ring-blue-600/40 transition-all outline-none"
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        className="absolute inset-y-0 right-4 flex items-center text-[#424754] hover:text-blue-600 transition-colors"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  className="w-full py-4 bg-gradient-to-r from-[#0058be] to-[#2170e4] text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Please wait...' : (isLogin ? 'Sign In to Portal' : 'Create Account')}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </form>

              <footer className="text-center">
                <p className="text-sm text-[#424754]">
                  {isLogin ? "New to SmartStay? " : "Already have an account? "}
                  <button
                    className="text-blue-600 font-bold hover:underline ml-1"
                    onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  >
                    {isLogin ? 'Create Account' : 'Sign In'}
                  </button>
                </p>
              </footer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
