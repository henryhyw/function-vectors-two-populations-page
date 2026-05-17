/* ============================================================
 *  Function Vectors Are Two Populations — page logic
 *  All charts read window.DATA (populated by data.js).
 * ============================================================ */
"use strict";

const $  = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

const D = window.DATA || {};
if (!window.DATA) console.warn("[app] window.DATA missing — charts will be empty.");

// ----- numeric formatters -----
const fmt2  = v => (v == null ? "—" : (v >= 0 ? "+" : "") + (+v).toFixed(2));
const fmt3  = v => (v == null ? "—" : (v >= 0 ? "+" : "") + (+v).toFixed(3));
const fmtPct = v => (v == null ? "—" : (+v * 100).toFixed(1) + "%");

// ----- tooltip helper -----
const tooltip = document.createElement("div");
tooltip.className = "tooltip";
document.body.appendChild(tooltip);
function showTip(html, evt) {
  tooltip.innerHTML = html;
  tooltip.classList.add("visible");
  const x = evt.clientX + 12, y = evt.clientY + 12;
  tooltip.style.left = x + "px";
  tooltip.style.top  = y + "px";
}
function hideTip() { tooltip.classList.remove("visible"); }

// ============================================================
//  Reveal-on-scroll observer
// ============================================================
function initReveal() {
  if (!("IntersectionObserver" in window)) {
    $$(".reveal").forEach(el => el.classList.add("visible"));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach(el => obs.observe(el));
}

// ============================================================
//  Top nav scroll state + progress bar
// ============================================================
function initProgress() {
  const bar = document.getElementById("progress");
  const nav = document.getElementById("topnav");
  if (!bar && !nav) return;
  const onScroll = () => {
    const sc = window.scrollY;
    const tot = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (Math.min(1, sc / Math.max(1, tot)) * 100) + "%";
    if (nav) nav.classList.toggle("scrolled", sc > 30);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ============================================================
//  Once-visible trigger — fires `cb` when the element first
//  enters the viewport, then unobserves. Used for chart
//  animations so they play on scroll-into-view, not page load.
// ============================================================
function onceVisible(el, cb, threshold = 0.25) {
  if (!el) return;
  if (!("IntersectionObserver" in window)) { cb(); return; }
  const obs = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { cb(); obs.unobserve(el); }
    }
  }, { threshold });
  obs.observe(el);
}

// ============================================================
//  1. Discovery card — writer + canceller side-by-side
//     Data-driven from D.perHead[cellId].writers / .cancellers
//     Renders W and C cards independently so picker changes only
//     re-animate the affected side.
// ============================================================
const Discovery = (() => {
  const HOST_ID = "discovery-card";
  const state = { cellId: "hier-410M", writerIdx: 0, cancellerIdx: 0 };
  let pickersWired = false;

  function bar(direction, color) {
    return `<div class="disc-bar"><div class="fill ${direction}" style="width: 0; background: ${color};"></div></div>`;
  }

  function getMaxDLA() {
    const ph = D.perHead?.[state.cellId];
    if (!ph) return 0.10;
    const all = [...ph.writers, ...ph.cancellers].map(h => Math.abs(h.dla || 0));
    return Math.max(0.05, Math.max(...all, 0)) * 1.05;
  }

  function populatePickers() {
    const cellSel = document.getElementById("disc-cell");
    const wSel    = document.getElementById("disc-writer");
    const cSel    = document.getElementById("disc-canceller");
    if (!cellSel || !wSel || !cSel) return;

    if (cellSel.children.length === 0) {
      D.mainCells.forEach(c => {
        const o = document.createElement("option");
        o.value = c.id; o.textContent = c.id;
        if (c.id === state.cellId) o.selected = true;
        cellSel.appendChild(o);
      });
    }
    const ph = D.perHead?.[state.cellId];
    if (!ph) return;

    wSel.innerHTML = "";
    ph.writers.forEach((h, i) => {
      const o = document.createElement("option");
      o.value = String(i);
      o.textContent = `${h.id}  (DLA ${h.dla >= 0 ? "+" : ""}${h.dla.toFixed(3)})`;
      if (i === state.writerIdx) o.selected = true;
      wSel.appendChild(o);
    });
    cSel.innerHTML = "";
    ph.cancellers.forEach((h, i) => {
      const o = document.createElement("option");
      o.value = String(i);
      o.textContent = `${h.id}  (DLA ${h.dla >= 0 ? "+" : ""}${h.dla.toFixed(3)})`;
      if (i === state.cancellerIdx) o.selected = true;
      cSel.appendChild(o);
    });

    if (!pickersWired) {
      cellSel.addEventListener("change", () => {
        state.cellId = cellSel.value;
        state.writerIdx = 0;
        state.cancellerIdx = 0;
        populatePickers();
        renderAll();
      });
      wSel.addEventListener("change", () => {
        state.writerIdx = parseInt(wSel.value, 10) || 0;
        renderWriter();
      });
      cSel.addEventListener("change", () => {
        state.cancellerIdx = parseInt(cSel.value, 10) || 0;
        renderCanceller();
      });
      pickersWired = true;
    }
  }

  function buildWriterCardHTML(writer, wAttn, cellId) {
    return `
      <div class="disc-cell writer" data-side="writer">
        <div class="head-tag">Writer head · ${cellId}</div>
        <div class="head-name">${writer.id}</div>
        <div class="head-role">writer · pushes correct ↑</div>

        <div class="disc-bar-row">
          <span class="lbl">direct effect (DLA)</span>
          ${bar("right", "var(--writer)")}
          <span class="val">${fmt3(writer.dla)}</span>
        </div>
        <div class="disc-bar-row">
          <span class="lbl">attn → demo-label*</span>
          ${bar("right", "var(--writer)")}
          <span class="val">${((wAttn.demo_label||0)*100).toFixed(0)}%</span>
        </div>
        <div class="disc-bar-row">
          <span class="lbl">attn → format-prefix*</span>
          ${bar("right", "var(--writer-soft)")}
          <span class="val">${((wAttn.format_prefix||0)*100).toFixed(0)}%</span>
        </div>
        <div class="disc-summary">
          <span>z-score</span>
          <span class="delta">${writer.z >= 0 ? "+" : ""}${(writer.z || 0).toFixed(2)}</span>
        </div>
      </div>`;
  }

  function buildCancellerCardHTML(canc, cAttn, cellId) {
    return `
      <div class="disc-cell canceller" data-side="canceller">
        <div class="head-tag">Canceller head · ${cellId}</div>
        <div class="head-name">${canc.id}</div>
        <div class="head-role">canceller · pushes correct ↓</div>

        <div class="disc-bar-row">
          <span class="lbl">direct effect (DLA)</span>
          ${bar("left", "var(--canceller)")}
          <span class="val">${fmt3(canc.dla)}</span>
        </div>
        <div class="disc-bar-row">
          <span class="lbl">attn → demo-label*</span>
          ${bar("right", "var(--canceller)")}
          <span class="val">${((cAttn.demo_label||0)*100).toFixed(0)}%</span>
        </div>
        <div class="disc-bar-row">
          <span class="lbl">attn → format-prefix*</span>
          ${bar("right", "var(--canceller-soft)")}
          <span class="val">${((cAttn.format_prefix||0)*100).toFixed(0)}%</span>
        </div>
        <div class="disc-summary">
          <span>z-score</span>
          <span class="delta">${canc.z >= 0 ? "+" : ""}${(canc.z || 0).toFixed(2)}</span>
        </div>
      </div>`;
  }

  function animateBars(rootEl, targets) {
    requestAnimationFrame(() => {
      const bars = rootEl.querySelectorAll(".disc-bar .fill");
      bars.forEach((b, i) => setTimeout(() => b.style.width = (targets[i] || 0) + "%", 80 + i * 90));
    });
  }

  function renderAll() {
    populatePickers();
    const host = document.getElementById(HOST_ID);
    if (!host) return;
    const ph = D.perHead?.[state.cellId];
    if (!ph) return;
    const writer = ph.writers[state.writerIdx] || ph.writers[0];
    const canc   = ph.cancellers[state.cancellerIdx] || ph.cancellers[0];
    if (!writer || !canc) return;
    const wAttn = ph.group_attn?.writer    || {};
    const cAttn = ph.group_attn?.canceller || {};

    host.innerHTML = `
      <div class="disc-grid">
        ${buildWriterCardHTML(writer, wAttn, state.cellId)}
        ${buildCancellerCardHTML(canc, cAttn, state.cellId)}
      </div>
      <p class="hint mono" style="text-align: left; margin-top: 8px;">*group-mean attention mass over all writers / cancellers in this cell (per-head bucket data not in extracted JSON).</p>
    `;

    const maxDLA = getMaxDLA();
    const wPct = Math.min(100, Math.abs(writer.dla) / maxDLA * 100);
    const cPct = Math.min(100, Math.abs(canc.dla)   / maxDLA * 100);
    const wCard = host.querySelector('[data-side="writer"]');
    const cCard = host.querySelector('[data-side="canceller"]');
    if (wCard) animateBars(wCard, [wPct, (wAttn.demo_label||0)*100, (wAttn.format_prefix||0)*100]);
    if (cCard) animateBars(cCard, [cPct, (cAttn.demo_label||0)*100, (cAttn.format_prefix||0)*100]);
  }

  function renderWriter() {
    const host = document.getElementById(HOST_ID);
    if (!host) return;
    const ph = D.perHead?.[state.cellId];
    if (!ph) return;
    const writer = ph.writers[state.writerIdx] || ph.writers[0];
    if (!writer) return;
    const wAttn = ph.group_attn?.writer || {};
    const wCard = host.querySelector('[data-side="writer"]');
    if (!wCard) { renderAll(); return; }

    // Swap writer card only
    const wrapper = document.createElement("div");
    wrapper.innerHTML = buildWriterCardHTML(writer, wAttn, state.cellId);
    const newCard = wrapper.firstElementChild;
    wCard.replaceWith(newCard);

    const maxDLA = getMaxDLA();
    const wPct = Math.min(100, Math.abs(writer.dla) / maxDLA * 100);
    animateBars(newCard, [wPct, (wAttn.demo_label||0)*100, (wAttn.format_prefix||0)*100]);
  }

  function renderCanceller() {
    const host = document.getElementById(HOST_ID);
    if (!host) return;
    const ph = D.perHead?.[state.cellId];
    if (!ph) return;
    const canc = ph.cancellers[state.cancellerIdx] || ph.cancellers[0];
    if (!canc) return;
    const cAttn = ph.group_attn?.canceller || {};
    const cCard = host.querySelector('[data-side="canceller"]');
    if (!cCard) { renderAll(); return; }

    const wrapper = document.createElement("div");
    wrapper.innerHTML = buildCancellerCardHTML(canc, cAttn, state.cellId);
    const newCard = wrapper.firstElementChild;
    cCard.replaceWith(newCard);

    const maxDLA = getMaxDLA();
    const cPct = Math.min(100, Math.abs(canc.dla) / maxDLA * 100);
    animateBars(newCard, [cPct, (cAttn.demo_label||0)*100, (cAttn.format_prefix||0)*100]);
  }

  return { init: renderAll, replay: renderAll };
})();

