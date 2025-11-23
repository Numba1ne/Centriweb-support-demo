
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">System Interruption</h1>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">
              The interface encountered an unexpected error. This has been logged for review.
            </p>

            <div className="space-y-3">
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full bg-white text-slate-900 hover:bg-slate-200"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Reload Interface
              </Button>
              <Button 
                onClick={() => window.location.href = '/'} 
                variant="ghost" 
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" /> Return to Dashboard
              </Button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5">
                <code className="text-[10px] text-slate-600 font-mono block break-all">
                    ERR_CODE: {this.state.error?.message || 'UNKNOWN'}
                </code>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
