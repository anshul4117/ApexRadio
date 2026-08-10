import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, User, Flag, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    team: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Team registration is not yet connected in this foundation build.');
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="text-center mb-8 space-y-2">
        <Badge variant="outline" size="sm">NEW TEAM ENROLLMENT</Badge>
        <h1 className="text-2xl font-bold tracking-tight text-white uppercase font-sans">
          Register Pit Wall Team
        </h1>
        <p className="text-xs text-zinc-400 font-mono">
          Create an account for telemetry and driver radio analysis
        </p>
      </div>

      <Card className="border-zinc-800 bg-zinc-950/80 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5 uppercase">
              Full Name / Call Sign
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="GP Lambiase"
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5 uppercase">
              Racing Team Name
            </label>
            <div className="relative">
              <Flag className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                placeholder="Apex Racing Team"
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5 uppercase">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="engineer@team.com"
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••••••"
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md" className="w-full font-mono gap-2">
              CREATE TEAM ACCESS <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-zinc-800 text-center font-mono text-xs text-zinc-500">
          Already registered?{' '}
          <Link to="/login" className="text-zinc-300 hover:text-white underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
