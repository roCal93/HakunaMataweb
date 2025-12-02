"use client";

import type { PawTrailProps } from './types';
import { DEFAULT_CONFIG } from './constants';
import { usePawAnimation } from './usePawAnimation';
import { PawPrint } from './PawPrint';
import { DebugOverlay } from './DebugOverlay';

export default function PawTrail(props: PawTrailProps) {
  const config = { ...DEFAULT_CONFIG, ...props };
  const { paws, backPaws, debugInfo, viewport } = usePawAnimation(config);

  return (
    <>
      {config.debug && debugInfo && viewport.width > 0 && (
        <DebugOverlay 
          debugInfo={debugInfo} 
          viewport={viewport} 
          debugScale={config.debugScale} 
        />
      )}
      
      {paws.map((paw) => (
        <PawPrint key={paw.id} paw={paw} src={config.src} size={config.size} />
      ))}
      
      {backPaws.map((paw) => (
        <PawPrint key={paw.id} paw={paw} src={config.src} size={config.size} />
      ))}
    </>
  );
}
