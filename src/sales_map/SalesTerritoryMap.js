import monarchLogo from '../images/Monarch3Logo.svg';
import React, { useEffect, useState, useRef, useMemo } from "react";

// STATE → REP ASSIGNMENTS
const repMap = {
  // Allison = Red (8 States)
  AK: "Allison",
  CA: "Allison",
  ID: "Allison",
  HI: "Allison",
  NV: "Allison",
  OR: "Allison",
  UT: "Allison",
  WA: "Allison",

  // Theresa = Blue (20 States)
  AL: "Theresa",
  AR: "Theresa",
  FL: "Theresa",
  GA: "Theresa",
  IA: "Theresa",
  IL: "Theresa",
  KS: "Theresa",
  LA: "Theresa",
  MN: "Theresa",
  MO: "Theresa",
  MS: "Theresa",
  MT: "Theresa",
  NE: "Theresa",
  ND: "Theresa",
  NM: "Theresa",
  OK: "Theresa",
  SD: "Theresa",
  TX: "Theresa",
  WI: "Theresa",
  WY: "Theresa",

  // Both = Yellow (23 States)
  AZ: "Both",
  CT: "Both",
  CO: "Both",
  DC: "Both",
  DE: "Both",
  IN: "Both",
  KY: "Both",
  ME: "Both",
  MD: "Both",
  MA: "Both",
  MI: "Both",
  NH: "Both",
  NY: "Both",
  NJ: "Both",
  NC: "Both",
  OH: "Both",
  PA: "Both",
  RI: "Both",
  SC: "Both",
  TN: "Both",
  VT: "Both",
  VA: "Both",
  WV: "Both",

};

// STATE NAMES for searching
const stateNames = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District of Columbia", FL: "Florida",
  GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana",
  IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine",
  MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska",
  NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico",
  NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island",
  SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas",
  UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington",
  WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming"
};
/**
 * Helper: normalize id like "US-CA" -> "CA"
 */
function normalizeId(id) {
  if (!id) return null;
  return id.replace(/^US-/, "").replace(/^usa-/, "").toUpperCase();
}