// ============================================================
//  Generic SVG helpers
// ============================================================
function svgSetup(host, vbW, vbH) {
  d3.select(host).selectAll("*").remove();
  const svg = d3.select(host).append("svg")
    .attr("viewBox", `0 0 ${vbW} ${vbH}`)
    .attr("preserveAspectRatio", "xMidYMid meet");
  return svg;
}

// ============================================================
//  2. Forest plot — 6 main cells × {W, C, both} with CIs
// ============================================================
const Forest = (() => {
  const HOST_ID = "forest-chart";
  let strategy = "zero";   // "zero" or "mean"

  function getHintText() {
    if (strategy === "zero") {
      return "Canonical verdict holds in all 6 cells under zero-strategy ablation.";
    }
    return "Mean strategy: canonical in 5 / 6 cells; mod-1.4B canceller magnitude (+0.09) sits just below the 0.10 threshold.";
  }

  function render() {
    const host = document.getElementById(HOST_ID);
    if (!host || !D.groupLesion || !D.mainCells) return;

    // Update hint
    const hint = document.getElementById("forest-hint");
    if (hint) hint.textContent = getHintText();

    const cells = D.mainCells;   // 6 cells in display order
    const rows = [];
    cells.forEach(c => {
      const g = D.groupLesion[c.id]; if (!g) return;
      const s = (strategy === "zero" ? g.zero : g.mean) || {};
      rows.push({
        cell:   c.id, task: c.task,
        W:      s.W_shift,    W_ci:    s.W_ci    || null,
        C:      s.C_shift,    C_ci:    s.C_ci    || null,
        Both:   s.both_shift, Both_ci: s.both_ci || null,
        nW:     g.n_writers, nC: g.n_cancellers,
      });
    });

    const M = { top: 30, right: 70, bottom: 50, left: 90 };
    const vbW = 980, vbH = 460;
    const W = vbW - M.left - M.right;
    const H = vbH - M.top  - M.bottom;
    const svg = svgSetup(host, vbW, vbH);
    const g   = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);

    // x domain — symmetric, with padding
    const allVals = rows.flatMap(r => [
      r.W, r.W_ci?.[0], r.W_ci?.[1],
      r.C, r.C_ci?.[0], r.C_ci?.[1],
      r.Both, r.Both_ci?.[0], r.Both_ci?.[1],
    ]).filter(v => v != null && isFinite(v));
    const ext = d3.extent(allVals);
    const m = Math.max(Math.abs(ext[0]), Math.abs(ext[1])) + 0.15;
    const x = d3.scaleLinear().domain([-m, m]).range([0, W]);
    const y = d3.scaleBand().domain(rows.map(r => r.cell)).range([0, H]).padding(0.45);
    const yMid = c => y(c) + y.bandwidth() / 2;
    const offset = y.bandwidth() / 3;   // vertical separation of W/C/both within a cell row

    // X axis
    const xAxis = d3.axisBottom(x).ticks(7).tickSize(-H).tickFormat(d => (d>=0?"+":"")+d.toFixed(2));
    g.append("g").attr("class", "axis")
      .attr("transform", `translate(0,${H})`)
      .call(xAxis)
      .call(s => s.selectAll(".tick line").attr("class", "gridline"))
      .call(s => s.select(".domain").remove());

    // Reference line at x=0
    g.append("line").attr("class", "ref-line")
      .attr("x1", x(0)).attr("x2", x(0))
      .attr("y1", -8).attr("y2", H + 8);

    // Row labels
    g.selectAll(".row-label").data(rows).enter().append("text")
      .attr("class", "row-label")
      .attr("x", -10).attr("y", d => yMid(d.cell))
      .attr("text-anchor", "end")
      .attr("dy", "0.32em")
      .text(d => d.cell);

    // Sub-row labels (W / C / J)
    function drawSeries(key, ciKey, color, role, label, dyOff, baseDelay) {
      const sel = g.selectAll(`.series-${key}`).data(rows).enter()
        .append("g")
        .attr("class", `series-${key}`)
        .attr("transform", d => `translate(0,${yMid(d.cell) + dyOff})`);

      // CI line — animate from point outward to both CI bounds
      sel.append("line")
        .attr("x1", d => x(d[key])).attr("x2", d => x(d[key]))
        .attr("y1", 0).attr("y2", 0)
        .attr("stroke", color).attr("stroke-width", 2.2)
        .attr("opacity", 0.85)
        .transition().delay((d, i) => baseDelay + i * 60).duration(550)
        .attr("x1", d => x(d[ciKey]?.[0] ?? d[key]))
        .attr("x2", d => x(d[ciKey]?.[1] ?? d[key]));

      // Bookend ticks (fade in)
      sel.append("line")
        .attr("x1", d => x(d[ciKey]?.[0] ?? d[key])).attr("x2", d => x(d[ciKey]?.[0] ?? d[key]))
        .attr("y1", -5).attr("y2", 5)
        .attr("stroke", color).attr("stroke-width", 1.2)
        .attr("opacity", 0)
        .transition().delay((d, i) => baseDelay + 400 + i * 60).duration(220)
        .attr("opacity", 1);
      sel.append("line")
        .attr("x1", d => x(d[ciKey]?.[1] ?? d[key])).attr("x2", d => x(d[ciKey]?.[1] ?? d[key]))
        .attr("y1", -5).attr("y2", 5)
        .attr("stroke", color).attr("stroke-width", 1.2)
        .attr("opacity", 0)
        .transition().delay((d, i) => baseDelay + 400 + i * 60).duration(220)
        .attr("opacity", 1);

      // Point — fade + scale in last
      sel.append("circle")
        .attr("cx", d => x(d[key])).attr("cy", 0)
        .attr("r", 0)
        .attr("fill", color)
        .attr("stroke", "white").attr("stroke-width", 1.5)
        .style("cursor", "pointer")
        .on("pointerenter", function (e, d) {
          showTip(`<b>${d.cell}</b> · ${label}<br/>shift = ${fmt2(d[key])}` +
                  (d[ciKey] ? `<br/>95% CI [${fmt2(d[ciKey][0])}, ${fmt2(d[ciKey][1])}]` : ""), e);
        })
        .on("pointermove", e => {
          tooltip.style.left = (e.clientX + 12) + "px";
          tooltip.style.top  = (e.clientY + 12) + "px";
        })
        .on("pointerleave", hideTip)
        .transition().delay((d, i) => baseDelay + 200 + i * 60).duration(280)
        .attr("r", 5);

      // Value label (fade in)
      sel.append("text")
        .attr("class", "value-label")
        .attr("x", d => x(Math.max(d[key], d[ciKey]?.[1] ?? d[key])) + 8)
        .attr("y", 0).attr("dy", "0.32em")
        .text(d => fmt2(d[key]))
        .attr("opacity", 0)
        .transition().delay((d, i) => baseDelay + 500 + i * 60).duration(220)
        .attr("opacity", 1);
    }

    drawSeries("W",    "W_ci",    "var(--writer)",    "w", "ablate W", -offset, 100);
    drawSeries("C",    "C_ci",    "var(--canceller)", "c", "ablate C", 0,        250);
    drawSeries("Both", "Both_ci", "var(--joint)",     "j", "joint",   +offset,  400);

    // Highlight mod-1.4B if mean strategy (boundary case)
    if (strategy === "mean") {
      const row = rows.find(r => r.cell === "mod-1.4B");
      if (row) {
        g.append("rect")
          .attr("x", -M.left + 14).attr("y", y(row.cell) - 4)
          .attr("width", W + M.left + M.right - 28)
          .attr("height", y.bandwidth() + 8)
          .attr("fill", "var(--accent)")
          .attr("opacity", 0.06)
          .attr("rx", 6)
          .lower();
      }
    }

    // X-axis title
    svg.append("text")
      .attr("class", "tick-label")
      .attr("x", M.left + W / 2)
      .attr("y", vbH - 12)
      .attr("text-anchor", "middle")
      .style("fill", "var(--text-mute)")
      .text("Δℓ(correct − incorrect)   nats");

    // Mini legend (top right of plot)
    const legendItems = [
      { c: "var(--writer)",    t: "ablate writers",    w: 130 },
      { c: "var(--canceller)", t: "ablate cancellers", w: 150 },
      { c: "var(--joint)",     t: "joint",              w: 60 },
    ];
    const totalLegendW = legendItems.reduce((s, it) => s + it.w, 0);
    const lg = svg.append("g").attr("transform", `translate(${M.left + W - totalLegendW}, ${M.top - 6})`);
    let xOff = 0;
    legendItems.forEach((it) => {
      const gi = lg.append("g").attr("transform", `translate(${xOff}, 0)`);
      gi.append("circle").attr("cx", 6).attr("cy", 6).attr("r", 4).attr("fill", it.c);
      gi.append("text").attr("class", "tick-label").attr("x", 16).attr("y", 6).attr("dy", "0.32em")
        .style("fill", "var(--text-mute)").text(it.t);
      xOff += it.w;
    });
  }

  function setStrategy(s) {
    if (s !== "zero" && s !== "mean") return;
    strategy = s;
    render();
  }

  return { init: render, replay: render, setStrategy };
})();

