import React, { useState } from 'react';
import {
  User,
  Save,
  Moon,
  Sun,
  Monitor,
  Check,
  Bell,
  Sliders,
  Flag,
  Radio,
  Volume2,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user } = useAuth();

  const [stressThreshold, setStressThreshold] = useState(75);
  const [radioBrevity, setRadioBrevity] = useState(true);
  const [speedUnits, setSpeedUnits] = useState('kmh');
  const [tempUnits, setTempUnits] = useState('c');

  // Notification toggles
  const [audioBeeps, setAudioBeeps] = useState(true);
  const [pitPopups, setPitPopups] = useState(true);
  const [desktopNotifs, setDesktopNotifs] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      
      {/* Section Header */}
      <SectionHeader
        title="Engineer & Pit Wall Settings"
        subtitle="Operator credentials, driver calibration thresholds, notification preferences and theme appearance"
        badge={<Badge variant="neutral">{user?.role || 'Chief Race Engineer'}</Badge>}
        actions={
          <Button variant="primary" size="sm" className="gap-2" onClick={handleSave}>
            {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {savedSuccess ? 'Settings Saved' : 'Save Configuration'}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Team & Driver Profile Info */}
        <div className="space-y-6">
          
          {/* Operator Identity Card */}
          <Card className="text-center">
            <div className="flex flex-col items-center p-2">
              <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white mb-3 shadow-2xs font-semibold text-sm">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'GP'}
              </div>
              <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
                {user?.name || 'GP Lambiase'}
              </h3>
              <p className="text-xs text-zinc-500">{user?.role || 'Chief Race Engineer'}</p>
              <div className="mt-2.5">
                <StatusBadge status="live" size="sm">Console Online</StatusBadge>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-xs space-y-2 text-left text-zinc-500">
              <div className="flex justify-between">
                <span>Assigned Car:</span>
                <span className="font-medium text-zinc-950 dark:text-white">{user?.driverAssigned || 'Max Verstappen (#1)'}</span>
              </div>
              <div className="flex justify-between">
                <span>Radio Call Sign:</span>
                <span className="font-medium text-zinc-950 dark:text-white">{user?.callSign || 'APEX-ENG-01'}</span>
              </div>
              <div className="flex justify-between">
                <span>Official Email:</span>
                <span className="font-medium text-zinc-950 dark:text-white truncate max-w-[150px]">{user?.email || 'gp.lambiase@apexracing.com'}</span>
              </div>
            </div>
          </Card>

          {/* Team Information Card */}
          <Card
            title="Team Information"
            subtitle="Constructor & Powertrain Specs"
            className="text-xs"
          >
            <div className="space-y-2.5 text-zinc-500">
              <div className="flex justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
                <span>Team:</span>
                <span className="font-medium text-zinc-950 dark:text-white">{user?.team || 'Apex Racing Engineering'}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
                <span>Base:</span>
                <span className="font-medium text-zinc-950 dark:text-white">Silverstone, UK</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
                <span>Chassis:</span>
                <span className="font-medium text-zinc-950 dark:text-white">AR-26 Hybrid</span>
              </div>
              <div className="flex justify-between">
                <span>Power Unit:</span>
                <span className="font-medium text-zinc-950 dark:text-white">Apex V6 Turbo-Hybrid</span>
              </div>
            </div>
          </Card>

        </div>

        {/* Right Column (2 Cols): Preferences, Notifications & Theme */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Theme Preference Section */}
          <Card
            title="Theme & Appearance"
            subtitle="Choose between minimal dark mode, crisp light mode, or system automatic"
            badge={<Badge variant="outline" size="sm">Active: {resolvedTheme.charAt(0).toUpperCase() + resolvedTheme.slice(1)}</Badge>}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Dark Option */}
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-lg border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-zinc-950 bg-zinc-50 dark:border-white dark:bg-zinc-900 ring-2 ring-zinc-950 dark:ring-white shadow-xs'
                    : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Moon className="w-5 h-5 text-zinc-900 dark:text-white" />
                  {theme === 'dark' && <Badge variant="white" size="sm">Selected</Badge>}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-zinc-950 dark:text-white">Dark Mode</h4>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">High-contrast black pit wall telemetry</p>
                </div>
              </button>

              {/* Light Option */}
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded-lg border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-zinc-950 bg-zinc-50 dark:border-white dark:bg-zinc-900 ring-2 ring-zinc-950 dark:ring-white shadow-xs'
                    : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Sun className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
                  {theme === 'light' && <Badge variant="white" size="sm">Selected</Badge>}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-zinc-950 dark:text-white">Light Mode</h4>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">Clean crisp white technical layout</p>
                </div>
              </button>

              {/* System Option */}
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-4 rounded-lg border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                  theme === 'system'
                    ? 'border-zinc-950 bg-zinc-50 dark:border-white dark:bg-zinc-900 ring-2 ring-zinc-950 dark:ring-white shadow-xs'
                    : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Monitor className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  {theme === 'system' && <Badge variant="white" size="sm">Selected</Badge>}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-zinc-950 dark:text-white">System Sync</h4>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">Follows your OS appearance</p>
                </div>
              </button>

            </div>
          </Card>

          {/* Acoustic & Race Preferences */}
          <Card
            title="Acoustic & Race Preferences"
            subtitle="Fine-tune machine learning stress sensitivity and automated suppression"
          >
            <div className="space-y-5 text-xs">
              
              {/* Stress Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                    Driver Stress Alert Trigger Threshold:
                  </span>
                  <span className="font-semibold text-zinc-950 dark:text-white text-sm font-tabular">
                    {stressThreshold}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={stressThreshold}
                  onChange={(e) => setStressThreshold(Number(e.target.value))}
                  className="w-full accent-zinc-900 dark:accent-white cursor-pointer"
                />
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Alerts pit wall when vocal pitch jitter or speech cadence exceeds {stressThreshold}% above driver baseline.
                </p>
              </div>

              {/* Radio Brevity Toggle */}
              <div className="p-4 rounded-lg bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-medium text-zinc-950 dark:text-white block">
                    Automated Radio Brevity Mode
                  </span>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Blocks non-essential engineer comms when telemetry indicates braking above 4.5G.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRadioBrevity(!radioBrevity)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    radioBrevity
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {radioBrevity ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Units Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                <div>
                  <label className="block text-zinc-500 text-xs mb-1.5 font-medium">
                    Speed Units
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant={speedUnits === 'kmh' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSpeedUnits('kmh')}
                    >
                      KM/H (Metric)
                    </Button>
                    <Button
                      variant={speedUnits === 'mph' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSpeedUnits('mph')}
                    >
                      MPH (Imperial)
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-500 text-xs mb-1.5 font-medium">
                    Temperature Units
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant={tempUnits === 'c' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setTempUnits('c')}
                    >
                      °C (Celsius)
                    </Button>
                    <Button
                      variant={tempUnits === 'f' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setTempUnits('f')}
                    >
                      °F (Fahrenheit)
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          </Card>

          {/* Notification Settings Card */}
          <Card
            title="Pit Wall Notification Settings"
            subtitle="Alert audio beeps, strategy popups and broadcast channels"
          >
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-900/20">
                <div>
                  <span className="font-medium text-zinc-950 dark:text-white block">Critical Audio Alert Beeps</span>
                  <p className="text-zinc-500 text-[11px]">Play audible tone when driver stress exceeds 75%.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAudioBeeps(!audioBeeps)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    audioBeeps
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {audioBeeps ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-900/20">
                <div>
                  <span className="font-medium text-zinc-950 dark:text-white block">Pit Window HUD Popups</span>
                  <p className="text-zinc-500 text-[11px]">Display high-priority banner when undercut window opens.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPitPopups(!pitPopups)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    pitPopups
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {pitPopups ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-900/20">
                <div>
                  <span className="font-medium text-zinc-950 dark:text-white block">Browser Desktop Notifications</span>
                  <p className="text-zinc-500 text-[11px]">Push alerts to desktop even when console tab is in background.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDesktopNotifs(!desktopNotifs)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    desktopNotifs
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {desktopNotifs ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
