import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login, isAuthenticated, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to destination or dashboard
  const destination = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, destination]);

  useEffect(() => {
    clearError();
    setLocalError('');
  }, [clearError, email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email.trim()) {
      setLocalError('Please enter your email address');
      return;
    }
    if (!password) {
      setLocalError('Please enter your password');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      navigate(destination, { replace: true });
    }
  };

  const handleFillDemo = () => {
    setEmail('gp.lambiase@apexracing.com');
    setPassword('password123');
    setLocalError('');
  };

  const errorMessage = localError || authError;

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="text-center mb-8 space-y-2">
        <Badge variant="neutral" size="sm">Pit Wall Access</Badge>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          Race Engineer Sign In
        </h1>
        <p className="text-xs text-zinc-500">
          Enter credentials to access active telemetry streams
        </p>
      </div>

      <Card className="p-6">
        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-md bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Email or Radio Call Sign
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gp.lambiase@apexracing.com"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              className="w-full gap-2"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In to Console'}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </Button>

            {/* Quick Demo Credentials Fill Button */}
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2 px-3 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Fill Demo Engineer Account
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-center text-xs text-zinc-500">
          New race engineer?{' '}
          <Link to="/register" className="text-zinc-900 dark:text-white font-medium underline underline-offset-4">
            Enroll team account
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