// ============================================================
//  3. Everywhere chart — 15 cells verdict (W shift vs C shift)
// ============================================================
const Everywhere = (() => {
  const HOST_ID = "everywhere-chart";
  const FAM_COLOR = {
    "Pythia":        "var(--accent)",
    "Qwen2.5":       "var(--canceller)",
    "GPT-2-medium":  "var(--writer)",
  };

  function render() {
    const host = document.getElementById(HOST_ID);
    if (!host || !D.scaleExtension || !D.groupLesion) return;

    // Build a unified list of all 15 cells with W_shift, C_shift, verdict, family
    const all = [];
    for (const c of D.mainCells) {
      const g = D.groupLesion[c.id]; if (!g) continue;
      const z = g.zero || {};
      all.push({
        id: c.id, family: "Pythia (main)", task: c.task, size: c.size,
        W: z.W_shift, C: z.C_shift, verdict: "canonical",
      });
    }
    for (const c of D.extensionCells) {
      const s = D.scaleExtension[c.id]; if (!s) continue;
      all.push({
        id: c.id, family: c.family, task: c.task, size: c.size,
        W: s.W_shift, C: s.C_shift, verdict: c.verdict,
      });
    }

    const M = { top: 30, right: 30, bottom: 60, left: 64 };
    const vbW = 980, vbH = 440;
    const W = vbW - M.left - M.right;
    const H = vbH - M.top - M.bottom;
    const svg = svgSetup(host, vbW, vbH);
    const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);

    // Quadrant: x = W_shift (negative on left, expected for writers); y = C_shift (positive up)
    const xs = all.map(d => d.W).filter(v => v != null);
    const ys = all.map(d => d.C).filter(v => v != null);
    const xExt = d3.extent(xs);
    const yExt = d3.extent(ys);
    const xMax = Math.max(Math.abs(xExt[0]), Math.abs(xExt[1])) + 0.1;
    const yMax = Math.max(Math.abs(yExt[0]), Math.abs(yExt[1])) + 0.1;
    const x = d3.scaleLinear().domain([-xMax, 0.05]).range([0, W]);
    const y = d3.scaleLinear().domain([-0.05, yMax]).range([H, 0]);

    // Quadrant shading (canonical region = W<0 & C>0)
    g.append("rect")
      .attr("x", 0).attr("y", 0)
      .attr("width", x(0)).attr("height", y(0))
      .attr("fill", "var(--canceller-soft)")
      .attr("opacity", 0.12);

    // Axes
    g.append("g").attr("class", "axis").attr("transform", `translate(0,${H})`)
      .call(d3.axisBottom(x).ticks(7).tickFormat(d => (d>=0?"+":"")+d.toFixed(2)).tickSize(-H))
      .call(s => s.selectAll(".tick line").attr("class", "gridline"))
      .call(s => s.select(".domain").remove());
    g.append("g").attr("class", "axis")
      .call(d3.axisLeft(y).ticks(6).tickFormat(d => (d>=0?"+":"")+d.toFixed(2)).tickSize(-W))
      .call(s => s.selectAll(".tick line").attr("class", "gridline"))
      .call(s => s.select(".domain").remove());

    // Reference lines at 0
    g.append("line").attr("class", "ref-line").attr("x1", x(0)).attr("x2", x(0)).attr("y1", 0).attr("y2", H);
    g.append("line").attr("class", "ref-line").attr("x1", 0).attr("x2", W).attr("y1", y(0)).attr("y2", y(0));

    // Axis labels
    svg.append("text").attr("class", "tick-label").style("fill", "var(--text-mute)")
      .attr("text-anchor", "middle")
      .attr("x", M.left + W / 2).attr("y", vbH - 14)
      .text("ablate writers → Δℓ (nats)  ←  writers push correct UP");
    svg.append("text").attr("class", "tick-label").style("fill", "var(--text-mute)")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(20, ${M.top + H / 2}) rotate(-90)`)
      .text("ablate cancellers → Δℓ (nats)  →  cancellers push correct DOWN");

    // Points
    const VERDICT_COLOR = d => d.verdict === "canonical" ? FAM_COLOR[d.family] || "var(--accent)" : "var(--verdict-partial)";
    const pts = g.selectAll(".cell-pt").data(all).enter().append("g")
      .attr("class", "cell-pt")
      .attr("transform", d => `translate(${x(d.W)},${y(d.C)})`);

    // Family ordering for stagger: main Pythia first, then ext, then Qwen, then GPT-2
    const FAMILY_ORDER = ["Pythia (main)", "Pythia", "Qwen2.5", "GPT-2-medium"];
    const familyDelay = f => FAMILY_ORDER.indexOf(f) * 160;

    pts.append("circle")
      .attr("r", 0)
      .attr("fill", d => VERDICT_COLOR(d))
      .attr("fill-opacity", d => d.verdict === "canonical" ? 0.85 : 0.4)
      .attr("stroke", d => VERDICT_COLOR(d))
      .attr("stroke-width", 1.8)
      .style("cursor", "pointer")
      .on("pointerenter", (e, d) => showTip(
        `<b>${d.id}</b> · ${d.family} · ${d.task}<br/>` +
        `W shift = ${fmt2(d.W)}<br/>` +
        `C shift = ${fmt2(d.C)}<br/>` +
        `<b>${d.verdict}</b>`, e))
      .on("pointermove", e => {
        tooltip.style.left = (e.clientX + 12) + "px";
        tooltip.style.top  = (e.clientY + 12) + "px";
      })
      .on("pointerleave", hideTip)
      .transition().delay((d, i) => familyDelay(d.family) + (i % 4) * 40).duration(380)
      .attr("r", d => d.family === "Pythia (main)" ? 7 : 5.5);

    pts.append("text").attr("class", "value-label")
      .attr("x", 9).attr("y", 0).attr("dy", "0.32em")
      .style("fill", "var(--text)")
      .style("font-size", "10px")
      .attr("opacity", 0)
      .text(d => d.id.replace(/^(hier|mod)-/, ""))
      .transition().delay((d, i) => familyDelay(d.family) + (i % 4) * 40 + 200).duration(260)
      .attr("opacity", 1);

    // Legend
    const lg = svg.append("g").attr("transform", `translate(${M.left + W - 220}, ${M.top + 6})`);
    const lgItems = [
      { color: "var(--accent)",   label: "Pythia · canonical", r: 6 },
      { color: "var(--canceller)",label: "Qwen2.5 · canonical", r: 5.5 },
      { color: "var(--writer)",   label: "GPT-2 · canonical",   r: 5.5 },
      { color: "var(--verdict-partial)", label: "partial (CI grazes 0)", r: 5.5, hollow: true },
    ];
    lgItems.forEach((it, i) => {
      const gi = lg.append("g").attr("transform", `translate(0, ${i * 18})`);
      gi.append("circle").attr("cx", 6).attr("cy", 6).attr("r", it.r)
        .attr("fill", it.color).attr("fill-opacity", it.hollow ? 0.4 : 0.85);
      gi.append("text").attr("class", "tick-label")
        .attr("x", 18).attr("y", 6).attr("dy", "0.32em")
        .style("fill", "var(--text-mute)")
        .text(it.label);
    });

    // Annotate the canonical region with a label
    g.append("text")
      .attr("class", "tick-label")
      .attr("x", x(-xMax/2)).attr("y", y(yMax/2))
      .attr("text-anchor", "middle")
      .style("fill", "var(--canceller)")
      .style("font-size", "12px")
      .style("font-style", "italic")
      .text("canonical region");
  }

  return { init: render, replay: render };
})();

// ============================================================
//  4. Todd overlap chart — hier vs mod, W and C fractions in top-20
// ============================================================
const Overlap = (() => {
  const HOST_ID = "overlap-chart";

  function render() {
    const host = document.getElementById(HOST_ID);
    if (!host || !D.headline) return;

    const hd = D.headline;
    const rows = [
      { task: "hierarchical-rule task", W: hd.fv_overlap_hier_W, C: hd.fv_overlap_hier_C, nW: 27, nC: 14, wIn: 1, cIn: 9 },
      { task: "modular-rule task",      W: hd.fv_overlap_mod_W,  C: hd.fv_overlap_mod_C,  nW: 27, nC: 13, wIn: 16, cIn: 1 },
    ];

    const M = { top: 30, right: 50, bottom: 50, left: 200 };
    const vbW = 980, vbH = 280;
    const W = vbW - M.left - M.right;
    const H = vbH - M.top - M.bottom;
    const svg = svgSetup(host, vbW, vbH);
    const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);

    const x = d3.scaleLinear().domain([0, 100]).range([0, W]);
    const y = d3.scaleBand().domain(["W-hier", "C-hier", "W-mod", "C-mod"]).range([0, H]).padding(0.3);

    // X axis
    g.append("g").attr("class", "axis").attr("transform", `translate(0,${H})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d => d + "%").tickSize(-H))
      .call(s => s.selectAll(".tick line").attr("class", "gridline"))
      .call(s => s.select(".domain").remove());

    const data = [
      { key: "W-hier", task: "hierarchical-rule task",  pop: "writers (n=27)",    pct: hd.fv_overlap_hier_W, count: "1 / 27",  color: "var(--writer)" },
      { key: "C-hier", task: "hierarchical-rule task",  pop: "cancellers (n=14)", pct: hd.fv_overlap_hier_C, count: "9 / 14",  color: "var(--canceller)" },
      { key: "W-mod",  task: "modular-rule task",       pop: "writers (n=27)",    pct: hd.fv_overlap_mod_W,  count: "16 / 27", color: "var(--writer)" },
      { key: "C-mod",  task: "modular-rule task",       pop: "cancellers (n=13)", pct: hd.fv_overlap_mod_C,  count: "1 / 13",  color: "var(--canceller)" },
    ];

    // Bars
    const bars = g.selectAll(".ov-bar").data(data).enter().append("g")
      .attr("transform", d => `translate(0,${y(d.key)})`);

    bars.append("rect")
      .attr("x", 0).attr("y", 0)
      .attr("width", 0).attr("height", y.bandwidth())
      .attr("fill", d => d.color)
      .attr("opacity", 0.85)
      .attr("rx", 3);

    // Animate fill
    requestAnimationFrame(() => {
      bars.select("rect").transition().duration(900).delay((d, i) => i * 120)
        .attr("width", d => x(d.pct));
    });

    // Row labels (left)
    bars.append("text").attr("class", "row-label")
      .attr("x", -10).attr("y", y.bandwidth() / 2)
      .attr("text-anchor", "end").attr("dy", "0.32em")
      .style("font-size", "12px")
      .text(d => `${d.task} · ${d.pop}`);

    // Value labels (right of bar)
    bars.append("text").attr("class", "value-label")
      .attr("x", d => x(d.pct) + 8).attr("y", y.bandwidth() / 2)
      .attr("dy", "0.32em")
      .style("font-size", "12px")
      .style("fill", "var(--text)")
      .text(d => `${d.pct}%  (${d.count})`);

    // Title bar
    svg.append("text").attr("class", "tick-label").style("fill", "var(--text-mute)")
      .attr("text-anchor", "middle")
      .attr("x", M.left + W / 2).attr("y", vbH - 14)
      .text("fraction captured by Todd's mean-ablation top-20");
  }

  return { init: render, replay: render };
})();

