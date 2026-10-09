import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  Server,
  ShieldCheck,
  HardDrive,
  FileCode,
  ExternalLink,
  Table,
  ArrowRight,
  X,
} from 'lucide-react';
import { ApiService } from '../../services/apiService';

interface DatabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseStatusModal: React.FC<DatabaseStatusModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [statusData, setStatusData] = useState<{
    configured: boolean;
    connected: boolean;
    mode: string;
    status: string;
    message: string;
    maskedUrl?: string | null;
    hasKey?: boolean;
    envFileExists?: boolean;
    diagnostics?: {
      envFileDetected: boolean;
      urlConfigured: boolean;
      keyConfigured: boolean;
      inMemoryCases: number;
      inMemoryEvidence: number;
      inMemoryAuditLogs: number;
      inMemoryUsers: number;
    };
    tables?: {
      users: boolean;
      cases: boolean;
      evidence: boolean;
      modification_requests: boolean;
      audit_logs: boolean;
      storageBucket: boolean;
    };
    counts?: {
      cases: number;
      evidence: number;
      auditLogs: number;
      users: number;
    };
    errors?: string[];
  } | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setSyncSuccess(null);
    try {
      const res = await ApiService.getSupabaseStatus();
      setStatusData(res);
    } catch (err: any) {
      console.error('Failed to load database status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const handleCopySql = async () => {
    try {
      const sql = await ApiService.getSupabaseSchemaSql();
      await navigator.clipboard.writeText(sql);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleCopyEnvSnippet = () => {
    const snippet = `SUPABASE_URL=https://your-project-ref.supabase.co\nSUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here`;
    navigator.clipboard.writeText(snippet);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  const handleSyncBaseline = async () => {
    setSyncing(true);
    setSyncSuccess(null);
    try {
      const res = await ApiService.syncSupabaseBaseline();
      setSyncSuccess(res.message);
      await fetchStatus();
    } catch (err: any) {
      setSyncSuccess(`Sync error: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  if (!isOpen) return null;

  const isConnected = Boolean(statusData?.connected);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${
              isConnected
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
                : 'bg-amber-950/80 border-amber-500/50 text-amber-400'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <span>Supabase Database Connection Diagnostics</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isConnected
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                    : 'bg-amber-950 text-amber-300 border-amber-600'
                }`}>
                  {isConnected ? 'ONLINE · POSTGRESQL' : 'STANDBY · IN-MEMORY'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                PostgreSQL persistence, tamper-evident audit ledger, and secure evidence storage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Main Status Hero */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            isConnected
              ? 'bg-emerald-950/30 border-emerald-500/40'
              : 'bg-amber-950/30 border-amber-500/40'
          }`}>
            <div className="flex items-start gap-3">
              {isConnected ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-semibold text-white flex items-center gap-2">
                  <span>{isConnected ? 'Connected to Supabase PostgreSQL' : 'Supabase Not Configured (Operating in Memory)'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {statusData?.message || (loading ? 'Inspecting database connectivity...' : 'Status unknown.')}
                </p>
              </div>
            </div>

            <button
              onClick={fetchStatus}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-600 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Run Diagnostic</span>
            </button>
          </div>

          {/* Diagnostic Metrics Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500">SUPABASE_URL</span>
              <div className="text-xs font-mono font-semibold flex items-center gap-1.5">
                {statusData?.diagnostics?.urlConfigured ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-emerald-300 truncate">{statusData.maskedUrl || 'Configured'}</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-slate-600" />
                    <span className="text-slate-400">Missing</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500">SERVICE ROLE KEY</span>
              <div className="text-xs font-mono font-semibold flex items-center gap-1.5">
                {statusData?.diagnostics?.keyConfigured ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-emerald-300">Active</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-slate-600" />
                    <span className="text-slate-400">Missing</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500">STORAGE BUCKET</span>
              <div className="text-xs font-mono font-semibold flex items-center gap-1.5">
                {statusData?.tables?.storageBucket ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-emerald-300">evidence-images</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-slate-600" />
                    <span className="text-slate-400">Local Cache</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500">ACTIVE STORAGE MODE</span>
              <div className="text-xs font-mono font-semibold flex items-center gap-1.5 text-cyan-400">
                <HardDrive className="w-3.5 h-3.5" />
                <span>{statusData?.mode || 'STANDBY'}</span>
              </div>
            </div>
          </div>

          {/* Database Tables Verification */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase">
                <Table className="w-4 h-4" />
                <span>PostgreSQL Forensic Schema Tables</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {isConnected ? 'PostgreSQL Production Schema' : 'In-Memory Mirror Active'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">public.users</span>
                {statusData?.tables?.users || !statusData?.configured ? (
                  <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                    <Check className="w-3 h-3" /> Ready
                  </span>
                ) : (
                  <span className="text-rose-400 text-[10px]">Missing</span>
                )}
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">public.cases</span>
                {statusData?.tables?.cases || !statusData?.configured ? (
                  <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                    <Check className="w-3 h-3" /> Ready
                  </span>
                ) : (
                  <span className="text-rose-400 text-[10px]">Missing</span>
                )}
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">public.evidence</span>
                {statusData?.tables?.evidence || !statusData?.configured ? (
                  <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                    <Check className="w-3 h-3" /> Ready
                  </span>
                ) : (
                  <span className="text-rose-400 text-[10px]">Missing</span>
                )}
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">public.modification_requests</span>
                {statusData?.tables?.modification_requests || !statusData?.configured ? (
                  <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                    <Check className="w-3 h-3" /> Ready
                  </span>
                ) : (
                  <span className="text-rose-400 text-[10px]">Missing</span>
                )}
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">public.audit_logs</span>
                {statusData?.tables?.audit_logs || !statusData?.configured ? (
                  <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                    <Check className="w-3 h-3" /> Ready
                  </span>
                ) : (
                  <span className="text-rose-400 text-[10px]">Missing</span>
                )}
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">storage: evidence-images</span>
                {statusData?.tables?.storageBucket || !statusData?.configured ? (
                  <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                    <Check className="w-3 h-3" /> Ready
                  </span>
                ) : (
                  <span className="text-amber-400 text-[10px]">Optional</span>
                )}
              </div>
            </div>
          </div>

          {/* Sync / Connected action */}
          {isConnected && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <div className="font-semibold text-emerald-300 text-xs font-mono">
                  PostgreSQL Real-Time Synchronizer
                </div>
                <div className="text-xs text-slate-300">
                  Ensure all baseline law enforcement accounts, sample cases, and cryptographic chain blocks are seeded.
                </div>
              </div>
              <button
                onClick={handleSyncBaseline}
                disabled={syncing}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-medium cursor-pointer transition-colors disabled:opacity-50"
              >
                {syncing ? 'Syncing...' : 'Sync Data Now'}
              </button>
            </div>
          )}

          {syncSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-500/50 text-xs font-mono text-emerald-300">
              {syncSuccess}
            </div>
          )}

          {/* Setup Walkthrough Guide */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase text-cyan-400 flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                <span>How to Connect Your Supabase Database</span>
              </span>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-cyan-300 border border-slate-600 transition-colors cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'SQL Copied!' : 'Copy schema.sql'}</span>
              </button>
            </div>

            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>
                <strong className="text-white">Create a Supabase Project:</strong> Sign in at{' '}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 underline inline-flex items-center gap-0.5"
                >
                  supabase.com <ExternalLink className="w-3 h-3 inline" />
                </a>{' '}
                and create a new project.
              </li>
              <li>
                <strong className="text-white">Run Schema Migration:</strong> Open the{' '}
                <span className="text-cyan-300 font-mono">SQL Editor</span> in your Supabase dashboard and run the schema file{' '}
                <code className="text-cyan-400 font-mono bg-slate-900 px-1 py-0.5 rounded">supabase/schema.sql</code> (or click the Copy button above).
              </li>
              <li>
                <strong className="text-white">Configure Environment Variables:</strong> Set your project credentials in your{' '}
                <code className="text-cyan-400 font-mono bg-slate-900 px-1 py-0.5 rounded">.env</code> file:
                <div className="mt-1.5 relative p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-cyan-300">
                  <pre className="overflow-x-auto whitespace-pre">
{`SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here`}
                  </pre>
                  <button
                    onClick={handleCopyEnvSnippet}
                    className="absolute top-2 right-2 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                    title="Copy environment snippet"
                  >
                    {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </li>
              <li>
                <strong className="text-white">Live Reload:</strong> The system automatically detects newly saved credentials and initiates live PostgreSQL sync without losing any chain-of-custody logs.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Digital Evidence Guardian Enterprise Core</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
