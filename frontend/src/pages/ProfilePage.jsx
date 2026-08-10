import React from 'react';
import { User, Shield, Radio, Settings, Sliders, Cpu, Save } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export const ProfilePage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <Badge variant="outline" size="sm" className="mb-2">PIT WALL OPERATOR</Badge>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase font-sans">
            Race Engineer Profile
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Manage audio stream channels, driver calibration thresholds, and telemetry preferences
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="white" size="md">CHIEF RACE ENGINEER</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Identity Details Card */}
        <Card className="border-zinc-800 bg-zinc-950/60 md:col-span-1 space-y-4">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white mb-3">
              <User className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">GP Lambiase</h3>
            <p className="text-xs text-zinc-500 font-mono">Apex Racing Engineering</p>
            <div className="mt-3">
              <Badge variant="neutral" size="sm">CAR #1 CONSOLE</Badge>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 font-mono text-xs space-y-2 text-zinc-400">
            <div className="flex justify-between">
              <span>ASSIGNED DRIVER:</span>
              <span className="text-white font-semibold">M. Verstappen</span>
            </div>
            <div className="flex justify-between">
              <span>CALL SIGN:</span>
              <span className="text-white font-semibold">APEX-ENG-01</span>
            </div>
            <div className="flex justify-between">
              <span>CLEARANCE:</span>
              <span className="text-emerald-400">LEVEL 4 (PIT WALL)</span>
            </div>
          </div>
        </Card>

        {/* Telemetry & Audio Settings Card */}
        <Card
          title="Telemetry & Audio Preferences"
          subtitle="Acoustic threshold calibration"
          className="border-zinc-800 bg-zinc-950/60 md:col-span-2 space-y-4"
        >
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 rounded bg-zinc-900/40 border border-zinc-800 space-y-2">
              <div className="flex justify-between text-zinc-300">
                <span>Driver Stress Sensitivity Threshold</span>
                <span className="text-white font-bold">75%</span>
              </div>
              <p className="text-[11px] text-zinc-500 font-sans">
                Alerts pit wall when voice pitch jitter or speech cadence deviates significantly from baseline.
              </p>
            </div>

            <div className="p-3 rounded bg-zinc-900/40 border border-zinc-800 space-y-2">
              <div className="flex justify-between text-zinc-300">
                <span>Radio Brevity Automation</span>
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>
              <p className="text-[11px] text-zinc-500 font-sans">
                Automatically blocks non-essential pit comms when vehicle telemetry enters high-G braking zones.
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <Button variant="primary" size="md" className="font-mono gap-2" onClick={() => alert('Settings saved')}>
                <Save className="w-3.5 h-3.5" /> SAVE PREFERENCES
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
