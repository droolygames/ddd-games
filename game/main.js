/**
 * $DDD Games — © 2026 Alex Droolhouse / Drooly Inc.
 * Dual license: see /LICENSE (Section A non-commercial; Section B paid).
 * Not OSI open source. Source-available for transparency + value capture.
 */

/**
 * $DDD Games — UI bootstrap (CSP-safe, no inline handlers)
 */

import { createGame } from "./engine.js";
import { CHALLENGE_COUNT, RUN_PER_SKILL } from "./challenges.js";
import {
  isSoundOn,
  toggleSound,
  sfxSelect,
  sfxAdvance,
  sfxFinish,
  sfxClear,
} from "./sound.js";

const LIVE_URL = "https://x.com/i/broadcasts/1kJzDDYeYWNKv";
const DIFF_LABEL = { 1: "Easy", 2: "Mid", 3: "Hard" };

const game = createGame();
const root = document.getElementById("game-root");
/** @type {string | null} */
let lastPhase = null;

if (!root) {
  console.error("$DDD Games: #game-root missing");
} else {
  render(game.snapshot());
}

function render(snap) {
  const phaseChanged = lastPhase !== snap.phase;
  lastPhase = snap.phase;

  root.innerHTML = "";
  root.dataset.phase = snap.phase;
  root.appendChild(chromeBar());

  if (snap.phase === "title") {
    root.appendChild(viewTitle(snap));
  } else if (snap.phase === "playing") {
    root.appendChild(viewPlaying(snap));
  } else if (snap.phase === "result") {
    root.appendChild(viewResult(snap));
  }

  // Focus only on phase change (not every option click)
  if (phaseChanged) {
    requestAnimationFrame(() => {
      const focusTarget =
        root.querySelector("#game-title, #ch-title, #verdict-title") ||
        root.querySelector("input, button, a");
      if (focusTarget && typeof focusTarget.focus === "function") {
        try {
          focusTarget.focus({ preventScroll: true });
        } catch {
          focusTarget.focus();
        }
      }
    });
  }
}

function chromeBar() {
  const on = isSoundOn();
  const el = elFrom(`
    <div class="game-chrome" role="toolbar" aria-label="Arena controls">
      <button type="button" class="sound-toggle ${on ? "on" : "off"}" id="sound-toggle"
        aria-pressed="${on ? "true" : "false"}"
        title="${on ? "Mute arena sounds" : "Enable arena sounds"}">
        <span class="sound-icon" aria-hidden="true">${on ? "♪" : "♩"}</span>
        <span class="sound-label">${on ? "Sound on" : "Sound off"}</span>
      </button>
    </div>
  `);
  el.querySelector("#sound-toggle").addEventListener("click", () => {
    toggleSound();
    // re-render current phase chrome only via full render (cheap)
    render(game.snapshot());
  });
  return el;
}

