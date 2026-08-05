/**
 * $DDD Games — © 2026 Alex Droolhouse / Drooly Inc.
 * Dual license: see /LICENSE (Section A non-commercial; Section B paid).
 * Not OSI open source. Source-available for transparency + value capture.
 */

/**
 * Optional Web Audio cues — off by default, persisted, respects reduced-motion
 * (sound still allowed when reduced-motion unless user left sound off).
 * No external assets. No autoplay before user gesture.
 */

const PREF_KEY = "ddd-games-sound-v1";

/** @type {AudioContext | null} */
let ctx = null;
let enabled = loadPref();

function loadPref() {
  try {
    const v = localStorage.getItem(PREF_KEY);
    if (v === "1") return true;
    if (v === "0") return false;
  } catch {
    /* private mode */
  }
  return false; // default OFF
}

function savePref(on) {
  try {
    localStorage.setItem(PREF_KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
}

function ensureCtx() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

/**
 * @param {number} freq
 * @param {number} durSec
 * @param {number} [typeGain]
 * @param {OscillatorType} [type]
 */
function beep(freq, durSec, typeGain = 0.04, type = "sine") {
  if (!enabled) return;
  const ac = ensureCtx();
  if (!ac) return;
  try {
    const t0 = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(typeGain, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + durSec);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + durSec + 0.02);
  } catch {
    /* audio unavailable */
  }
}

export function isSoundOn() {
  return enabled;
}

export function setSoundOn(on) {
  enabled = Boolean(on);
  savePref(enabled);
  if (enabled) {
    ensureCtx();
    beep(660, 0.08, 0.035);
  }
}

export function toggleSound() {
  setSoundOn(!enabled);
  return enabled;
}

export function sfxSelect() {
  beep(520, 0.06, 0.03, "triangle");
}

export function sfxAdvance() {
  beep(700, 0.07, 0.032, "sine");
  setTimeout(() => beep(880, 0.09, 0.028, "sine"), 60);
}

export function sfxFinish(rank) {
  if (!enabled) return;
  const map = {
    WORTHY: [523, 659, 784, 1046],
    TRIBUTE: [440, 554, 659],
    DANGER: [392, 349, 330],
    MELT: [300, 250, 200],
  };
  const notes = map[rank] || map.MELT;
  notes.forEach((f, i) => {
    setTimeout(() => beep(f, 0.12, 0.04, "sine"), i * 90);
  });
}

export function sfxClear() {
  beep(280, 0.05, 0.025, "square");
}
