import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Mail, ArrowLeft, CheckCircle2, ShieldAlert, ExternalLink } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setResultData(null);

    try {
      const data = await requestPasswordReset(email);
      setResultData(data);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-6 sm:p-8 relative border-white/10 shadow-2xl">
        <Link
          to="/auth?mode=login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </Link>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mx-auto text-orange-400 mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Secure Password Reset</h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter your registered account email to generate a SHA-256 hashed password reset token.
          </p>
        </div>

        {!resultData ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Account Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  className="glass-input pl-9 text-sm"
                  placeholder="chef@cooksy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl text-sm"
            >
              {loading ? 'Generating Token...' : 'Generate Reset Token Link'}
            </button>
          </form>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-bold text-sm">Reset Request Created!</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                A SHA-256 hashed token has been stored in MongoDB (expires in 10 minutes). Click the test link below to reset your password.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1.5">
              <span className="text-[11px] text-slate-400 font-semibold block">Generated Secure Token:</span>
              <code className="text-xs text-orange-300 break-all block font-mono bg-black/40 p-2 rounded-lg">
                {resultData.resetToken}
              </code>
            </div>

            <Link
              to={`/reset-password/${resultData.resetToken}`}
              className="btn-primary w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2"
            >
              <span>Proceed to Reset Password Page</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