// ============================================================
//  5. QK source chart — 5 buckets W vs C, per cell
// ============================================================
const QK = (() => {
  const HOST_ID = "qk-chart";
  const PICKER_ID = "qk-cell-picker";
  let currentCell = "hier-410M";

  function render() {
    const host = document.getElementById(HOST_ID);
    if (!host || !D.qkSource) return;

    // Build picker
    const picker = document.getElementById(PICKER_ID);
    if (picker && picker.children.length === 0) {
      D.mainCells.forEach(c => {
        const btn = document.createElement("button");
        btn.className = "btn-mini" + (c.id === currentCell ? " active" : "");
        btn.textContent = c.id;
        btn.addEventListener("click", () => {
          currentCell = c.id;
          $$("#" + PICKER_ID + " .btn-mini").forEach(b => b.classList.toggle("active", b.textContent === c.id));
          render();
        });
        picker.appendChild(btn);
      });
    }

    const data = D.qkSource[currentCell];
    if (!data) return;

    const BUCKETS = D.buckets || ["BOS","format_prefix","demo_input","demo_label","query_input"];
    const BUCKET_LABEL = {
      "BOS":           "BOS",
      "format_prefix": "format prefix",
      "demo_input":    "demo input",
      "demo_label":    "demo LABEL",
      "query_input":   "query input",
    };

    const M = { top: 30, right: 40, bottom: 60, left: 110 };
    const vbW = 980, vbH = 320;
    const W = vbW - M.left - M.right;
    const H = vbH - M.top - M.bottom;
    const svg = svgSetup(host, vbW, vbH);
    const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);

    const y = d3.scaleBand().domain(BUCKETS).range([0, H]).padding(0.25);
    const x = d3.scaleLinear().domain([0, 0.55]).range([0, W]);

    // X axis
    g.append("g").attr("class", "axis").attr("transform", `translate(0,${H})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d => (d*100).toFixed(0)+"%").tickSize(-H))
      .call(s => s.selectAll(".tick line").attr("class", "gridline"))
      .call(s => s.select(".domain").remove());

    // Bucket labels (left)
    g.selectAll(".bucket-lbl").data(BUCKETS).enter().append("text")
      .attr("class", "row-label")
      .attr("x", -10).attr("y", d => y(d) + y.bandwidth() / 2)
      .attr("text-anchor", "end").attr("dy", "0.32em")
      .style("font-size", "12px")
      .text(d => BUCKET_LABEL[d] || d);

    // Pairs of bars per bucket: W and C
    const subH = y.bandwidth() / 2 - 2;
    BUCKETS.forEach(bk => {
      const wVal = data.writer[bk]    || 0;
      const cVal = data.canceller[bk] || 0;

      g.append("rect")
        .attr("x", 0).attr("y", y(bk))
        .attr("width", 0).attr("height", subH)
        .attr("fill", "var(--writer)").attr("opacity", 0.8).attr("rx", 2)
        .transition().duration(700).attr("width", x(wVal));

      g.append("text").attr("class", "value-label")
        .attr("x", x(wVal) + 6).attr("y", y(bk) + subH / 2)
        .attr("dy", "0.32em")
        .style("font-size", "11px")
        .style("fill", "var(--text-soft)")
        .text((wVal*100).toFixed(0) + "%");

      g.append("rect")
        .attr("x", 0).attr("y", y(bk) + subH + 4)
        .attr("width", 0).attr("height", subH)
        .attr("fill", "var(--canceller)").attr("opacity", 0.8).attr("rx", 2)
        .transition().duration(700).delay(120).attr("width", x(cVal));

      g.append("text").attr("class", "value-label")
        .attr("x", x(cVal) + 6).attr("y", y(bk) + subH + 4 + subH / 2)
        .attr("dy", "0.32em")
        .style("font-size", "11px")
        .style("fill", "var(--text-soft)")
        .text((cVal*100).toFixed(0) + "%");
    });

    // Legend
    const lg = svg.append("g").attr("transform", `translate(${M.left + W - 240}, ${M.top - 6})`);
    [
      { c: "var(--writer)", t: `writers (n=${data.n_writers})` },
      { c: "var(--canceller)", t: `cancellers (n=${data.n_cancellers})` },
    ].forEach((it, i) => {
      const gi = lg.append("g").attr("transform", `translate(${i * 130}, 0)`);
      gi.append("rect").attr("x", 0).attr("y", 0).attr("width", 12).attr("height", 12)
        .attr("fill", it.c).attr("opacity", 0.85);
      gi.append("text").attr("class", "tick-label").attr("x", 18).attr("y", 6).attr("dy", "0.32em")
        .style("fill", "var(--text-mute)").text(it.t);
    });

    svg.append("text").attr("class", "tick-label").style("fill", "var(--text-mute)")
      .attr("text-anchor", "middle")
      .attr("x", M.left + W / 2).attr("y", vbH - 14)
      .text("mean attention mass at the readout token");
  }

  return { init: render, replay: render };
})();

// ============================================================
//  6. Layer geometry — all heads (W + C) by layer, sized by |DLA|
//     Lines connect each canceller to its earliest upstream writer
// ============================================================
const LayerGeometry = (() => {
  const HOST_ID = "layer-chart";
  const PICKER_ID = "layer-cell-picker";
  let currentCell = "hier-410M";

  function render() {
    const host = document.getElementById(HOST_ID);
    if (!host || !D.perHead) return;

    // Build picker (once)
    const picker = document.getElementById(PICKER_ID);
    if (picker && picker.children.length === 0) {
      D.mainCells.forEach(c => {
        const btn = document.createElement("button");
        btn.className = "btn-mini" + (c.id === currentCell ? " active" : "");
        btn.textContent = c.id;
        btn.addEventListener("click", () => {
          currentCell = c.id;
          $$("#" + PICKER_ID + " .btn-mini").forEach(b => b.classList.toggle("active", b.textContent === c.id));
          render();
        });
        picker.appendChild(btn);
      });
    }

    const ph = D.perHead[currentCell];
    if (!ph) return;

    // n_layers comes from cells like Pythia-410M = 24 layers.
    const N_LAYERS = {"410M": 24, "1B": 16, "1.4B": 24}[currentCell.split("-")[1]] || 24;

    const M = { top: 30, right: 30, bottom: 56, left: 60 };
    const vbW = 980, vbH = 360;
    const W = vbW - M.left - M.right;
    const H = vbH - M.top - M.bottom;
    const svg = svgSetup(host, vbW, vbH);
    const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);

    const x = d3.scaleLinear().domain([-0.5, N_LAYERS - 0.5]).range([0, W]);
    // y-jitter for visual separation within a layer
    const yPx = (h, role) => {
      const offset = role === "W" ? -1 : 1;
      const idx = h.H % 8;
      return H * (0.5 + offset * 0.18 + (idx - 4) * 0.04);
    };
    const sizeScale = d3.scaleSqrt()
      .domain([0, Math.max(0.05, d3.max([...ph.writers, ...ph.cancellers], h => Math.abs(h.dla || 0)) || 0.05)])
      .range([2, 14]);

    // Axes
    g.append("g").attr("class", "axis").attr("transform", `translate(0,${H})`)
      .call(d3.axisBottom(x).ticks(Math.min(N_LAYERS, 12)).tickFormat(d => d).tickSize(-H))
      .call(s => s.selectAll(".tick line").attr("class", "gridline"))
      .call(s => s.select(".domain").remove());

    // Mid baseline
    g.append("line").attr("class", "ref-line")
      .attr("x1", 0).attr("x2", W)
      .attr("y1", H/2).attr("y2", H/2)
      .attr("stroke", "var(--line-soft)")
      .attr("stroke-dasharray", "none");

    // Compute upstream writer link for each canceller (closest writer with L < L_c)
    const links = [];
    ph.cancellers.forEach(c => {
      const upstream = ph.writers
        .filter(w => w.L < c.L)
        .sort((a, b) => b.L - a.L)[0];   // closest below
      if (upstream) {
        links.push({ c, w: upstream });
      }
    });

    // 1) Writers fade + scale in
    g.selectAll(".w-pt").data(ph.writers).enter().append("circle")
      .attr("cx", d => x(d.L))
      .attr("cy", d => yPx(d, "W"))
      .attr("r", 0)
      .attr("fill", "var(--writer)")
      .attr("fill-opacity", 0.75)
      .attr("stroke", "var(--writer)").attr("stroke-width", 1.2)
      .style("cursor", "pointer")
      .on("pointerenter", (e, d) => showTip(
        `<b>${d.id}</b> · writer<br/>DLA = ${fmt3(d.dla)}<br/>z = ${(d.z || 0).toFixed(2)}`, e))
      .on("pointermove", e => {
        tooltip.style.left = (e.clientX + 12) + "px";
        tooltip.style.top  = (e.clientY + 12) + "px";
      })
      .on("pointerleave", hideTip)
      .transition().delay((d, i) => 100 + i * 50).duration(380)
      .attr("r", d => sizeScale(Math.abs(d.dla)));

    const writersDelay = 100 + ph.writers.length * 50;

    // 2) Cancellers fade + scale in
    g.selectAll(".c-pt").data(ph.cancellers).enter().append("circle")
      .attr("cx", d => x(d.L))
      .attr("cy", d => yPx(d, "C"))
      .attr("r", 0)
      .attr("fill", "var(--canceller)")
      .attr("fill-opacity", 0.75)
      .attr("stroke", "var(--canceller)").attr("stroke-width", 1.2)
      .style("cursor", "pointer")
      .on("pointerenter", (e, d) => showTip(
        `<b>${d.id}</b> · canceller<br/>DLA = ${fmt3(d.dla)}<br/>z = ${(d.z || 0).toFixed(2)}`, e))
      .on("pointermove", e => {
        tooltip.style.left = (e.clientX + 12) + "px";
        tooltip.style.top  = (e.clientY + 12) + "px";
      })
      .on("pointerleave", hideTip)
      .transition().delay((d, i) => writersDelay + i * 70).duration(380)
      .attr("r", d => sizeScale(Math.abs(d.dla)));

    const cancellersDelay = writersDelay + ph.cancellers.length * 70;

    // 3) Links — dashed, NOT causal V-cascade. See hint below chart.
    g.selectAll(".link").data(links).enter().append("line")
      .attr("class", "link")
      .attr("x1", d => x(d.w.L))
      .attr("y1", d => yPx(d.w, "W"))
      .attr("x2", d => x(d.w.L))   // start collapsed at writer
      .attr("y2", d => yPx(d.w, "W"))
      .attr("stroke", "var(--text-faint)")
      .attr("stroke-width", 0.6)
      .attr("stroke-dasharray", "2,3")
      .attr("opacity", 0)
      .lower()
      .transition().delay((d, i) => cancellersDelay + i * 50).duration(400)
      .attr("x2", d => x(d.c.L))
      .attr("y2", d => yPx(d.c, "C"))
      .attr("opacity", 0.55);

    // Labels (W / C zone)
    g.append("text")
      .attr("x", 6).attr("y", H * 0.18)
      .style("font-family", "var(--font-mono)").style("font-size", "10px").style("fill", "var(--writer)")
      .text("WRITERS");
    g.append("text")
      .attr("x", 6).attr("y", H * 0.86)
      .style("font-family", "var(--font-mono)").style("font-size", "10px").style("fill", "var(--canceller)")
      .text("CANCELLERS");

    // X axis label
    svg.append("text").attr("class", "tick-label").style("fill", "var(--text-mute)")
      .attr("text-anchor", "middle")
      .attr("x", M.left + W / 2).attr("y", vbH - 14)
      .text(`layer  (0 → ${N_LAYERS-1})  ·  marker size ∝ |DLA|`);
  }

  return { init: render, replay: render };
})();

// ============================================================
//  7. V-shuffle chart — L11.H4 baseline vs shuffled, hier + mod
// ============================================================
const VShuffle = (() => {
  const HOST_ID = "vshuf-chart";

  function render() {
    const host = document.getElementById(HOST_ID);
    if (!host || !D.l11h4) return;

    const data = [
      {
        task: "hier-410M",
        baseline: D.l11h4.v_shuffle_hier?.baseline_dla,
        shuffled: D.l11h4.v_shuffle_hier?.shuffled_dla,
        diff:     D.l11h4.v_shuffle_hier?.diff_mean,
        ci:       D.l11h4.v_shuffle_hier?.diff_ci,
        collapsePct: 82,
      },
      {
        task: "mod-410M",
        baseline: D.l11h4.v_shuffle_mod?.baseline_dla,
        shuffled: D.l11h4.v_shuffle_mod?.shuffled_dla,
        diff:     D.l11h4.v_shuffle_mod?.diff_mean,
        ci:       D.l11h4.v_shuffle_mod?.diff_ci,
        collapsePct: 53,
      },
    ].filter(d => d.baseline != null);

    const M = { top: 26, right: 24, bottom: 50, left: 96 };
    const vbW = 480, vbH = 280;
    const W = vbW - M.left - M.right;
    const H = vbH - M.top - M.bottom;
    const svg = svgSetup(host, vbW, vbH);
    const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);

    const yKeys = data.flatMap(d => [d.task + " · baseline", d.task + " · V-shuf"]);
    const y = d3.scaleBand().domain(yKeys).range([0, H]).padding(0.35);
    const x = d3.scaleLinear().domain([-0.30, 0.05]).range([0, W]);

    g.append("g").attr("class", "axis").attr("transform", `translate(0,${H})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => (d>=0?"+":"")+d.toFixed(2)).tickSize(-H))
      .call(s => s.selectAll(".tick line").attr("class", "gridline"))
      .call(s => s.select(".domain").remove());

    g.append("line").attr("class", "ref-line").attr("x1", x(0)).attr("x2", x(0)).attr("y1", 0).attr("y2", H);

    data.forEach(d => {
      const yB = d.task + " · baseline";
      const yS = d.task + " · V-shuf";

      // Baseline bar (negative — extends left)
      g.append("rect")
        .attr("x", x(Math.min(0, d.baseline)))
        .attr("y", y(yB))
        .attr("width", 0)
        .attr("height", y.bandwidth())
        .attr("fill", "var(--canceller)").attr("opacity", 0.85).attr("rx", 3)
        .transition().duration(700)
        .attr("width", Math.abs(x(d.baseline) - x(0)));

      // V-shuf bar
      g.append("rect")
        .attr("x", x(Math.min(0, d.shuffled)))
        .attr("y", y(yS))
        .attr("width", 0)
        .attr("height", y.bandwidth())
        .attr("fill", "var(--accent-soft)").attr("opacity", 0.85).attr("rx", 3)
        .transition().duration(700).delay(140)
        .attr("width", Math.abs(x(d.shuffled) - x(0)));

      // Value labels
      g.append("text").attr("class", "value-label")
        .attr("x", x(d.baseline) - 6).attr("y", y(yB) + y.bandwidth() / 2)
        .attr("text-anchor", "end").attr("dy", "0.32em")
        .style("fill", "var(--text)")
        .text(fmt3(d.baseline));

      g.append("text").attr("class", "value-label")
        .attr("x", x(d.shuffled) - 6).attr("y", y(yS) + y.bandwidth() / 2)
        .attr("text-anchor", "end").attr("dy", "0.32em")
        .style("fill", "var(--text)")
        .text(fmt3(d.shuffled));

      // Collapse label
      g.append("text")
        .attr("x", x(0) + 8).attr("y", (y(yB) + y(yS)) / 2 + y.bandwidth() / 2)
        .attr("dy", "0.32em")
        .style("font-family", "var(--font-mono)")
        .style("font-size", "11px")
        .style("fill", "var(--writer)")
        .style("font-weight", "bold")
        .text(`−${d.collapsePct}% collapse`);
    });

    // Row labels (left)
    g.selectAll(".disp-lbl").data(yKeys).enter().append("text")
      .attr("class", "row-label")
      .attr("x", -10).attr("y", d => y(d) + y.bandwidth() / 2)
      .attr("text-anchor", "end").attr("dy", "0.32em")
      .style("font-size", "11.5px")
      .text(d => d);

    svg.append("text").attr("class", "tick-label").style("fill", "var(--text-mute)")
      .attr("text-anchor", "middle")
      .attr("x", M.left + W / 2).attr("y", vbH - 12)
      .text("L11.H4 mean DLA (nats)");
  }

  return { init: render, replay: render };
})();

