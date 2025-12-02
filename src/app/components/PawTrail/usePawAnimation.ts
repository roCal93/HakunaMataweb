import { useState, useRef, useEffect } from 'react';
import type { Paw, DebugInfo, PawTrailConfig, AnimationState, Viewport } from './types';
import {
  calculateEdgeProximity,
  calculateAvoidanceVector,
  updateDirection,
  clampPosition,
  calculateSafeStartPosition,
  mixDirectionVectors,
  calculateOffsetPosition,
  getRandomDirectionVariation,
  degreesToRadians,
  radiansToDegrees,
} from './physics';
import { MATH, ANIMATION_DELAYS } from './constants';

export function usePawAnimation(config: PawTrailConfig) {
  const [paws, setPaws] = useState<Paw[]>([]);
  const [backPaws, setBackPaws] = useState<Paw[]>([]);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [viewport, setViewport] = useState<Viewport>({ width: 0, height: 0 });

  // Animation state
  const stateRef = useRef<AnimationState>({
    direction: Math.random() * 360,
    lastPos: null,
    leftStep: false,
    id: 0,
    acc: 0,
    isIdle: true,
  });

  const rafIdRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);

  // Update viewport size
  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Handle idle state
  useEffect(() => {
    if (!config.roamOnIdle) return;

    const onScroll = () => {
      stateRef.current.isIdle = false;
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = window.setTimeout(() => {
        stateRef.current.isIdle = true;
      }, config.idleAfter);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    idleTimerRef.current = window.setTimeout(() => {
      stateRef.current.isIdle = true;
    }, config.idleAfter);

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
    };
  }, [config.roamOnIdle, config.idleAfter]);

  // Main animation loop
  useEffect(() => {
    if (viewport.width === 0 || viewport.height === 0) return;

    const minMargin = Math.max(config.edgeMargin, config.size / 2);
    const start = calculateSafeStartPosition(viewport, minMargin);
    stateRef.current.lastPos = start;

    const addPaw = (x: number, y: number, angle: number) => {
      const newPaw: Paw = { id: stateRef.current.id++, x, y, angle };
      setPaws((p) => [...p.slice(-Math.max(1, config.maxPaws - 1)), newPaw]);
    };

    const addBackPaw = (x: number, y: number, angle: number) => {
      const newBackPaw: Paw = { id: stateRef.current.id++, x, y, angle };
      setBackPaws((p) => [...p.slice(-Math.max(1, config.maxPaws - 1)), newBackPaw]);
    };

    const tick = (time: number) => {
      if (document.hidden) {
        lastFrameRef.current = time;
        rafIdRef.current = window.requestAnimationFrame(tick);
        return;
      }

      if (lastFrameRef.current == null) lastFrameRef.current = time;
      const delta = time - lastFrameRef.current;
      lastFrameRef.current = time;
      stateRef.current.acc += delta;

      const state = stateRef.current;
      const prev = state.lastPos ?? start;
      
      // Calculate random direction with drift
      const randomTargetDir = getRandomDirectionVariation(state.direction, config.drift);
      let rad = degreesToRadians(state.direction);

      // Calculate edge proximity and avoidance
      const proximity = calculateEdgeProximity(prev, viewport, config.anticipation);
      const mvx = Math.cos(degreesToRadians(randomTargetDir));
      const mvy = Math.sin(degreesToRadians(randomTargetDir));
      
      let fx = mvx;
      let fy = mvy;
      let avx = 0;
      let avy = 0;

      if (proximity.total > 0) {
        const avoidance = calculateAvoidanceVector(proximity);
        avx = avoidance.x;
        avy = avoidance.y;

        const mixed = mixDirectionVectors(
          { x: mvx, y: mvy },
          avoidance,
          proximity.total,
          config.anticipation,
          config.avoidanceStrength
        );
        fx = mixed.x;
        fy = mixed.y;

        const desiredAngle = Math.atan2(fy, fx);
        const currentAngle = degreesToRadians(state.direction);
        const newAngle = updateDirection(
          currentAngle,
          desiredAngle,
          delta,
          config.turnSpeed,
          config.curvedSteer
        );

        state.direction = radiansToDegrees(newAngle);
        rad = newAngle;
      }

      // Calculate forward and side positions
      const forward = calculateOffsetPosition(prev, rad, config.step);
      const wasLeft = state.leftStep;
      const sideRad = rad + (wasLeft ? -MATH.RIGHT_ANGLE : MATH.RIGHT_ANGLE);
      const side = calculateOffsetPosition(forward, sideRad, config.bodyWidth);

      const clampedSide = clampPosition(side.x, side.y, minMargin, viewport);
      const clampedForward = clampPosition(forward.x, forward.y, minMargin, viewport);

      // Handle roaming behavior
      if (config.roamOnIdle && !state.isIdle) {
        state.acc = 0;
        rafIdRef.current = window.requestAnimationFrame(tick);
        return;
      }

      // Add paws at frequency interval
      if (state.acc >= config.frequency) {
        state.acc = 0;

        addPaw(clampedSide.x, clampedSide.y, state.direction);
        state.lastPos = clampedForward;

        // Add back paw
        const backSideRad = rad + (wasLeft ? MATH.RIGHT_ANGLE : -MATH.RIGHT_ANGLE);
        const backOffset = calculateOffsetPosition(
          prev,
          rad,
          -config.step * config.rearOffset
        );
        const back = calculateOffsetPosition(backOffset, backSideRad, config.bodyWidth);
        const clampedBack = clampPosition(back.x, back.y, minMargin, viewport);

        addBackPaw(clampedBack.x, clampedBack.y, state.direction);
        state.leftStep = !state.leftStep;
      }

      // Update debug info
      if (config.debug) {
        setDebugInfo({
          prev,
          mv: { x: mvx, y: mvy },
          av: { x: avx, y: avy },
          desired: { x: fx, y: fy },
          forward,
          side,
          avoidanceMargin: proximity.margin,
        });
      }

      rafIdRef.current = window.requestAnimationFrame(tick);
    };

    const startTimeout = setTimeout(() => {
      rafIdRef.current = window.requestAnimationFrame(tick);
    }, ANIMATION_DELAYS.START);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      clearTimeout(startTimeout);
    };
  }, [
    config.frequency,
    config.step,
    config.bodyWidth,
    config.drift,
    config.size,
    config.edgeMargin,
    config.avoidanceStrength,
    config.maxPaws,
    config.roamOnIdle,
    config.anticipation,
    config.curvedSteer,
    config.debug,
    config.turnSpeed,
    config.rearOffset,
    viewport,
  ]);

  return { paws, backPaws, debugInfo, viewport };
}
