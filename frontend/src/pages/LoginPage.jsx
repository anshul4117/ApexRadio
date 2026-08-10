import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Shield } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Authentication is not yet connected in this foundation build.');
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="text-center mb-8 space-y-2">
        <Badge variant="outline" size="sm">PIT WALL ACCESS</Badge>
        <h1 className="text-2xl font-bold tracking-tight text-white uppercase font-sans">
          Race Engineer Sign In
        </h1>
        <p className="text-xs text-zinc-400 font-mono">
          Enter credentials to access telemetry consoles
        </p>
      </div>

      <Card className="border-zinc-800 bg-zinc-950/80 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5 uppercase">
              Engineer Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="race.engineer@apexradio.ai"
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5 uppercase">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md" className="w-full font-mono gap-2">
              SIGN IN TO CONSOLE <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-zinc-800 text-center font-mono text-xs text-zinc-500">
          New race engineer?{' '}
          <Link to="/register" className="text-zinc-300 hover:text-white underline underline-offset-4">
            Register team account
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
