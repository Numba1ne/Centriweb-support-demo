
import React, { useEffect, useState } from 'react';
import { SpotlightCard } from '../ui/SpotlightCard';
import { ShieldCheck, Zap, Activity, RefreshCw, Link2, AlertCircle, CheckCircle } from 'lucide-react';
import { fetchAccountMetrics, runSystemDiagnostics } from '../../services/ghl';
import { AccountMetrics } from '../../types';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export const AccountInsights: React.FC = () => {
  const [metrics, setMetrics] = useState<AccountMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAccountMetrics();
    setMetrics(data);
    setLoading(false);
  };

  const handleScan = async () => {
    setScanning(true);
    await runSystemDiagnostics();
    await loadData(); 
    setScanning(false);
  };

  if (loading || !metrics) {
    return (
      <SpotlightCard className="h-full min-h-[300px] flex items-center justify-center bg-slate-900/30 border-white/5">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-centri-500 animate-spin" />
          <span className="text-xs text-slate-500 uppercase tracking-wider">Loading Health...</span>
        </div>
      </SpotlightCard>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-emerald-400';
      case 'pending': return 'text-amber-400';
      case 'failed': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <SpotlightCard className="h-full bg-slate-900/30 border-white/5 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-centri-400" />
          <h3 className="font-bold text-white tracking-tight">System Health</h3>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400">
             <CheckCircle className="w-3 h-3" />
             <span className="text-[10px] uppercase tracking-wider font-bold">Systems Active</span>
        </div>
      </div>

      {/* Compliance & Health */}
      <div className="p-6 space-y-6">
        
        {/* A2P */}
        <div className="flex items-center justify-between group cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
           <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
              <div>
                 <div className="text-sm text-slate-300 font-medium">Carrier Compliance (A2P)</div>
                 <div className="text-[10px] text-slate-500">Required for SMS delivery</div>
              </div>
           </div>
           <span className={cn("text-[10px] font-bold uppercase tracking-wider flex items-center gap-2", getStatusColor(metrics.a2pStatus))}>
              {metrics.a2pStatus === 'verified' && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
              {metrics.a2pStatus}
           </span>
        </div>

        {/* DNS */}
        <div className="flex items-center justify-between group cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
           <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
              <div>
                 <div className="text-sm text-slate-300 font-medium">Email DNS Records</div>
                 <div className="text-[10px] text-slate-500">Required for inbox placement</div>
              </div>
           </div>
           <span className={cn("text-[10px] font-bold uppercase tracking-wider flex items-center gap-2", getStatusColor(metrics.emailDnsStatus))}>
              {metrics.emailDnsStatus === 'verified' && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
              {metrics.emailDnsStatus}
           </span>
        </div>

        {/* Active Integrations */}
        <div className="pt-2 border-t border-white/5">
           <div className="flex items-center justify-between mb-4">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Connections</span>
           </div>
           <div className="grid grid-cols-1 gap-2">
              {metrics.integrations.map(int => (
                <div key={int.id} className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors">
                   <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", int.connected ? "bg-centri-500 shadow-[0_0_5px_#0ea5e9]" : "bg-slate-700")} />
                      <span className={cn("text-xs font-medium", int.connected ? "text-slate-300" : "text-slate-500")}>{int.name}</span>
                   </div>
                   {!int.connected && <span className="text-[9px] text-red-400 border border-red-400/20 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Disconnected</span>}
                </div>
              ))}
           </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="p-4 mt-auto border-t border-white/5 bg-slate-900/50 relative overflow-hidden">
        {scanning && (
           <div className="absolute inset-0 bg-centri-500/10 z-0 animate-[scan_2s_ease-in-out_infinite]" style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.2), transparent)' }}></div>
        )}
        <Button 
          onClick={handleScan}
          disabled={scanning}
          variant="secondary" 
          size="sm" 
          className="w-full relative z-10 border-centri-500/20 hover:border-centri-500/50 hover:bg-centri-900/20 hover:text-white text-xs uppercase tracking-widest font-bold h-9"
        >
          {scanning ? (
             <>Diagnosing...</>
          ) : (
             <><RefreshCw className="w-3 h-3 mr-2 text-centri-400" /> Verify Connections</>
          )}
        </Button>
      </div>
    </SpotlightCard>
  );
};
