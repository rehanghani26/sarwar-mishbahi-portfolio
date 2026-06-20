import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertTriangle, ArrowLeft } from 'lucide-react';
import { login, clearAuthError } from '../../../store/slices/authSlice';
import { Input } from '../../../components/Input';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    dispatch(clearAuthError());
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    dispatch(login({ username, password }));
  };

  return (
    <div className="bg-[#FAF9F5] dark:bg-slate-900 min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* logo and header banner */}
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-full bg-[#2F241C] dark:bg-emerald-900 items-center justify-center text-[#8A6F52] dark:text-[#EAD075] shadow-md mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#2F241C] dark:text-emerald-400 font-serif uppercase tracking-wider">
            Admin Access Portal
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Single administrator dashboard authentication</p>
        </div>

        {/* Login form card */}
        <div className="premium-card p-8">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error banner */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-4 flex items-start gap-2 text-red-700 dark:text-red-400 text-xs shrink-0">
                <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Username</label>
              <div className="relative">
                <Input
                  type="text"
                  required
                  placeholder="Enter administrator username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  inputClassName="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-[#EAE3CF] dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded outline-none focus:border-[#8A6F52] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  border=""
                />
                <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Password</label>
              <div className="relative">
                <Input
                  type="password"
                  required
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  inputClassName="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-[#EAE3CF] dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded outline-none focus:border-[#8A6F52] dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  border=""
                />
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
              </div>
            </div>

            {/* Sign in Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#2F241C] hover:bg-[#1E1915] dark:bg-emerald-800 dark:hover:bg-emerald-700 text-white font-bold rounded shadow-sm transition-all uppercase tracking-wider font-serif text-sm disabled:opacity-50"
              >
                {loading ? 'Authenticating Admin...' : 'Sign In'}
              </button>
            </div>

          </form>

        </div>

        {/* Back to Homepage */}
        <div className="text-center">
          <a href="/" className="inline-flex items-center gap-1 text-xs font-bold text-[#2F241C] dark:text-emerald-400 hover:text-[#8A6F52] dark:hover:text-[#EAD075] transition-all">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Visitor Portal
          </a>
        </div>

      </div>

    </div>
  );
}
