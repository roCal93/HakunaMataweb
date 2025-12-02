export interface Paw {
  id: number;
  x: number;
  y: number;
  angle: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface EdgeProximity {
  px: number;
  py: number;
  total: number;
  margin: number;
}

export interface DebugInfo {
  prev: Position;
  mv: Position;
  av: Position;
  desired: Position;
  forward: Position;
  side: Position;
  avoidanceMargin: number;
}

export interface PawTrailConfig {
  src: string;
  size: number;
  step: number;
  bodyWidth: number;
  frequency: number;
  drift: number;
  edgeMargin: number;
  avoidanceStrength: number;
  anticipation: number;
  maxPaws: number;
  roamOnIdle: boolean;
  idleAfter: number;
  debug: boolean;
  debugScale: number;
  curvedSteer: boolean;
  turnSpeed: number;
  rearOffset: number;
}

export type PawTrailProps = Partial<PawTrailConfig>;

export interface AnimationState {
  direction: number;
  lastPos: Position | null;
  leftStep: boolean;
  id: number;
  acc: number;
  isIdle: boolean;
}

export interface Viewport {
  width: number;
  height: number;
}
