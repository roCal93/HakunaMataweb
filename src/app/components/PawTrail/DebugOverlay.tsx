"use client";

import type { DebugInfo, Viewport } from './types';
import { DEBUG_COLORS, DEBUG_SIZES } from './constants';

interface DebugOverlayProps {
  debugInfo: DebugInfo;
  viewport: Viewport;
  debugScale: number;
}

export function DebugOverlay({ debugInfo, viewport, debugScale }: DebugOverlayProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      <svg width={viewport.width} height={viewport.height} className="w-full h-full">
        {/* Avoidance margin circle */}
        <circle
          cx={debugInfo.prev.x}
          cy={debugInfo.prev.y}
          r={debugInfo.avoidanceMargin * debugScale}
          stroke={DEBUG_COLORS.AVOIDANCE_MARGIN}
          strokeWidth={DEBUG_SIZES.STROKE_WIDTH}
          fill="none"
        />
        
        {/* Movement vector (blue) */}
        <line
          x1={debugInfo.prev.x}
          y1={debugInfo.prev.y}
          x2={debugInfo.prev.x + debugInfo.mv.x * DEBUG_SIZES.MOVEMENT_VECTOR}
          y2={debugInfo.prev.y + debugInfo.mv.y * DEBUG_SIZES.MOVEMENT_VECTOR}
          stroke={DEBUG_COLORS.MOVEMENT_VECTOR}
          strokeWidth={DEBUG_SIZES.STROKE_WIDTH}
        />
        
        {/* Avoidance vector (red) */}
        <line
          x1={debugInfo.prev.x}
          y1={debugInfo.prev.y}
          x2={debugInfo.prev.x + debugInfo.av.x * DEBUG_SIZES.AVOIDANCE_VECTOR}
          y2={debugInfo.prev.y + debugInfo.av.y * DEBUG_SIZES.AVOIDANCE_VECTOR}
          stroke={DEBUG_COLORS.AVOIDANCE_VECTOR}
          strokeWidth={DEBUG_SIZES.STROKE_WIDTH}
        />
        
        {/* Desired direction vector (purple, dashed) */}
        <line
          x1={debugInfo.prev.x}
          y1={debugInfo.prev.y}
          x2={debugInfo.prev.x + debugInfo.desired.x * DEBUG_SIZES.DESIRED_VECTOR}
          y2={debugInfo.prev.y + debugInfo.desired.y * DEBUG_SIZES.DESIRED_VECTOR}
          stroke={DEBUG_COLORS.DESIRED_VECTOR}
          strokeWidth={DEBUG_SIZES.STROKE_WIDTH}
          strokeDasharray="6 4"
        />
        
        {/* Forward point (green) */}
        <circle 
          cx={debugInfo.forward.x} 
          cy={debugInfo.forward.y} 
          r={DEBUG_SIZES.POINT_RADIUS} 
          fill={DEBUG_COLORS.FORWARD_POINT} 
        />
        
        {/* Side point (orange) */}
        <circle 
          cx={debugInfo.side.x} 
          cy={debugInfo.side.y} 
          r={DEBUG_SIZES.POINT_RADIUS} 
          fill={DEBUG_COLORS.SIDE_POINT} 
        />
      </svg>
    </div>
  );
}
