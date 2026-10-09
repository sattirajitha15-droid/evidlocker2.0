import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  FileCheck2,
  Database,
  History,
  AlertTriangle,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  HardDrive,
  Table,
} from 'lucide-react';
import { ApiService } from '../services/apiService';

export const SecurityView: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [loadingDb, setLoadingDb] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const checkDb = async () => {
    setLoadingDb(true);
    try {
      const res = await ApiService.getSupabaseStatus();
      setDbStatus(res);
    } catch (err) {
      console.error('Failed to query db status:', err);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    checkDb();
  }, []);

  const handleCopySql = async () => {
    try {
      const sql = await ApiService.getSupabaseSchemaSql();
      await navigator.clipboard.writeText(sql);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    } catch {
      // ignore
    }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <span>Security Architecture & Cryptographic Specifications</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Formal delineation of Authentication, Authorization, Cryptographic Data Fingerprinting, and Immutable Audit Trails.
          </p>
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-white">
            Security Guarantee Disclosure Policy
          </div>
          <p className="text-slate-400 leading-relaxed">
            In compliance with forensic integrity principles, this system does not claim unverified end-to-end encryption guarantees. Instead, it implements verifiable cryptographic SHA-256 data fingerprinting, role-based boundary enforcement, and blockchain-style audit chaining across every evidence transition.
          </p>
        </div>
      </div>

      {/* Supabase Database Connection & Architecture Status Panel */}
      <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              dbStatus?.connected
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
                : 'bg-amber-950/80 border-amber-500/50 text-amber-400'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <span>Supabase PostgreSQL Database Connection Center</span>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${
                  dbStatus?.connected
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                    : 'bg-amber-950 text-amber-300 border-amber-500/50'
                }`}>
                  {dbStatus?.connected ? 'CONNECTED (POSTGRESQL)' : 'STANDBY (IN-MEMORY)'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Live database connectivity, forensic schema verification, and persistent chain of custody.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={checkDb}
              disabled={loadingDb}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingDb ? 'animate-spin' : ''}`} />
              <span>{loadingDb ? 'Checking...' : 'Check Connection'}</span>
            </button>
            <button
              onClick={handleCopySql}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-xs font-mono text-cyan-300 border border-cyan-700/60 transition-colors cursor-pointer"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copied!' : 'Copy SQL Schema'}</span>
            </button>
          </div>
        </div>

        {/* Current Connection Diagnostic Box */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          dbStatus?.connected
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
        }`}>
          {dbStatus?.connected ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1 text-xs">
            <div className="font-semibold text-white">
              {dbStatus?.connected
                ? `Supabase Online: Synchronized to ${dbStatus?.maskedUrl || 'Remote Database'}`
                : 'Supabase Offline: Operating in Zero-Downtime In-Memory Mode'}
            </div>
            <p className="text-slate-300 leading-relaxed">
              {dbStatus?.message || 'Analyzing Supabase database connection and environment variables...'}
            </p>
          </div>
        </div>

        {/* Diagnostic Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono uppercase text-slate-500">SUPABASE_URL</div>
            <div className="font-mono font-medium flex items-center gap-1.5">
              {dbStatus?.diagnostics?.urlConfigured ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-emerald-300 truncate">{dbStatus?.maskedUrl || 'Configured'}</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-600" />
                  <span className="text-slate-400">Not Set</span>
                </>
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono uppercase text-slate-500">SERVICE ROLE KEY</div>
            <div className="font-mono font-medium flex items-center gap-1.5">
              {dbStatus?.diagnostics?.keyConfigured ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-emerald-300">Configured</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-600" />
                  <span className="text-slate-400">Not Set</span>
                </>
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono uppercase text-slate-500">DATABASE STATUS</div>
            <div className="font-mono font-medium text-cyan-400 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5" />
              <span>{dbStatus?.mode || 'STANDBY'}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono uppercase text-slate-500">IN-MEMORY MIRROR</div>
            <div className="font-mono font-medium text-slate-300">
              {dbStatus?.diagnostics?.inMemoryCases ?? 3} Cases · {dbStatus?.diagnostics?.inMemoryEvidence ?? 4} Items
            </div>
          </div>
        </div>

        {/* Quick Connection Instructions Guide */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="text-xs font-mono text-cyan-400 font-semibold uppercase flex items-center gap-2">
            <span>To Connect With A Supabase Database:</span>
          </div>
          <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
            <li>
              Log in to your Supabase project dashboard at{' '}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 underline inline-flex items-center gap-0.5"
              >
                supabase.com <ExternalLink className="w-3 h-3 inline" />
              </a>.
            </li>
            <li>
              Copy your <strong className="text-white">Project URL</strong> and <strong className="text-white">service_role key</strong> into your server environment or <code className="text-cyan-400 font-mono bg-slate-900 px-1 py-0.5 rounded">.env</code> file (<code className="text-cyan-400 font-mono">SUPABASE_URL</code> and <code className="text-cyan-400 font-mono">SUPABASE_SERVICE_ROLE_KEY</code>).
            </li>
            <li>
              Run the forensic SQL migration script (<code className="text-cyan-400 font-mono">supabase/schema.sql</code>) in the Supabase SQL Editor.
            </li>
            <li>
              Click <strong className="text-white">&quot;Check Connection&quot;</strong> above. The system automatically verifies PostgreSQL tables and activates live database persistence.
            </li>
          </ol>
        </div>
      </div>

      {/* 4 Pillars Separation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pillar 1: Authentication */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <KeyRound className="w-4 h-4" />
            <span>1. Authentication (Identity Verification)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every action requires an active authenticated session tied to a verified officer identity, badge number, and division.
          </p>
          <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc list-inside">
            <li>Session bound to unique law enforcement credentials</li>
            <li>No anonymous evidence registration or viewing allowed</li>
            <li>Multi-role switching provided for rapid operational delegation</li>
          </ul>
        </div>

        {/* Pillar 2: Authorization (RBAC) */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>2. Authorization (Granular RBAC)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Strict separation of duties enforced at the service layer.
          </p>
          <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc list-inside">
            <li><strong>Field Officer:</strong> First responder; registers evidence, cannot directly overwrite.</li>
            <li><strong>Investigator:</strong> Tracks chain of custody movement across crime labs.</li>
            <li><strong>Higher Official:</strong> Sole authorization to approve or reject record modifications.</li>
            <li><strong>Administrator:</strong> Security policy, personnel management, audit authority.</li>
          </ul>
        </div>

        {/* Pillar 3: Cryptographic Integrity & File Fingerprinting */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Fingerprint className="w-4 h-4" />
            <span>3. Cryptographic Fingerprinting (SHA-256)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Real W3C Web Cryptography API computes deterministic SHA-256 digests.
          </p>
          <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc list-inside">
            <li>Physical evidence photos and binaries hashed upon selection</li>
            <li>Evidence record fields combined into cryptographic composite digest</li>
            <li>Any unauthorized alteration produces an immediate checksum mismatch</li>
          </ul>
        </div>

        {/* Pillar 4: Tamper-Evident Chained Audit Logging */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            <History className="w-4 h-4" />
            <span>4. Chained Audit Ledger (Tamper-Evident)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every ledger block mathematically incorporates the previous block&apos;s SHA-256 hash.
          </p>
          <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc list-inside">
            <li>Previous hash linking: <code className="text-cyan-400 font-mono">H_n = SHA256(H_n-1 + Data)</code></li>
            <li>Inserting, deleting, or editing any historical block breaks all subsequent links</li>
            <li>Built-in ledger audit tool mathematically verifies whole chain in milliseconds</li>
          </ul>
        </div>
      </div>

      {/* Modification Governance Protocol */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="font-semibold text-sm text-white flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-cyan-400" />
          <span>Non-Silent Modification Protocol (Zero Overwrite Policy)</span>
        </h3>

        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
          <div className="text-slate-400">
            [Field Officer Requests Correction] → [System Locks Request & Records Reason]
          </div>
          <div className="text-cyan-400 pl-4">
            ↓ Dual-Control Approval Required
          </div>
          <div className="text-slate-400">
            [Higher Official Evaluates Original vs Requested Diff]
          </div>
          <div className="text-emerald-400 pl-4">
            ├─ [IF APPROVED] → Advances Version to v2.0, preserves original entry in audit history
          </div>
          <div className="text-rose-400 pl-4">
            └─ [IF REJECTED] → Record remains unchanged, rejection reason logged
          </div>
        </div>
      </div>

      {/* System Version & Architecture Changelog */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm text-white font-mono">
              System Release Specification: v2.5.0-ENTERPRISE
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600">
            PRODUCTION READY
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
            <div className="font-bold text-cyan-400 font-mono">Recharts Forensic Bottleneck Radar</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Real-time interactive distribution across all 7 custody lifecycle stages. Automated detection of pipeline bottlenecks with one-click table filtering.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
            <div className="font-bold text-cyan-400 font-mono">Creative Forensic Matrix HUD</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Tactical crime-scene coordinate grid, ultraviolet laser scanner, reticle crosshairs, and multi-atmosphere ambient presets (Forensic Grid, Cyber Enclave, UV Lab, Tactical HUD).
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
            <div className="font-bold text-cyan-400 font-mono">Biometric Fingerprint Hardware Enclave</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              WebAuthn cryptographic challenge-response protocol. Generates tamper-proof SHA-256 minutiae proofs for evidence intake, custody transfers, and supervisory approvals.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
            <div className="font-bold text-cyan-400 font-mono">Gemini AI Crime-Scene Reconstruction</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Temporal synthesis engine correlating physical evidence discovery timestamps with perimeter breach dynamics, audit chain events, and judicial court admissibility ratings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
