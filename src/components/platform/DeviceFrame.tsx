import React, { useState } from 'react';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  RotateCw, 
  Maximize2, 
  Minimize2,
  X,
  Sparkles,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import { PlatformView } from '@/lib/types';

interface DeviceFrameProps {
  platformView: PlatformView;
  onPlatformChange: (view: PlatformView) => void;
  children: React.ReactNode;
}

export function DeviceFrame({
  platformView,
  onPlatformChange,
  children,
}: DeviceFrameProps) {
  const [isLandscape, setIsLandscape] = useState(false);
  const [scale, setScale] = useState<number>(1);

  if (platformView === 'desktop') {
    return <div className="w-full h-full flex flex-col flex-1 overflow-hidden">{children}</div>;
  }

  const isMobile = platformView === 'mobile';
  const isTablet = platformView === 'tablet';

  return (
    <div className="flex-1 w-full h-full bg-[#0a0a0a] flex flex-col items-center justify-start overflow-auto p-2 sm:p-4 select-none">
      
      {/* Device Simulation Controller Bar */}
      <div className="w-full max-w-xl mx-auto mb-3 px-4 py-2 rounded-2xl bg-[#141414] border border-[#27272a] flex items-center justify-between shadow-xl text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#1e1e1e] p-1 rounded-xl border border-[#333]">
            <button
              onClick={() => onPlatformChange('desktop')}
              className="p-1.5 rounded-lg transition-colors text-zinc-400 hover:text-white"
              title="Desktop View (Full Screen)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onPlatformChange('tablet')}
              className={`p-1.5 rounded-lg transition-colors ${
                platformView === 'tablet' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
              title="Tablet View (iPad 768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onPlatformChange('mobile')}
              className={`p-1.5 rounded-lg transition-colors ${
                platformView === 'mobile' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
              }`}
              title="Mobile View (iPhone 390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-zinc-400 font-mono text-[11px] hidden sm:inline">
            {isMobile 
              ? (isLandscape ? '844 × 390 (Mobile Landscape)' : '390 × 844 (Mobile Portrait)')
              : (isLandscape ? '1024 × 768 (Tablet Landscape)' : '768 × 1024 (Tablet Portrait)')
            }
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Rotate Button */}
          <button
            onClick={() => setIsLandscape(!isLandscape)}
            className="p-1.5 px-2.5 rounded-lg bg-[#222] hover:bg-[#2e2e2e] text-zinc-300 hover:text-white border border-[#333] flex items-center gap-1.5 transition-colors"
            title="Rotate Device Orientation"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">{isLandscape ? 'Portrait' : 'Rotate'}</span>
          </button>

          {/* Reset to Desktop Full Screen */}
          <button
            onClick={() => onPlatformChange('desktop')}
            className="p-1.5 px-2.5 rounded-lg bg-white text-black hover:bg-zinc-200 font-medium text-[11px] flex items-center gap-1 transition-colors"
            title="Exit Simulator"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Full Desktop</span>
          </button>
        </div>
      </div>

      {/* Simulated Device Frame Container */}
      <div className="flex-1 flex items-center justify-center w-full my-auto pb-4 overflow-hidden">
        <div 
          className={`transition-all duration-300 relative flex flex-col bg-black shadow-2xl ring-1 ring-white/10 ${
            isMobile
              ? isLandscape
                ? 'w-[780px] h-[390px] rounded-[36px] border-[8px] border-[#222226]'
                : 'w-[390px] h-[780px] max-h-[88vh] rounded-[44px] border-[9px] border-[#222226]'
              : isLandscape
                ? 'w-[960px] h-[640px] max-h-[88vh] rounded-[32px] border-[10px] border-[#222226]'
                : 'w-[720px] h-[880px] max-h-[88vh] rounded-[36px] border-[10px] border-[#222226]'
          }`}
        >
          {/* Mobile Hardware Bezel: Dynamic Island / Speaker */}
          {isMobile && !isLandscape && (
            <div className="w-full pt-2 pb-1 bg-black flex items-center justify-between px-6 shrink-0 z-30 select-none">
              <span className="text-[11px] font-semibold text-white">9:41</span>
              {/* Dynamic Island pill */}
              <div className="w-24 h-4 rounded-full bg-[#18181b] flex items-center justify-center gap-1.5 ring-1 ring-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#09090b]" />
                <span className="w-2 h-2 rounded-full bg-[#27272a]" />
              </div>
              <div className="flex items-center gap-1 text-white">
                <Signal className="w-2.5 h-2.5" />
                <Wifi className="w-2.5 h-2.5" />
                <Battery className="w-3 h-3" />
              </div>
            </div>
          )}

          {/* Device Inner Screen Canvas */}
          <div className="flex-1 w-full h-full overflow-hidden flex flex-col relative rounded-[28px]">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          {isMobile && (
            <div className="w-full py-1 bg-black flex justify-center shrink-0 z-30">
              <div className="w-28 h-1 rounded-full bg-zinc-600" />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
