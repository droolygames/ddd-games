/**
 * $DDD Games — © 2026 Alex Droolhouse / Drooly Inc.
 * Dual license: see /LICENSE (Section A non-commercial; Section B paid).
 * Not OSI open source. Source-available for transparency + value capture.
 */

/**
 * $DDD Games — UI bootstrap (CSP-safe, no inline handlers)
 */

import { createGame } from "./engine.js";

const game = createGame();
const root = document.getElementById("game-root");

if (!root) {
  console.error("$DDD Games: #game-root missing");
} else {
  render(game.snapshot());
}

function render(snap) {
  root.innerHTML = "";
  root.dataset.phase = snap.phase;

  if (snap.phase === "title") {
    root.appendChild(viewTitle(snap));
    return;
  }
  if (snap.phase === "playing") {
    root.appendChild(viewPlaying(snap));
    return;
  }
  if (snap.phase === "result") {
    root.appendChild(viewResult(snap));
  }
}

function viewTitle(snap) {
  const el = elFrom(`
    <section class="panel title-panel epic" aria-labelledby="game-title">
      <div class="ticket-frame" aria-hidden="true">
        <span class="ticket-notch"></span>
        <span class="ticket-foil">GOLDEN DROOL · $DDD</span>
      </div>
      <p class="eyebrow">$DDD Games · DROOLY.AI studio arena</p>
      <h1 id="game-title" class="title">Charlie's factory.<br><span class="serif gold">Hunger Games stakes.</span></h1>
      <p class="tagline" role="note">May the odds be ever in your <em>flavor</em>.</p>
      <div class="prize-box">
        <p class="prize-label">Economy · $DDD</p>
        <p class="prize-main"><strong>$DDD</strong> powers the game — real crypto and in-game currency when minted.</p>
        <p class="prize-sub"><strong>10 Golden Drool Tickets</strong> = livestreamed showdown seats. Skill trials: Code · Canvas · Heart. Studio: <strong>drooly.ai</strong>.</p>
      </div>
      <p class="lede">Train the three skills. Ticket holders are the <strong>Ten Tributes</strong>. Everyone else can spar in the arena.</p>
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
      <p class="nav-back"><a href="/#golden-drool">← Golden Drool on drooly.ai</a></p>
    </section>
  `);

  el.querySelector("#start-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    render(game.start(String(fd.get("name") || "")));
  });
  return el;
}

function viewPlaying(snap) {
  const ch = snap.challenge;
  const p = snap.progress;
  const skill = ch.skillMeta;

  const el = elFrom(`
    <section class="panel play-panel" aria-labelledby="ch-title">
      <header class="play-head">
        <div class="progress-wrap" aria-label="Progress">
          <div class="progress-bar" style="width:${((p.index) / p.total) * 100}%"></div>
        </div>
        <p class="meta">
          <span class="skill-badge skill-${ch.skill}">${escapeHtml(skill.name)}</span>
          <span>${p.index + 1} / ${p.total}</span>
          <span class="muted">${escapeHtml(snap.tributeName)}</span>
        </p>
        <p class="arena">${escapeHtml(skill.arena)} · ${escapeHtml(skill.tagline)}</p>
        <p class="tagline-mini">May the odds be ever in your flavor.</p>
        <h2 id="ch-title" class="ch-title">${escapeHtml(ch.title)}</h2>
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
    hint.textContent =
      "Tap options in the correct order. Numbers show your sequence.";
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
        btn.innerHTML = `<span class="ord">${pos + 1}</span><span class="opt-label">${escapeHtml(opt.label)}</span>`;
      } else {
        btn.innerHTML = `<span class="ord dim">·</span><span class="opt-label">${escapeHtml(opt.label)}</span>`;
      }
    } else {
      if (snap.selected === opt.id) btn.classList.add("selected");
      btn.innerHTML = `<span class="opt-label">${escapeHtml(opt.label)}</span>`;
    }

    btn.addEventListener("click", () => {
      render(game.selectOption(opt.id));
    });
    optionsRoot.appendChild(btn);
  }

  const next = el.querySelector("#next-btn");
  next.addEventListener("click", () => {
    if (!game.snapshot().canAdvance) return;
    render(game.advance());
  });

  const clear = el.querySelector("#clear-order");
  if (clear) {
    clear.addEventListener("click", () => render(game.clearOrder()));
  }

  return el;
}

function viewResult(snap) {
  const v = snap.verdict;
  const r = snap.result;
  const skills = ["code", "canvas", "heart"];

  const meters = skills
    .map((s) => {
      const sc = r.skillScores[s];
      const meta = snap.skills[s];
      const sharp = v.sharp[s] ? "sharp" : "soft";
      return `
        <div class="meter ${sharp}">
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

  const el = elFrom(`
    <section class="panel result-panel epic rank-${escapeHtml(v.rank.toLowerCase())}" aria-labelledby="verdict-title">
      <p class="tagline result-tag">May the odds be ever in your flavor.</p>
      <p class="eyebrow">Trial complete · overall ${r.overallPercent}% · path to livestream showdown</p>
      <h2 id="verdict-title" class="verdict-title">${escapeHtml(v.title)}</h2>
      <p class="rank-pill">${escapeHtml(v.rank)}</p>
      <p class="lede">${escapeHtml(v.blurb)}</p>
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
        <a class="btn ghost" href="/#golden-drool">Golden Drool</a>
        <a class="btn ghost" href="/chat">drooly.ai chat</a>
      </div>
    </section>
  `);

  el.querySelector("#retry").addEventListener("click", () => {
    render(game.start(snap.tributeName));
  });
  return el;
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