// ============================================================
//  8. OV spectrum — first 12 modes
//     Toggle: signed contrib (σₖ × cos(uₖ,u))  /  raw σₖ
// ============================================================
const OV = (() => {
  const HOST_ID = "ov-chart";
  let mode = "signed";   // "signed" or "raw"

  function render() {
    const host = document.getElementById(HOST_ID);
    if (!host || !D.l11h4 || !D.l11h4.ov_spectrum) return;

    const spectrum = D.l11h4.ov_spectrum;
    const modes = (spectrum.modes || []).slice(0, 12);
    if (!modes.length) return;

    const M = { top: 26, right: 24, bottom: 60, left: 50 };
    const vbW = 480, vbH = 280;
    const W = vbW - M.left - M.right;
    const H = vbH - M.top - M.bottom;
    const svg = svgSetup(host, vbW, vbH);
    const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);

    const valueOf = d => mode === "signed" ? d.signed : d.sigma;
    const allVals = modes.map(valueOf);
    const x = d3.scaleBand().domain(modes.map(m => m.mode)).range([0, W]).padding(0.25);

    let yDomain;
    if (mode === "signed") {
      const yExt = d3.extent(allVals);
      const yMax = Math.max(Math.abs(yExt[0]), Math.abs(yExt[1])) * 1.1;
      yDomain = [-yMax, yMax];
    } else {
      yDomain = [0, d3.max(allVals) * 1.1];
    }
    const y = d3.scaleLinear().domain(yDomain).range([H, 0]);

    g.append("g").attr("class", "axis").attr("transform", `translate(0,${y(0)})`)
      .call(d3.axisBottom(x).tickFormat(d => "k=" + d))
      .call(s => s.selectAll(".tick line").remove());
    g.append("g").attr("class", "axis")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => d.toFixed(2)).tickSize(-W))
      .call(s => s.selectAll(".tick line").attr("class", "gridline"))
      .call(s => s.select(".domain").remove());

    if (mode === "signed") {
      g.append("line").attr("class", "ref-line").attr("x1", 0).attr("x2", W).attr("y1", y(0)).attr("y2", y(0));
    }

    const baselineY = mode === "signed" ? y(0) : y(yDomain[0]);
    g.selectAll(".mode-bar").data(modes).enter().append("rect")
      .attr("x", d => x(d.mode))
      .attr("y", baselineY)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", d => mode === "signed"
        ? (d.signed < 0 ? "var(--canceller)" : "var(--writer)")
        : "var(--accent)")
      .attr("opacity", 0.85)
      .transition().delay((d, i) => 100 + i * 50).duration(450)
      .attr("y", d => {
        const v = valueOf(d);
        return v >= 0 ? y(v) : y(0);
      })
      .attr("height", d => {
        const v = valueOf(d);
        return Math.abs(y(v) - baselineY);
      })
      .selection()
      .style("cursor", "pointer")
      .on("pointerenter", (e, d) => showTip(
        `<b>Mode k = ${d.mode}</b><br/>` +
        `σ = ${d.sigma.toFixed(3)}<br/>` +
        `cos(u_k, u) = ${d.cos >= 0 ? "+" : ""}${d.cos.toFixed(3)}<br/>` +
        `signed contrib = ${fmt3(d.signed)}`, e))
      .on("pointermove", e => {
        tooltip.style.left = (e.clientX + 12) + "px";
        tooltip.style.top  = (e.clientY + 12) + "px";
      })
      .on("pointerleave", hideTip);

    svg.append("text").attr("class", "tick-label")
      .attr("text-anchor", "middle")
      .attr("x", M.left + W / 2).attr("y", vbH - 18)
      .style("fill", "var(--text-mute)")
      .style("font-size", "11px")
      .text(mode === "signed"
        ? `mode k · top-1 Frobenius share = ${(spectrum.top1_share*100).toFixed(1)}%`
        : `raw singular values · spectrum is flat — no rank-1 plateau`);

    svg.append("text").attr("class", "tick-label")
      .attr("transform", `translate(14, ${M.top + H / 2}) rotate(-90)`)
      .attr("text-anchor", "middle")
      .style("fill", "var(--text-mute)")
      .style("font-size", "11px")
      .text(mode === "signed" ? "σₖ × cos(uₖ, u)" : "σₖ");
  }

  function setMode(m) {
    if (m !== "signed" && m !== "raw") return;
    mode = m;
    render();
  }

  return { init: render, replay: render, setMode };
})();

