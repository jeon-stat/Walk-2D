import { CharacterFrame, CharacterMotion } from "../types";

type MotionAnimation = {
  frameDurationMs: number;
  frames: CharacterFrame[];
};

const idleFrames: CharacterFrame[] = [
  { offsetY: 0, scaleY: 1, scaleX: 1, rotate: 0 },
  { offsetY: -2, scaleY: 1.01, scaleX: 1, rotate: -0.4 },
  { offsetY: 0, scaleY: 1, scaleX: 1, rotate: 0 },
  { offsetY: 2, scaleY: 0.99, scaleX: 1, rotate: 0.4 }
];

const walkFrames: CharacterFrame[] = [
  { offsetY: 0, scaleY: 1, scaleX: 1, rotate: -1.5 },
  { offsetY: -4, scaleY: 1.02, scaleX: 1, rotate: 1.5 },
  { offsetY: 1, scaleY: 0.99, scaleX: 1, rotate: 0.5 },
  { offsetY: -3, scaleY: 1.02, scaleX: 1, rotate: -0.5 }
];

const runFrames: CharacterFrame[] = [
  { offsetY: -2, scaleY: 1.04, scaleX: 1, rotate: -2.5 },
  { offsetY: -8, scaleY: 1.06, scaleX: 1.01, rotate: 2.4 },
  { offsetY: -1, scaleY: 1.03, scaleX: 1, rotate: 1.2 },
  { offsetY: -7, scaleY: 1.05, scaleX: 1.01, rotate: -1.2 }
];

export const motionRegistry: Record<CharacterMotion, MotionAnimation> = {
  idle: {
    frameDurationMs: 720,
    frames: idleFrames
  },
  walk: {
    frameDurationMs: 200,
    frames: walkFrames
  },
  run: {
    frameDurationMs: 110,
    frames: runFrames
  }
};
