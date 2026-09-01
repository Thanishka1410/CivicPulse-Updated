import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { WARDS } from '../utils/categories';
import { Activity, User, Mail, Lock, Key, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('citizen'); // 'citizen' | 'admin'
  const [secretCode, setSecretCode] = useState('');
  const [assignedLocation, setAssignedLocation] = useState(WARDS[0]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (role === 'admin' && secretCode.trim() !== 'HackWarriors') {
      setError('Invalid Admin Authorization Secret Code!');
      return;
    }

    setLoading(true);

    try {
      await signup({
        name,
        email,
        password,
        role,
        secretCode,
        assignedLocation
      });

      alert(`Account created successfully as ${role.toUpperCase()}! Redirecting to login.`);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden py-10">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Activity className="w-6 h-6 text-sky-400" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create CivicPulse Account</h2>
          <p className="text-xs text-slate-400">Join crowdsourced civic governance</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Role Switcher */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Select User Role</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setRole('citizen')}
                className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                  role === 'citizen' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" /> Citizen / User
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                  role === 'admin' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Admin / Officer
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Admin Specific Fields */}
          {role === 'admin' && (
            <div className="p-3 bg-teal-950/40 border border-teal-800/60 rounded-xl space-y-3">
              <div>
                <label className="block font-semibold text-teal-300 mb-1 flex items-center justify-between">
                  <span>Secret Code (Required for Admin)</span>
                  <span className="text-[10px] text-teal-400 font-mono">Authorization Code</span>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-teal-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                    placeholder="Enter Secret Code"
                    className="w-full bg-slate-950 border border-teal-800/80 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-teal-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-teal-300 mb-1">Assigned Ward Jurisdiction</label>
                <select
                  value={assignedLocation}
                  onChange={(e) => setAssignedLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-teal-800/80 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                >
                  {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-500 hover:brightness-110 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20 transition-all"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-400 font-bold hover:underline">
            Log In
          </Link>
        </div>

      </div>
    </div>
  );
}
