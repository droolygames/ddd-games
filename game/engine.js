/**
 * $DDD Games — © 2026 Alex Droolhouse / Drooly Inc.
 * Dual license: see /LICENSE (Section A non-commercial; Section B paid).
 * Not OSI open source. Source-available for transparency + value capture.
 */

/**
 * $DDD Games — state machine
 */

import {
  CHALLENGES,
  PASS_MARKS,
  RUN_PER_SKILL,
  SKILLS,
  pickRunChallenges,
} from "./challenges.js";
import { emptyAnswers, scoreRun, verdict } from "./scoring.js";

const STORAGE_KEY = "ddd-games-v1";

export function createGame(options = {}) {
  const pool = options.challenges || CHALLENGES;
  const marks = options.marks || PASS_MARKS;
  const perSkill = options.perSkill ?? RUN_PER_SKILL;
  /** when true, play entire pool (tests); default uses difficulty curve subset */
  const fullBank = options.fullBank === true;

  function deal() {
    const dealt = fullBank ? [...pool] : pickRunChallenges(pool, perSkill);
    // Interleave skills for Hunger Games pacing: code, canvas, heart, repeat
    return interleaveBySkill(dealt);
  }

  const ordered = deal();

  const state = {
    phase: "title", // title | playing | result
    tributeName: "",
    index: 0,
    challenges: ordered,
    answers: emptyAnswers(ordered),
    /** order challenge working buffer */
    orderDraft: [],
    startedAt: null,
    finishedAt: null,
    result: null,
    verdict: null,
    bankSize: pool.length,
  };

  function current() {
    return state.challenges[state.index] || null;
  }

  function progress() {
    return {
      index: state.index,
      total: state.challenges.length,
      percent: Math.round((state.index / state.challenges.length) * 100),
    };
  }

  function start(name) {
    const cleaned = String(name || "")
      .trim()
      .slice(0, 32);
    state.tributeName = cleaned || "Anonymous Tribute";
    state.phase = "playing";
    state.index = 0;
    // Fresh deal each run: shuffle + difficulty curve for replay value
    state.challenges = deal();
    state.answers = emptyAnswers(state.challenges);
    state.orderDraft = [];
    state.startedAt = Date.now();
    state.finishedAt = null;
    state.result = null;
    state.verdict = null;
    const ch = current();
    if (ch?.kind === "order") state.orderDraft = [];
    return snapshot();
  }

  function selectOption(optionId) {
    const ch = current();
    if (!ch || state.phase !== "playing") return snapshot();
    if (ch.kind === "order") {
      // toggle into draft order
      const i = state.orderDraft.indexOf(optionId);
      if (i >= 0) state.orderDraft.splice(i, 1);
      else if (state.orderDraft.length < ch.options.length) state.orderDraft.push(optionId);
      return snapshot();
    }
    state.answers[ch.id] = optionId;
    return snapshot();
  }

  function clearOrder() {
    state.orderDraft = [];
    return snapshot();
  }

  function canAdvance() {
    const ch = current();
    if (!ch) return false;
    if (ch.kind === "order") {
      return state.orderDraft.length === (ch.options?.length || 0);
    }
    return state.answers[ch.id] != null;
  }

  function advance() {
    const ch = current();
    if (!ch || !canAdvance()) return snapshot();
    if (ch.kind === "order") {
      state.answers[ch.id] = [...state.orderDraft];
    }
    if (state.index >= state.challenges.length - 1) {
      finish();
    } else {
      state.index += 1;
      state.orderDraft = [];
    }
    return snapshot();
  }

  function finish() {
    state.phase = "result";
    state.finishedAt = Date.now();
    state.result = scoreRun(state.challenges, state.answers);
    state.verdict = verdict(state.result, marks);
    persistLeaderboard();
    return snapshot();
  }

  function persistLeaderboard() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const board = raw ? JSON.parse(raw) : [];
      board.push({
        name: state.tributeName,
        at: state.finishedAt,
        overall: state.result.overallPercent,
        code: state.result.skillScores.code.percent,
        canvas: state.result.skillScores.canvas.percent,
        heart: state.result.skillScores.heart.percent,
        rank: state.verdict.rank,
        ms: state.finishedAt - state.startedAt,
      });
      board.sort((a, b) => b.overall - a.overall || a.ms - b.ms);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(board.slice(0, 25)));
    } catch {
      /* private mode */
    }
  }

  function leaderboard() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function snapshot() {
    const ch = current();
    return {
      phase: state.phase,
      tributeName: state.tributeName,
      challenge: ch
        ? {
            id: ch.id,
            skill: ch.skill,
            skillMeta: SKILLS[ch.skill],
            title: ch.title,
            prompt: ch.prompt,
            kind: ch.kind,
            options: ch.options || [],
          }
        : null,
      selected: ch ? state.answers[ch.id] : null,
      orderDraft: [...state.orderDraft],
      progress: progress(),
      canAdvance: canAdvance(),
      result: state.result,
      verdict: state.verdict,
      leaderboard: state.phase === "result" || state.phase === "title" ? leaderboard() : [],
      skills: SKILLS,
      marks,
      bankSize: state.bankSize,
      perSkill,
    };
  }

  return {
    start,
    selectOption,
    clearOrder,
    advance,
    snapshot,
    leaderboard,
    /** test hook */
    _state: state,
  };
}

/** Preserve within-skill order (difficulty curve from pickRunChallenges). */
function interleaveBySkill(list) {
  const buckets = { code: [], canvas: [], heart: [] };
  for (const c of list) {
    if (buckets[c.skill]) buckets[c.skill].push(c);
  }
  const out = [];
  const max = Math.max(buckets.code.length, buckets.canvas.length, buckets.heart.length);
  for (let i = 0; i < max; i++) {
    if (buckets.code[i]) out.push(buckets.code[i]);
    if (buckets.canvas[i]) out.push(buckets.canvas[i]);
    if (buckets.heart[i]) out.push(buckets.heart[i]);
  }
  return out;
}