function viewTitle(snap) {
  const bank = snap.bankSize || CHALLENGE_COUNT || "—";
  const draw = (snap.perSkill || RUN_PER_SKILL) * 3;
  const el = elFrom(`
    <section class="panel title-panel epic enter" aria-labelledby="game-title">
      <div class="ticket-frame" aria-hidden="true">
        <span class="ticket-notch"></span>
        <span class="ticket-foil">GOLDEN DROOL · $DDD</span>
      </div>
      <p class="eyebrow">$DDD Games · Drooly Games · ICEFAM.FM EP.2</p>
      <h1 id="game-title" class="title" tabindex="-1">Charlie's factory.<br><span class="serif gold">Hunger Games stakes.</span></h1>
      <p class="tagline" role="note">May the odds be ever in your <em>flavor</em>.</p>
      <div class="prize-box">
        <p class="prize-label">Live · virtual Hunger Games</p>
        <p class="prize-main"><strong>$DDD</strong> — skill arena from <strong>Drooly Games</strong> / <strong>DROOLY.AI</strong>. Real crypto + in-game currency when minted.</p>
        <p class="prize-sub"><strong>10 Golden Drool Tickets</strong> = livestreamed showdown seats. Train Code · Canvas · Heart. Watch: <a href="${LIVE_URL}" target="_blank" rel="noopener noreferrer">ICEFAM.FM EP.2 on X ↗</a></p>
      </div>
      <p class="lede">Train the three skills. Ticket holders are the <strong>Ten Tributes</strong>. Everyone else can spar in the arena.</p>
      <p class="bank-meta" aria-label="Challenge bank size"><span class="bank-count">${bank}</span> sealed in bank · <strong>${draw}</strong> drawn per run (5×3 · easy→hard curve) · reshuffle on retry · no eval</p>
      <ul class="skill-pills" role="list">
        <li class="pill code"><span>01</span> Code — Null Protocol</li>
        <li class="pill canvas"><span>02</span> Canvas — creativity</li>
        <li class="pill heart"><span>03</span> Heart — empathy &amp; social skill</li>
      </ul>
      <p class="fine">No real-world violence — skill &amp; ship trials only. Sol first. Pre-mint until @kingofqueens6ix posts CA. Not financial advice.</p>
      <form class="start-form" id="start-form">
        <label class="field">
          <span>Tribute name</span>
          <input name="name" type="text" maxlength="32" autocomplete="nickname" placeholder="e.g. Flavor Favorite" required />
        </label>
        <button type="submit" class="btn primary epic-cta">Enter the factory</button>
      </form>
      ${boardHtml(snap.leaderboard)}
      <p class="nav-back"><a href="/#golden-drool">← Golden Drool on drooly.ai</a> · <a href="${LIVE_URL}" target="_blank" rel="noopener noreferrer">Live broadcast ↗</a></p>
    </section>
  `);

  el.querySelector("#start-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    sfxAdvance();
    render(game.start(String(fd.get("name") || "")));
  });
  return el;
}

function viewPlaying(snap) {
  const ch = snap.challenge;
  const p = snap.progress;
  const skill = ch.skillMeta;
  const pct = p.total ? Math.round((p.index / p.total) * 100) : 0;
  const diff = ch.difficulty || 1;
  const diffLabel = DIFF_LABEL[diff] || "Easy";

  const el = elFrom(`
    <section class="panel play-panel enter" aria-labelledby="ch-title" data-skill="${escapeHtml(ch.skill)}" data-diff="${diff}">
      <header class="play-head">
        <div class="progress-wrap" role="progressbar" aria-valuemin="0" aria-valuemax="${p.total}" aria-valuenow="${p.index}" aria-valuetext="${p.index} of ${p.total}" aria-label="Trial progress">
          <div class="progress-bar" style="width:${pct}%"></div>
        </div>
        <p class="meta">
          <span class="skill-badge skill-${ch.skill}">${escapeHtml(skill.name)}</span>
          <span class="diff-badge diff-${diff}" title="Difficulty">${escapeHtml(diffLabel)}</span>
          <span class="progress-count">${p.index + 1} / ${p.total}</span>
          <span class="muted tribute-chip">${escapeHtml(snap.tributeName)}</span>
        </p>
        <p class="arena">${escapeHtml(skill.arena)} · ${escapeHtml(skill.tagline)}</p>
        <p class="tagline-mini">May the odds be ever in your flavor.</p>
        <h2 id="ch-title" class="ch-title" tabindex="-1">${escapeHtml(ch.title)}</h2>
      </header>
      <div class="prompt">${formatPrompt(ch.prompt)}</div>
      <div class="options" id="options" role="group" aria-label="Answers"></div>
      <footer class="play-foot">
        ${ch.kind === "order" ? `<button type="button" class="btn ghost" id="clear-order">Clear order</button>` : ""}
        <button type="button" class="btn primary" id="next-btn" ${snap.canAdvance ? "" : "disabled"}>
          ${p.index + 1 >= p.total ? "Finish trial" : "Lock in & continue"}
        </button>
      </footer>
    </section>
  `);

  const optionsRoot = el.querySelector("#options");
  if (ch.kind === "order") {
    const hint = document.createElement("p");
    hint.className = "order-hint";
    hint.id = "order-hint";
    hint.textContent =
      "Tap options in the correct order. Numbers show your sequence. Keys 1–4 select.";
    optionsRoot.appendChild(hint);
  } else {
    const hint = document.createElement("p");
    hint.className = "order-hint";
    hint.textContent = "Keys 1–4 select · Enter locks in when ready.";
    optionsRoot.appendChild(hint);
  }

  for (const opt of ch.options) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option";
    btn.dataset.id = opt.id;

    if (ch.kind === "order") {
      const pos = snap.orderDraft.indexOf(opt.id);
      if (pos >= 0) {
        btn.classList.add("selected");
        btn.setAttribute("aria-pressed", "true");
        btn.innerHTML = `<span class="ord">${pos + 1}</span><span class="opt-label">${escapeHtml(opt.label)}</span>`;
      } else {
        btn.setAttribute("aria-pressed", "false");
        btn.innerHTML = `<span class="ord dim">·</span><span class="opt-label">${escapeHtml(opt.label)}</span>`;
      }
    } else {
      const on = snap.selected === opt.id;
      if (on) btn.classList.add("selected");
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.innerHTML = `<span class="opt-label">${escapeHtml(opt.label)}</span>`;
    }

    btn.addEventListener("click", () => {
      sfxSelect();
      render(game.selectOption(opt.id));
    });
    optionsRoot.appendChild(btn);
  }

  const next = el.querySelector("#next-btn");
  next.addEventListener("click", () => {
    if (!game.snapshot().canAdvance) return;
    const before = game.snapshot().phase;
    const nextSnap = game.advance();
    if (nextSnap.phase === "result") sfxFinish(nextSnap.verdict?.rank);
    else sfxAdvance();
    render(nextSnap);
    void before;
  });

  const clear = el.querySelector("#clear-order");
  if (clear) {
    clear.addEventListener("click", () => {
      sfxClear();
      render(game.clearOrder());
    });
  }

  el.addEventListener("keydown", (e) => {
    const n = Number(e.key);
    if (n >= 1 && n <= 9) {
      const opts = [...optionsRoot.querySelectorAll("button.option")];
      const target = opts[n - 1];
      if (target) {
        e.preventDefault();
        target.click();
      }
    } else if (e.key === "Enter" && e.target.tagName !== "BUTTON") {
      if (game.snapshot().canAdvance) {
        e.preventDefault();
        next.click();
      }
    }
  });

  return el;
}

