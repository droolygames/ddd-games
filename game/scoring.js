/**
 * $DDD Games — © 2026 Alex Droolhouse / Drooly Inc.
 * Dual license: see /LICENSE (Section A non-commercial; Section B paid).
 * Not OSI open source. Source-available for transparency + value capture.
 */

/**
 * $DDD Games scoring — pure functions, easy to test
 */

/**
 * @param {import('./challenges.js').Challenge} challenge
 * @param {string|string[]|null} answer
 * @returns {boolean}
 */
export function isCorrect(challenge, answer) {
  if (answer == null) return false;
  if (challenge.kind === "order") {
    if (!Array.isArray(answer) || !Array.isArray(challenge.correct)) return false;
    if (answer.length !== challenge.correct.length) return false;
    return answer.every((id, i) => id === challenge.correct[i]);
  }
  if (challenge.multi) {
    if (!Array.isArray(answer) || !Array.isArray(challenge.correct)) return false;
    const a = [...answer].sort().join(",");
    const b = [...challenge.correct].sort().join(",");
    return a === b;
  }
  return answer === challenge.correct;
}

/**
 * @param {import('./challenges.js').Challenge[]} challenges
 * @param {Record<string, string|string[]|null>} answers map challengeId -> answer
 */
export function scoreRun(challenges, answers) {
  const bySkill = {
    code: { earned: 0, possible: 0, correct: 0, total: 0 },
    canvas: { earned: 0, possible: 0, correct: 0, total: 0 },
    heart: { earned: 0, possible: 0, correct: 0, total: 0 },
  };

  const detail = [];

  for (const ch of challenges) {
    const weight = ch.weight ?? 1;
    const bucket = bySkill[ch.skill];
    bucket.possible += weight;
    bucket.total += 1;
    const ans = answers[ch.id] ?? null;
    const ok = isCorrect(ch, ans);
    if (ok) {
      bucket.earned += weight;
      bucket.correct += 1;
    }
    detail.push({
      id: ch.id,
      skill: ch.skill,
      ok,
      weight,
      explain: ch.explain,
    });
  }

  const skillScores = {};
  for (const key of Object.keys(bySkill)) {
    const b = bySkill[key];
    const ratio = b.possible > 0 ? b.earned / b.possible : 0;
    skillScores[key] = {
      ...b,
      ratio,
      percent: Math.round(ratio * 100),
    };
  }

  const possible = Object.values(bySkill).reduce((s, b) => s + b.possible, 0);
  const earned = Object.values(bySkill).reduce((s, b) => s + b.earned, 0);
  const overall = possible > 0 ? earned / possible : 0;

  return {
    skillScores,
    overall,
    overallPercent: Math.round(overall * 100),
    earned,
    possible,
    detail,
  };
}

/**
 * @param {ReturnType<typeof scoreRun>} result
 * @param {{ skill: number, overall: number, allSkills: number }} marks
 */
export function verdict(result, marks) {
  const skills = ["code", "canvas", "heart"];
  const ratios = skills.map((s) => result.skillScores[s].ratio);
  const allAboveFloor = ratios.every((r) => r >= marks.allSkills);
  const overallPass = result.overall >= marks.overall;
  const sharp = Object.fromEntries(
    skills.map((s) => [s, result.skillScores[s].ratio >= marks.skill])
  );

  let rank = "MELT";
  let title = "Melted chocolate";
  let blurb =
    "The glass stays closed. Train the three skills — code, canvas, heart — and re-enter the arena.";

  if (overallPass && allAboveFloor) {
    rank = "WORTHY";
    title = "Factory Confectioner";
    blurb =
      "You cleared code, canvas, and heart. Worthy of Drooly Inc / drooly.ai team consideration — still subject to The Games & Wonka.";
  } else if (overallPass || ratios.filter((r) => r >= marks.skill).length >= 2) {
    rank = "TRIBUTE";
    title = "Active Tribute";
    blurb =
      "You belong in the arena, but a lane is still soft. Sharpen the weak skill before Confectioner.";
  } else if (result.overall >= 0.45) {
    rank = "DANGER";
    title = "Danger zone";
    blurb = "Bottom ranks. One more weak trial and you’re spectating from the glass.";
  }

  return { rank, title, blurb, sharp, allAboveFloor, overallPass };
}

export function emptyAnswers(challenges) {
  /** @type {Record<string, string|string[]|null>} */
  const out = {};
  for (const ch of challenges) out[ch.id] = null;
  return out;
}