// ============================================================
//  8b. Cross-template panel — L11.H4 solo ablation across 4 templates
// ============================================================
const CrossTemplate = (() => {
  const HOST_ID = "crosstpl-chart";

  function render() {
    const host = document.getElementById(HOST_ID);
    if (!host || !D.l11h4CrossTemplate) return;

    const ct = D.l11h4CrossTemplate;
    const TEMPLATES = [
      { id: "hier",            label: "hier-410M" },
      { id: "mod",             label: "mod-410M"  },
      { id: "antonym",         label: "antonym"   },
      { id: "country_capital", label: "country-capital" },
    ];
    const data = TEMPLATES.map(t => {
      const d = ct[t.id] || {};
      return {
        template: t.label,
        shift:    d.shift,
        ci:       d.ci,
        role:     d.role || "null",
      };
    }).filter(d => d.shift != null);

    const ROLE_COLOR = {
      "canceller": "var(--canceller)",
      "writer":    "var(--writer)",
      "null":      "var(--joint)",
    };

    const M = { top: 26, right: 24, bottom: 60, left: 60 };
    const vbW = 980, vbH = 340;
    const W = vbW - M.left - M.right;
    const H = vbH - M.top - M.bottom;
    const svg = svgSetup(host, vbW, vbH);
    const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);

    const x = d3.scaleBand().domain(data.map(d => d.template)).range([0, W]).padding(0.35);
    const yMax = Math.max(...data.flatMap(d => [Math.abs(d.shift), Math.abs(d.ci?.[0] ?? 0), Math.abs(d.ci?.[1] ?? 0)])) * 1.15;
    const y = d3.scaleLinear().domain([-yMax, yMax]).range([H, 0]);

    g.append("g").attr("class", "axis").attr("transform", `translate(0,${y(0)})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call(s => s.select(".domain").attr("stroke", "var(--line-strong)"));
    g.append("g").attr("class", "axis")
      .call(d3.axisLeft(y).ticks(7).tickFormat(d => (d>=0?"+":"")+d.toFixed(2)).tickSize(-W))
      .call(s => s.selectAll(".tick line").attr("class", "gridline"))
      .call(s => s.select(".domain").remove());

    // Zero baseline
    g.append("line").attr("class", "ref-line")
      .attr("x1", 0).attr("x2", W)
      .attr("y1", y(0)).attr("y2", y(0));

    // Bars
    const sel = g.selectAll(".tpl-bar").data(data).enter().append("g")
      .attr("transform", d => `translate(${x(d.template)},0)`);

    sel.append("rect")
      .attr("x", 0)
      .attr("y", d => d.shift >= 0 ? y(d.shift) : y(0))
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", d => ROLE_COLOR[d.role])
      .attr("opacity", 0.85)
      .attr("rx", 3)
      .transition().duration(800).delay((d, i) => i * 140)
      .attr("height", d => Math.abs(y(d.shift) - y(0)));

    // CI error bars
    sel.filter(d => d.ci).append("line")
      .attr("x1", x.bandwidth() / 2).attr("x2", x.bandwidth() / 2)
      .attr("y1", d => y(d.ci[0])).attr("y2", d => y(d.ci[1]))
      .attr("stroke", "var(--text)").attr("stroke-width", 1.6)
      .attr("opacity", 0)
      .transition().delay(900).duration(400).attr("opacity", 0.7);

    sel.filter(d => d.ci).each(function (d) {
      const sg = d3.select(this);
      const halfW = 7;
      [d.ci[0], d.ci[1]].forEach(v => {
        sg.append("line")
          .attr("x1", x.bandwidth() / 2 - halfW).attr("x2", x.bandwidth() / 2 + halfW)
          .attr("y1", y(v)).attr("y2", y(v))
          .attr("stroke", "var(--text)").attr("stroke-width", 1.4)
          .attr("opacity", 0)
          .transition().delay(900).duration(400).attr("opacity", 0.7);
      });
    });

    // Value labels
    sel.append("text")
      .attr("x", x.bandwidth() / 2)
      .attr("y", d => d.shift >= 0 ? y(d.shift) - 8 : y(d.shift) + 16)
      .attr("text-anchor", "middle")
      .style("font-family", "var(--font-mono)").style("font-size", "12px")
      .style("fill", "var(--text)")
      .style("opacity", 0)
      .text(d => (d.shift >= 0 ? "+" : "") + d.shift.toFixed(3))
      .transition().delay(800).duration(400).style("opacity", 1);

    // Role tags below bars (above x-axis labels)
    sel.append("text")
      .attr("x", x.bandwidth() / 2)
      .attr("y", H + 22)
      .attr("text-anchor", "middle")
      .style("font-family", "var(--font-mono)").style("font-size", "10px")
      .style("letter-spacing", "0.12em").style("text-transform", "uppercase")
      .style("fill", d => ROLE_COLOR[d.role])
      .text(d => d.role);

    // Sign-flip annotation between mod and antonym
    const idxMod = data.findIndex(d => d.template === "mod-410M");
    const idxAnt = data.findIndex(d => d.template === "antonym");
    if (idxMod !== -1 && idxAnt !== -1) {
      const xMid = (x("mod-410M") + x.bandwidth() + x("antonym")) / 2;
      g.append("text")
        .attr("x", xMid).attr("y", y(0) - 4)
        .attr("text-anchor", "middle")
        .style("font-family", "var(--font-display)")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .style("fill", "var(--accent)")
        .text("sign flips →");
    }

    // Axis labels
    svg.append("text").attr("class", "tick-label").style("fill", "var(--text-mute)")
      .attr("transform", `translate(16, ${M.top + H / 2}) rotate(-90)`)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .text("L11.H4 solo ablation Δℓ  (nats)");

    svg.append("text").attr("class", "tick-label").style("fill", "var(--text-mute)")
      .attr("text-anchor", "middle")
      .attr("x", M.left + W / 2).attr("y", vbH - 14)
      .text("template");
  }

  return { init: render, replay: render };
})();

// ============================================================
//  9. Intervention chart — canceller ablation accuracy + logit
// ============================================================
const Intervention = (() => {
  const HOST_ID = "intervention-chart";

  function render() {
    const host = document.getElementById(HOST_ID);
    if (!host || !D.ablationAccuracy) return;

    const rows = D.mainCells.map(c => {
      const a = D.ablationAccuracy[c.id] || {};
      const C = a.C || {};
      return {
        cell:    c.id,
        baseline: a.baseline_acc,
        deltaAcc: C.delta_acc,
        ci:       C.ci_95,
        logit:    C.logit_shift,
      };
    });

    const M = { top: 30, right: 80, bottom: 60, left: 90 };
    const vbW = 980, vbH = 340;
    const W = vbW - M.left - M.right;
    const H = vbH - M.top - M.bottom;
    const svg = svgSetup(host, vbW, vbH);
    const g = svg.append("g").attr("transform", `translate(${M.left},${M.top})`);

    const y = d3.scaleBand().domain(rows.map(r => r.cell)).range([0, H]).padding(0.4);
    const xMaxAbs = Math.max(...rows.flatMap(r => [r.ci?.[0] ?? 0, r.ci?.[1] ?? 0, r.deltaAcc ?? 0].map(Math.abs)));
    const xMax = Math.ceil((xMaxAbs + 0.02) * 100) / 100;
    const x = d3.scaleLinear().domain([-0.06, xMax]).range([0, W]);

    g.append("g").attr("class", "axis").attr("transform", `translate(0,${H})`)
      .call(d3.axisBottom(x).ticks(7).tickFormat(d => (d>=0?"+":"")+(d*100).toFixed(0)+" pp").tickSize(-H))
      .call(s => s.selectAll(".tick line").attr("class", "gridline"))
      .call(s => s.select(".domain").remove());

    g.append("line").attr("class", "ref-line").attr("x1", x(0)).attr("x2", x(0)).attr("y1", 0).attr("y2", H);

    // Row labels with logit shift annotation
    g.selectAll(".cell-lbl").data(rows).enter().append("text")
      .attr("class", "row-label")
      .attr("x", -10).attr("y", d => y(d.cell) + y.bandwidth() / 2)
      .attr("text-anchor", "end").attr("dy", "0.32em")
      .style("font-size", "12px")
      .text(d => d.cell);

    // CI bars + point + value
    const sel = g.selectAll(".int-row").data(rows).enter().append("g")
      .attr("transform", d => `translate(0,${y(d.cell) + y.bandwidth() / 2})`);

    // CI line — animate outward from the point
    sel.append("line")
      .attr("x1", d => x(d.deltaAcc)).attr("x2", d => x(d.deltaAcc))
      .attr("y1", 0).attr("y2", 0)
      .attr("stroke", "var(--canceller)").attr("stroke-width", 2.4).attr("opacity", 0.5)
      .transition().delay((d, i) => 150 + i * 90).duration(550)
      .attr("x1", d => x(d.ci?.[0] ?? d.deltaAcc))
      .attr("x2", d => x(d.ci?.[1] ?? d.deltaAcc));

    // Point — scale in
    sel.append("circle")
      .attr("cx", d => x(d.deltaAcc)).attr("cy", 0)
      .attr("r", 0)
      .attr("fill", "var(--canceller)")
      .attr("stroke", "white").attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .on("pointerenter", (e, d) => showTip(
        `<b>${d.cell}</b><br/>baseline acc = ${(d.baseline*100).toFixed(1)}%<br/>` +
        `Δacc = ${fmtPct(d.deltaAcc)}` + (d.ci ? ` [${fmtPct(d.ci[0])}, ${fmtPct(d.ci[1])}]` : "") + `<br/>` +
        `logit shift = ${fmt3(d.logit)} nats`, e))
      .on("pointermove", e => {
        tooltip.style.left = (e.clientX + 12) + "px";
        tooltip.style.top  = (e.clientY + 12) + "px";
      })
      .on("pointerleave", hideTip)
      .transition().delay((d, i) => 90 + i * 90).duration(320)
      .attr("r", 7);

    // Inline labels — fade in after point
    sel.append("text")
      .attr("class", "value-label")
      .attr("x", d => x(Math.max(d.deltaAcc, d.ci?.[1] ?? d.deltaAcc)) + 8)
      .attr("y", 0).attr("dy", "0.32em")
      .style("fill", "var(--text)")
      .style("font-size", "12px")
      .attr("opacity", 0)
      .text(d => `${fmtPct(d.deltaAcc)} · ${fmt3(d.logit)} nats`)
      .transition().delay((d, i) => 600 + i * 90).duration(280)
      .attr("opacity", 1);

    svg.append("text").attr("class", "tick-label").style("fill", "var(--text-mute)")
      .attr("text-anchor", "middle")
      .attr("x", M.left + W / 2).attr("y", vbH - 14)
      .text("accuracy change after zero-ablating cancellers  ·  CI 95% (paired bootstrap)");
  }

  return { init: render, replay: render };
})();

// ============================================================
//  BOOT — crash-resistant init; resize re-render for SVG charts
// ============================================================
const safe = (label, fn) => {
  try { fn(); } catch (e) { console.error(`[boot] ${label} failed:`, e); }
};

function boot() {
  initReveal();
  safe("Progress",     () => initProgress());

  // Scroll-triggered chart initialisations — every chart now animates
  // on first scroll-into-view so the reader sees the motion.
  const triggers = [
    { sel: "#discovery-stage",     fn: () => Discovery.init(),     t: 0.30 },
    { sel: "#pattern-stage",       fn: () => Forest.init(),        t: 0.25 },
    { sel: "#everywhere-stage",    fn: () => Everywhere.init(),    t: 0.20 },
    { sel: "#overlap-stage",       fn: () => Overlap.init(),       t: 0.25 },
    { sel: "#qk-stage",            fn: () => QK.init(),            t: 0.25 },
    { sel: "#layer-stage",         fn: () => LayerGeometry.init(), t: 0.25 },
    { sel: "#vshuf-stage",         fn: () => VShuffle.init(),      t: 0.30 },
    { sel: "#ov-stage",            fn: () => OV.init(),            t: 0.30 },
    { sel: "#crosstpl-stage",      fn: () => CrossTemplate.init(), t: 0.25 },
    { sel: "#intervention-stage",  fn: () => Intervention.init(),  t: 0.30 },
  ];
  triggers.forEach(({ sel, fn, t }) => {
    const el = document.querySelector(sel);
    if (!el) return;
    safe(`scroll-trigger ${sel}`, () => onceVisible(el, fn, t));
  });

  // Hero count-up animation
  safe("Hero count-up", () => {
    const pills = $$(".num-pill .num");
    onceVisible(document.querySelector(".hero-numbers"), () => {
      pills.forEach((el, idx) => {
        const target = el.dataset.target;
        if (!target) return;
        const isFrac = target.includes("/");
        const isRange = target.includes("–");
        if (isFrac || isRange) {
          // For "13 / 15" or "+2–7 pp": just fade in (count-up is awkward for fractions/ranges)
          el.style.opacity = 0;
          setTimeout(() => {
            el.style.transition = "opacity 600ms ease";
            el.style.opacity = 1;
          }, 80 + idx * 120);
        } else {
          // Plain integer "27" → count up
          const tgt = parseInt(target, 10);
          if (isNaN(tgt)) return;
          const dur = 900, t0 = performance.now() + idx * 120;
          el.textContent = "0";
          function step(t) {
            if (t < t0) { requestAnimationFrame(step); return; }
            const p = Math.min(1, (t - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(tgt * eased);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target;
          }
          requestAnimationFrame(step);
        }
      });
    }, 0.4);
  });

  // Replay buttons
  const wireBtn = (id, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", () => safe(`replay ${id}`, fn));
  };
  wireBtn("btn-discovery-replay", () => Discovery.replay());
  wireBtn("btn-forest-replay",    () => Forest.replay());

  // Forest strategy toggle (zero / mean)
  $$("#forest-strategy-picker .btn-mini").forEach(btn => {
    btn.addEventListener("click", () => {
      $$("#forest-strategy-picker .btn-mini").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      safe("Forest strategy", () => Forest.setStrategy(btn.dataset.strategy));
    });
  });

  // OV mode toggle (signed / raw)
  $$("#ov-mode-picker .btn-mini").forEach(btn => {
    btn.addEventListener("click", () => {
      $$("#ov-mode-picker .btn-mini").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      safe("OV mode", () => OV.setMode(btn.dataset.mode));
    });
  });

  // BibTeX copy button
  const copyBtn = document.getElementById("bib-copy");
  const bibText = document.getElementById("bib-text");
  if (copyBtn && bibText && navigator.clipboard) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(bibText.textContent).then(() => {
        copyBtn.classList.add("ok");
        copyBtn.textContent = "Copied";
        setTimeout(() => {
          copyBtn.classList.remove("ok");
          copyBtn.textContent = "Copy";
        }, 1400);
      }).catch(() => {
        copyBtn.textContent = "Press Cmd+C";
        setTimeout(() => copyBtn.textContent = "Copy", 1400);
      });
    });
  }

  // Smooth scroll for nav links (in case browser doesn't honor scroll-margin)
  $$(".navlinks a").forEach(a => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Resize → re-render SVG charts (debounced)
  let rzTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(rzTimer);
    rzTimer = setTimeout(() => {
      safe("Forest re-render",        () => Forest.replay());
      safe("Everywhere re-render",    () => Everywhere.replay());
      safe("Overlap re-render",       () => Overlap.replay());
      safe("QK re-render",            () => QK.replay());
      safe("LayerGeom re-render",     () => LayerGeometry.replay());
      safe("VShuffle re-render",      () => VShuffle.replay());
      safe("OV re-render",            () => OV.replay());
      safe("CrossTemplate re-render", () => CrossTemplate.replay());
      safe("Intervention re-render",  () => Intervention.replay());
    }, 180);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

// ============================================================
//  v2 PATTERN — HeroLogit
//  Mini SVG above the fold cycling through 3 states from the
//  paper's hier-410M worked example. The marker slides along a
//  signed logit axis; the label + readout sync to the step.
// ============================================================
const HeroLogit = (() => {
  // Three states, real numbers from data.js / Tab 3 (hier-410M):
  //   baseline → 0.00 nats correct−incorrect logit (reference)
  //   ablate C → +0.29 nats (correct rises)
  //   ablate W → −0.25 nats (correct collapses)
  const STEPS = [
    { val:  0.00, label: "Pythia-410M · hier · baseline FV pass",                          dir: "neutral" },
    { val: +0.29, label: "Pythia-410M · hier · ablate cancellers (C)",                     dir: "up"      },
    { val: -0.25, label: "Pythia-410M · hier · ablate writers (W)",                        dir: "down"    },
  ];

  const AXIS_MIN = -0.60, AXIS_MAX = +0.60;     // visual bounds
  const TICK_VALS = [-0.50, -0.25, 0.00, +0.25, +0.50];

  let svg = null, label = null, value = null, readout = null;
  let stepEls = [];
  let cur = 0, timer = null, killed = false;

  function build() {
    svg     = document.getElementById("hero-anim-svg");
    label   = document.getElementById("hero-anim-label");
    value   = document.getElementById("hero-anim-value");
    readout = document.querySelector(".hero-anim-readout");
    stepEls = $$(".hero-anim-step");
    if (!svg) return false;

    const VB_W = 720, VB_H = 92;
    const M = { l: 38, r: 38, t: 8, b: 28 };
    const innerW = VB_W - M.l - M.r;
    const y0 = M.t + 22;

    const xOf = v => M.l + ((v - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * innerW;
    const x0 = xOf(0);

    const sv = d3.select(svg)
      .attr("viewBox", `0 0 ${VB_W} ${VB_H}`)
      .html("");

    // baseline track (very faint)
    sv.append("line")
      .attr("x1", M.l).attr("x2", M.l + innerW)
      .attr("y1", y0).attr("y2", y0)
      .attr("stroke", "var(--line)")
      .attr("stroke-width", 6)
      .attr("stroke-linecap", "round");

    // shaded gradient zones around zero (correct vs incorrect side)
    const lhs = sv.append("rect")
      .attr("x", M.l).attr("y", y0 - 3)
      .attr("width", x0 - M.l).attr("height", 6)
      .attr("fill", "var(--writer)").attr("fill-opacity", 0.10).attr("rx", 3);
    const rhs = sv.append("rect")
      .attr("x", x0).attr("y", y0 - 3)
      .attr("width", M.l + innerW - x0).attr("height", 6)
      .attr("fill", "var(--canceller)").attr("fill-opacity", 0.10).attr("rx", 3);

    // ticks
    sv.selectAll(".tick").data(TICK_VALS).enter().append("g")
      .attr("class", "tick")
      .attr("transform", d => `translate(${xOf(d)}, ${y0})`)
      .each(function(d) {
        const g = d3.select(this);
        g.append("line")
          .attr("y1", -8).attr("y2", 8)
          .attr("stroke", d === 0 ? "var(--text-mute)" : "var(--line-strong)")
          .attr("stroke-width", d === 0 ? 1.2 : 0.8);
        g.append("text")
          .attr("y", 22).attr("text-anchor", "middle")
          .style("fill", "var(--text-faint)")
          .style("font-family", "var(--font-mono)")
          .style("font-size", "10.5px")
          .text((d > 0 ? "+" : "") + d.toFixed(2));
      });

    // x-axis label
    sv.append("text")
      .attr("x", M.l + innerW / 2).attr("y", VB_H - 4)
      .attr("text-anchor", "middle")
      .style("fill", "var(--text-faint)")
      .style("font-family", "var(--font-mono)")
      .style("font-size", "10.5px")
      .text("log p(correct) − log p(incorrect)   ·  nats");

    // tail arrow connecting baseline → current position
    sv.append("line").attr("id", "hero-tail")
      .attr("x1", x0).attr("y1", y0).attr("x2", x0).attr("y2", y0)
      .attr("stroke", "var(--text-mute)")
      .attr("stroke-width", 1.6)
      .attr("stroke-linecap", "round")
      .attr("stroke-dasharray", "0,0")
      .attr("opacity", 0);

    // baseline pip
    sv.append("circle").attr("id", "hero-base")
      .attr("cx", x0).attr("cy", y0).attr("r", 4)
      .attr("fill", "var(--text-faint)")
      .attr("stroke", "white").attr("stroke-width", 1.5);

    // moving marker (rhombus)
    sv.append("path").attr("id", "hero-marker")
      .attr("d", "M 0 -9 L 9 0 L 0 9 L -9 0 Z")
      .attr("transform", `translate(${x0}, ${y0})`)
      .attr("fill", "var(--text)")
      .attr("stroke", "white").attr("stroke-width", 2);

    svg._inner = { xOf, y0 };
    return true;
  }

  function setStep(i) {
    if (!svg) return;
    cur = ((i % STEPS.length) + STEPS.length) % STEPS.length;
    const step = STEPS[cur];
    const { xOf, y0 } = svg._inner;
    const targetX = xOf(step.val);
    const x0 = xOf(0);

    // marker
    d3.select("#hero-marker")
      .transition().duration(860).ease(d3.easeCubicOut)
      .attr("transform", `translate(${targetX}, ${y0})`)
      .attr("fill", step.dir === "up"   ? "var(--canceller)"
                  : step.dir === "down" ? "var(--writer)"
                  :                       "var(--text)");

    // tail line
    d3.select("#hero-tail")
      .transition().duration(860).ease(d3.easeCubicOut)
      .attr("x2", targetX)
      .attr("opacity", step.val === 0 ? 0 : 0.55);

    // label + readout
    if (label) label.textContent = step.label;
    if (value) value.textContent = (step.val >= 0 ? "+" : "") + step.val.toFixed(2);
    if (readout) {
      readout.classList.toggle("up",   step.dir === "up");
      readout.classList.toggle("down", step.dir === "down");
    }
    stepEls.forEach((el, idx) => el.classList.toggle("on", idx === cur));
  }

  function loop() {
    if (killed) return;
    setStep(cur + 1);
    timer = setTimeout(loop, 2600);
  }

  function init() {
    if (!build()) return;
    setStep(0);                      // initial state
    if (timer) clearTimeout(timer);
    timer = setTimeout(loop, 1400);  // start cycling after a pause
  }

  function stop() { killed = true; if (timer) clearTimeout(timer); }
  return { init, stop };
})();


// ============================================================
//  v2 PATTERN — DataCite
//  Dotted-underline on key numbers; floating tooltip shows
//  source (paper Tab/Fig + clause). Works on hover and focus.
//  Sources are read from data-src (inline span) or data-cite
//  (whole-element, e.g. hero pills).
// ============================================================
const DataCite = (() => {
  let tip = null, current = null;

  function ensureTip() {
    if (tip) return tip;
    tip = document.createElement("div");
    tip.className = "cite-tip";
    tip.setAttribute("role", "tooltip");
    document.body.appendChild(tip);
    return tip;
  }

  function place(el, txt) {
    ensureTip();
    tip.textContent = txt;
    tip.classList.add("on");
    // place above element, falling back below if no room
    const r = el.getBoundingClientRect();
    const margin = 10;
    const tipR = tip.getBoundingClientRect();
    let x = r.left + r.width / 2 - tipR.width / 2;
    let y = r.top - tipR.height - margin;
    if (y < 8) y = r.bottom + margin;
    x = Math.max(8, Math.min(window.innerWidth - tipR.width - 8, x));
    tip.style.left = x + "px";
    tip.style.top  = y + "px";
  }
  function hide() {
    if (!tip) return;
    tip.classList.remove("on");
    current = null;
  }

  function attach(el, src) {
    if (!el || !src) return;
    const show = () => { current = el; place(el, src); };
    el.addEventListener("pointerenter", show);
    el.addEventListener("pointerleave", () => { if (current === el) hide(); });
    el.addEventListener("focus", show);
    el.addEventListener("blur",  () => { if (current === el) hide(); });
    el.tabIndex = el.tabIndex >= 0 ? el.tabIndex : 0;
  }

  function init() {
    // inline-number form: <span class="data-cite" data-src="...">
    $$(".data-cite[data-src]").forEach(el => attach(el, el.dataset.src));
    // whole-element form: <div data-cite="...">
    $$("[data-cite]").forEach(el => {
      // skip elements that are themselves .data-cite (already handled via data-src)
      if (el.classList.contains("data-cite")) return;
      attach(el, el.dataset.cite);
    });

    // global dismiss on Esc + scroll-hide
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });
    window.addEventListener("scroll",  hide, { passive: true });
  }

  return { init };
})();


// ============================================================
//  v2 PATTERN — Drilldown (per-cell modal)
//  Click a forest row in §03 or §04 → modal opens with
//  per-head W and C breakdown for that cell. Esc + backdrop
//  click + close button all dismiss.
// ============================================================
const Drilldown = (() => {
  let modal = null, title = null, body = null, stats = null;
  let lastFocused = null;

  function ensureRefs() {
    modal = document.getElementById("drill-modal");
    title = document.getElementById("drill-title");
    body  = document.getElementById("drill-body");
    stats = document.getElementById("drill-stats");
    return !!(modal && title && body && stats);
  }

  function topByMag(arr, n) {
    return [...arr].sort((a, b) => Math.abs(b.dla || 0) - Math.abs(a.dla || 0)).slice(0, n);
  }

  function open(cellId) {
    if (!ensureRefs()) return;
    const cell = (D.mainCells || []).find(c => c.id === cellId)
              || (D.extensionCells || []).find(c => c.id === cellId);
    const ph   = (D.perHead || {})[cellId];
    const gl   = (D.groupLesion || {})[cellId];

    title.textContent = cellId;

    // ----- header stats -----
    stats.innerHTML = "";
    const addStat = (k, v) => {
      const el = document.createElement("span");
      el.innerHTML = `<span class="ms-key">${k}</span><span class="ms-val">${v}</span>`;
      stats.appendChild(el);
    };
    if (cell) addStat("task", cell.task);
    if (cell) addStat("size", cell.size);
    if (gl)   addStat("|W|", gl.n_writers);
    if (gl)   addStat("|C|", gl.n_cancellers);
    if (gl?.zero) addStat("Δℓ<sub>W</sub>", fmt2(gl.zero.W_shift) + " nats");
    if (gl?.zero) addStat("Δℓ<sub>C</sub>", fmt2(gl.zero.C_shift) + " nats");

    // ----- per-head body -----
    body.innerHTML = "";
    const writers    = (ph?.writers    || []);
    const cancellers = (ph?.cancellers || []);
    const maxMag = Math.max(
      0.05,
      ...writers.map(h => Math.abs(h.dla || 0)),
      ...cancellers.map(h => Math.abs(h.dla || 0)),
    );

    const buildCol = (kind, heads, label) => {
      const col = document.createElement("div");
      col.className = "modal-col";
      col.dataset.kind = kind;
      const h4 = document.createElement("h4");
      h4.innerHTML = `${label} <span class="count">${heads.length}</span>`;
      col.appendChild(h4);
      const shown = topByMag(heads, 12);
      if (shown.length === 0) {
        const empty = document.createElement("div");
        empty.className = "mono muted";
        empty.style.fontSize = "11px";
        empty.textContent = "(no heads in this group)";
        col.appendChild(empty);
      }
      shown.forEach(h => {
        const row = document.createElement("div");
        row.className = "head-row";
        row.dataset.kind = kind;
        const w = Math.min(100, Math.max(2, (Math.abs(h.dla) / maxMag) * 100));
        row.innerHTML = `
          <span class="hid">${h.id}</span>
          <span class="hbar"><span class="fill" style="width: ${w}%"></span></span>
          <span class="hval">${fmt3(h.dla)}</span>
        `;
        col.appendChild(row);
      });
      if (heads.length > shown.length) {
        const more = document.createElement("div");
        more.className = "mono muted";
        more.style.fontSize = "11px";
        more.style.marginTop = "8px";
        more.textContent = `… ${heads.length - shown.length} more`;
        col.appendChild(more);
      }
      return col;
    };
    body.appendChild(buildCol("W", writers,    "writers"));
    body.appendChild(buildCol("C", cancellers, "cancellers"));

    // ----- show -----
    lastFocused = document.activeElement;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("on"));
    document.documentElement.style.overflow = "hidden";
    document.getElementById("drill-close")?.focus();
  }

  function close() {
    if (!modal) return;
    modal.classList.remove("on");
    document.documentElement.style.overflow = "";
    setTimeout(() => { modal.hidden = true; }, 200);
    if (lastFocused?.focus) try { lastFocused.focus(); } catch (e) {}
  }

  function wireForestRows() {
    // Find every text label inside the forest charts that matches a cell id
    // and attach click + hover. The Forest module renders y-axis labels as
    // tick text; we look up labels whose textContent matches a known cell.
    const cellSet = new Set([
      ...(D.mainCells || []).map(c => c.id),
      ...(D.extensionCells || []).map(c => c.id),
    ]);
    const attach = (textEl) => {
      const cellId = textEl.textContent.trim();
      if (!cellSet.has(cellId)) return;
      textEl.style.cursor = "pointer";
      textEl.style.pointerEvents = "auto";
      textEl.addEventListener("click", () => open(cellId));
      textEl.addEventListener("pointerenter", () => {
        textEl.style.fill = "var(--accent)";
        textEl.style.fontWeight = "600";
      });
      textEl.addEventListener("pointerleave", () => {
        textEl.style.fill = "";
        textEl.style.fontWeight = "";
      });
    };
    // Scan both forest containers; use a small delay to wait for D3 render.
    const scan = () => {
      ["#forest-chart text", "#everywhere-chart text"].forEach(sel => {
        $$(sel).forEach(attach);
      });
    };
    setTimeout(scan, 200);
    setTimeout(scan, 1200);    // re-scan after animation lands
    setTimeout(scan, 3000);    // final pass after replay buttons
  }

  function init() {
    if (!ensureRefs()) return;
    document.getElementById("drill-close")?.addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) close();
    });
    wireForestRows();
  }

  return { init, open, close };
})();


// ============================================================
//  WIRE v2 MODULES — boot them after the main boot finishes.
//  Each is wrapped in safe() so a single failure doesn't dark
//  the rest of the page.
// ============================================================
(function wireV2() {
  const run = () => {
    safe("HeroLogit init", () => HeroLogit.init());
    safe("DataCite init",  () => DataCite.init());
    safe("Drilldown init", () => Drilldown.init());
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    // Already booted (boot() handler ran first). Defer a tick so that
    // the existing forest charts have started laying out their labels.
    setTimeout(run, 0);
  }
})();