function viewResult(snap) {
  const v = snap.verdict;
  const r = snap.result;
  const skills = ["code", "canvas", "heart"];
  const elapsedMs = snap.runMs;
  const elapsed =
    typeof elapsedMs === "number"
      ? formatDuration(elapsedMs)
      : "";

  const meters = skills
    .map((s) => {
      const sc = r.skillScores[s];
      const meta = snap.skills[s];
      const sharp = v.sharp[s] ? "sharp" : "soft";
      return `
        <div class="meter ${sharp}" style="--fill:${sc.percent}%">
          <div class="meter-head">
            <span>${escapeHtml(meta.name)}</span>
            <strong>${sc.percent}%</strong>
          </div>
          <div class="meter-track"><div class="meter-fill skill-${s}" style="width:${sc.percent}%"></div></div>
          <p class="meter-sub">${sc.correct}/${sc.total} · ${escapeHtml(meta.arena)}</p>
        </div>`;
    })
    .join("");

  const review = r.detail
    .map(
      (d) => `
      <li class="${d.ok ? "ok" : "bad"}">
        <span class="tag">${escapeHtml(d.skill)}</span>
        <span>${d.ok ? "Clear" : "Miss"} — ${escapeHtml(d.explain)}</span>
      </li>`
    )
    .join("");

  const shareLine = `I scored ${r.overallPercent}% on $DDD Games (${v.rank}) — Code ${r.skillScores.code.percent}% · Canvas ${r.skillScores.canvas.percent}% · Heart ${r.skillScores.heart.percent}%. May the odds be ever in your flavor. Play: https://drooly.ai/games/ddd · Live: ${LIVE_URL}`;
  const shareText = encodeURIComponent(shareLine);

  const el = elFrom(`
    <section class="panel result-panel epic enter rank-${escapeHtml(v.rank.toLowerCase())}" aria-labelledby="verdict-title">
      <p class="tagline result-tag">May the odds be ever in your flavor.</p>
      <p class="eyebrow">Trial complete · overall ${r.overallPercent}%${elapsed ? ` · ${elapsed}` : ""} · path to livestream showdown</p>
      <h2 id="verdict-title" class="verdict-title" tabindex="-1">${escapeHtml(v.title)}</h2>
      <p class="rank-pill">${escapeHtml(v.rank)}</p>
      <p class="lede">${escapeHtml(v.blurb)}</p>

      <div class="share-card" id="share-card" aria-label="Shareable result card">
        <p class="share-card-kicker">$DDD GAMES · SEASON 0</p>
        <p class="share-card-name">${escapeHtml(snap.tributeName)}</p>
        <p class="share-card-score"><span class="share-big">${r.overallPercent}%</span> <span class="share-rank">${escapeHtml(v.rank)}</span></p>
        <p class="share-card-skills">Code ${r.skillScores.code.percent}% · Canvas ${r.skillScores.canvas.percent}% · Heart ${r.skillScores.heart.percent}%</p>
        <p class="share-card-tag">May the odds be ever in your flavor.</p>
      </div>

      <div class="prize-box compact">
        <p class="prize-label">What you’re fighting for</p>
        <p class="prize-main">One of <strong>10 Golden Drool Tickets</strong> to the <strong>livestreamed showdown</strong> — plus a shot at Drooly Inc / drooly.ai when you prove Code · Canvas · Heart.</p>
      </div>
      <div class="meters">${meters}</div>
      <h3 class="subhead">Debrief</h3>
      <ul class="review" role="list">${review}</ul>
      ${boardHtml(snap.leaderboard)}
      <div class="result-actions">
        <button type="button" class="btn primary" id="retry">Run it back</button>
        <button type="button" class="btn ghost" id="copy-share">Copy result</button>
        <a class="btn ghost" href="https://x.com/intent/tweet?text=${shareText}" target="_blank" rel="noopener noreferrer">Share on X</a>
        <a class="btn ghost" href="${LIVE_URL}" target="_blank" rel="noopener noreferrer">Watch live ↗</a>
        <a class="btn ghost" href="/#golden-drool">Golden Drool</a>
        <a class="btn ghost" href="/chat">drooly.ai chat</a>
      </div>
      <p class="fine result-fine" id="copy-status" aria-live="polite">Sealed bank · local board only · dual-license OSS on droolygames/ddd-games · sound optional</p>
    </section>
  `);

  el.querySelector("#retry").addEventListener("click", () => {
    sfxAdvance();
    render(game.start(snap.tributeName));
  });

  el.querySelector("#copy-share").addEventListener("click", async () => {
    const status = el.querySelector("#copy-status");
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareLine);
      } else {
        throw new Error("no clipboard");
      }
      if (status) status.textContent = "Result copied — paste anywhere. Sound optional · local board only.";
      sfxSelect();
    } catch {
      if (status) status.textContent = "Copy failed — use Share on X instead.";
    }
  });

  return el;
}

function formatDuration(ms) {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}

function boardHtml(board) {
  if (!board || !board.length) {
    return `<div class="board empty"><p class="muted">No local scores yet. First clear writes the board on this device.</p></div>`;
  }
  const rows = board
    .slice(0, 10)
    .map(
      (row, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(row.name)}</td>
        <td>${row.overall}%</td>
        <td class="hide-sm">${row.code}/${row.canvas}/${row.heart}</td>
        <td><span class="mini-rank">${escapeHtml(row.rank)}</span></td>
      </tr>`
    )
    .join("");
  return `
    <div class="board">
      <h3 class="subhead">Local arena board</h3>
      <table>
        <thead><tr><th>#</th><th>Tribute</th><th>All</th><th class="hide-sm">C/V/H</th><th>Rank</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function formatPrompt(text) {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, _lang, code) => {
      return `<pre class="code-block"><code>${code.trim()}</code></pre>`;
    })
    .replace(/\n/g, "<br>");
}

function elFrom(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