export default function SalesTerritoryMap({
  svgPath = "/usa.svg" // default, change if you named it differently
}) {
  const [svgText, setSvgText] = useState(null);
  const containerRef = useRef(null);
  const [hovered, setHovered] = useState(null); // postal like "CA"
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Precompute postal -> name map (lowercased names for search)
  // eslint-disable-next-line
  const postalByName = useMemo(() => {
    const map = {};
    for (const [k, v] of Object.entries(stateNames)) {
      map[v.toLowerCase()] = k;
    }
    return map;
  }, []);

  // Fetch SVG text once
  useEffect(() => {
    let mounted = true;
    fetch(svgPath)
      .then((r) => {
        if (!r.ok) throw new Error("SVG not found: " + svgPath);
        return r.text();
      })
      .then((text) => {
        if (mounted) setSvgText(text);
      })
      .catch((err) => {
        console.error("Failed to load SVG:", err);
      });
    return () => (mounted = false);
  }, [svgPath]);

  // After SVG text is injected, find state paths and attach listeners + set data-rep
  useEffect(() => {
    if (!svgText || !containerRef.current) return;

    // inject sanitized svg (we trust the file you provided)
    let modifiedSvg = svgText
        .replace(/<svg\s+id="wrapper"[^>]*?width="2000"[^>]*?height="2000"[^>]*?>/i, '<svg id="wrapper" viewBox="0 0 1000 700" preserveAspectRatio="xMinYMin" style="background-color: rgb(255, 255, 255);">')
        .replace(/<svg\s+xmlns="http:\/\/www.w3.org\/2000\/svg"\s+id="map"[^>]*?width="1000"[^>]*?height="700"[^>]*?>/i, '<svg xmlns="http://www.w3.org/2000/svg" id="map" version="1.1" viewBox="0 0 1000 700" preserveAspectRatio="xMinYMin" data-originalStrokeWidth=".55">');

    // 2. Inject the modified svg
    containerRef.current.innerHTML = modifiedSvg;

    // find all path / polygon / g elements that are states
    // common MapChart exports use <path id="US-CA"> etc
    const svgEl = containerRef.current.querySelector("svg");
    if (!svgEl) return;

    const stateElements = svgEl.querySelectorAll("path[id], polygon[id], g[id]");
    // For accessibility: make each focusable and add aria-label
    stateElements.forEach((el) => {
      const rawId = el.getAttribute("id");
      const postal = normalizeId(rawId);
      const rep = repMap[postal] || null;
      // set data attributes for CSS
      if (rep) {
        el.setAttribute("data-rep", rep);
      } else {
        el.removeAttribute("data-rep");
      }
      // set a sensible aria-label
      const label = (postal && stateNames[postal]) ? `${stateNames[postal]} — ${rep || "No rep assigned"}` : rawId;
      el.setAttribute("aria-label", label);
      el.setAttribute("tabindex", "0"); // keyboard focusable

      // event handlers
      const onEnter = (ev) => {
        setHovered(postal);
        // update cursor pos (for tooltip)
        setCursorPos({ x: ev.clientX, y: ev.clientY });
        // small visual focus
        el.classList.add("st-hover");
      };
      const onLeave = () => {
        setHovered(null);
        el.classList.remove("st-hover");
      };
      const onClick = (ev) => {
        ev.stopPropagation();
        setSelected((cur) => (cur === postal ? null : postal));
        // update cursor pos (for tooltip)
        setCursorPos({ x: ev.clientX, y: ev.clientY });
      };
      const onKey = (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          setSelected((cur) => (cur === postal ? null : postal));
        }
      };

      // remove previous listeners (safe) and add new ones
      el.removeEventListener("mouseenter", el._onEnter);
      el.removeEventListener("mouseleave", el._onLeave);
      el.removeEventListener("click", el._onClick);
      el.removeEventListener("keyup", el._onKey);

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
      el.addEventListener("click", onClick);
      el.addEventListener("keyup", onKey);

      // store refs to handlers for future removal if needed
      el._onEnter = onEnter;
      el._onLeave = onLeave;
      el._onClick = onClick;
      el._onKey = onKey;
    });

    // Clicking outside clears selection
    const onDocClick = () => setSelected(null);
    document.addEventListener("click", onDocClick);
    return () => {
      document.removeEventListener("click", onDocClick);
      // cleanup listeners
      stateElements.forEach((el) => {
        el.removeEventListener("mouseenter", el._onEnter);
        el.removeEventListener("mouseleave", el._onLeave);
        el.removeEventListener("click", el._onClick);
        el.removeEventListener("keyup", el._onKey);
        delete el._onEnter; delete el._onLeave; delete el._onClick; delete el._onKey;
      });
    };
  }, [svgText]);

  // Helper: get postal from postal or full name or partials
  function findPostalFromQuery(q) {
    if (!q) return null;
    const normalizedQ = q.trim().toLowerCase();

    // exact postal
    const asPostal = Object.keys(stateNames).find((p) => p.toLowerCase() === normalizedQ);
    if (asPostal) return asPostal;

    // exact match full name
    const full = Object.keys(stateNames).find((p) => stateNames[p].toLowerCase() === normalizedQ);
    if (full) return full;

    // partial name match (startsWith or includes)
    const partial = Object.keys(stateNames).find((p) => stateNames[p].toLowerCase().startsWith(normalizedQ) || stateNames[p].toLowerCase().includes(normalizedQ));
    if (partial) return partial;

    return null;
  }

  // When query changes, attempt to highlight match
  useEffect(() => {
    const postal = findPostalFromQuery(query);
    // set hovered/selected accordingly
    if (postal) {
      setSelected(postal);
      // also add class to the element
      const svgEl = containerRef.current?.querySelector("svg");
      if (svgEl) {
        // remove existing active classes
        svgEl.querySelectorAll(".st-active").forEach((el) => el.classList.remove("st-active"));
        const candidate = svgEl.querySelector(`[id="${postal}"], [id="US-${postal}"], [id="us-${postal.toLowerCase()}"]`);
        if (candidate) candidate.classList.add("st-active");
      }
    } else {
      // clear active highlights
      const svgEl = containerRef.current?.querySelector("svg");
      svgEl?.querySelectorAll(".st-active")?.forEach((el) => el.classList.remove("st-active"));
      setSelected(null);
    }
  }, [query]);

  // When user selects or hovered, add/remove classes for visuals
  useEffect(() => {
    const svgEl = containerRef.current?.querySelector("svg");
    if (!svgEl) return;
    // clear all highlight classes
    svgEl.querySelectorAll(".st-active, .st-hover").forEach((el) => {
      if (!el.classList.contains("st-hover")) el.classList.remove("st-active");
    });

    // apply st-active for selected
    if (selected) {
      const el = svgEl.querySelector(`[id="${selected}"], [id="US-${selected}"], [id="us-${selected.toLowerCase()}"]`);
      if (el) el.classList.add("st-active");
    }

    // apply st-hover for hovered (hover has priority visually)
    if (hovered) {
      const el = svgEl.querySelector(`[id="${hovered}"], [id="US-${hovered}"], [id="us-${hovered.toLowerCase()}"]`);
      if (el) el.classList.add("st-hover");
    }

  }, [selected, hovered]);

  // derive visible info
  const activePostal = selected || hovered;
  const activeName = activePostal ? stateNames[activePostal] || activePostal : null;
  const activeRep = activePostal ? (repMap[activePostal] || "No rep assigned") : null;

  return (
    <div className="stm-root">
      <div className="stm-header">
        <img src={monarchLogo} alt='Monarch Logo' className='stm-logo' />
        <div className="stm-title-search">
          <p>Sales Representative by State</p>
        <div className="stm-search">
          <label className="sr-only" htmlFor="stm-search">Search state &gt;</label>
          <input
            id="stm-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="(postal or name) — e.g. NY or New York"
            aria-label="Search state"
          />
          <button
            className="clear-btn"
            onClick={() => { setQuery(""); setSelected(null); }}
            title="Clear"
            aria-label="Clear search"
          >
            ✕
          </button>
        </div>
        </div>

        <div className="stm-legend">
          <div><span className="legend-swatch allison" /> Allison</div>
          <div><span className="legend-swatch theresa" /> Theresa</div>
          <div><span className="legend-swatch both" /> Both</div>
        </div>
      </div>

      <div className="stm-body">
        <div className="stm-map" ref={containerRef} aria-hidden={svgText ? "false" : "true"}>
          {!svgText && <div className="stm-loading">Loading map…</div>}
        </div>

        <aside className="stm-panel" aria-live="polite">
          {activePostal ? (
            <>
              <div className="stm-panel-state">{activeName} <span className="stm-postal">({activePostal})</span></div>
              <div className="stm-panel-rep">
                <strong>{activeRep}</strong>
                {/* <div className="stm-rep-note">
                  {activeRep === "Both" ? "Shared between Allison & Theresa" : `Owned by ${activeRep}`}
                </div> */}
              </div>
              <div className="stm-actions">
                {/* <button onClick={() => alert(`Contact ${activeRep}`)}>Contact {activeRep}</button> */}
                <button onClick={() => { navigator.clipboard?.writeText(`${activeName} (${activePostal}) — ${activeRep}`); }}>Copy</button>
              </div>
            </>
          ) : (
            <div className="stm-placeholder">Hover a state or search to see rep details here.</div>
          )}
        </aside>
      </div>

      {/* tooltip */}
      {activePostal && (
        <div
          className="stm-tooltip"
          style={{ left: cursorPos.x + 12, top: cursorPos.y + 12 }}
        >
          <div className="t-name">{activeName} <span className="t-postal">({activePostal})</span></div>
          <div className="t-rep">{activeRep}</div>
        </div>
      )}
    </div>
  );
}