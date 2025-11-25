// TerritoryMap.js (Modified to include the switch in the panel)
import React, { useEffect, useState, useRef, useMemo } from "react";
import monarchLogo from './images/Monarch3Logo.svg';
import { stateNames } from "./MapData";

/**
 * Helper: normalize id like "US-CA" -> "CA"
 */
function normalizeId(id) {
    if (!id) return null;
    return id.replace(/^US-/, "").replace(/^usa-/, "").toUpperCase();
}

export default function TerritoryMap({ config, query, setQuery, isSalesMap, handleToggle }) {
    // eslint-disable-next-line
    const { title, svgPath, repMap, legend } = config;
    
    const [svgText, setSvgText] = useState(null);
    const containerRef = useRef(null);
    const [hovered, setHovered] = useState(null); // postal like "CA"
    const [selected, setSelected] = useState(null);
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

    // --- 1. Fetch SVG text (runs when svgPath changes) ---
    useEffect(() => {
        setSvgText(null); // Clear previous SVG when path changes
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

    // --- 2. Inject SVG, set attributes, and attach listeners (runs when svgText changes) ---
    useEffect(() => {
        if (!svgText || !containerRef.current) return;

        // 1. Inject modified SVG (same cleanup as original code)
        let modifiedSvg = svgText
            .replace(/<svg\s+id="wrapper"[^>]*?width="2000"[^>]*?height="2000"[^>]*?>/i, '<svg id="wrapper" viewBox="0 0 1000 700" preserveAspectRatio="xMinYMin" style="background-color: rgb(255, 255, 255);">')
            .replace(/<svg\s+xmlns="http:\/\/www.w3.org\/2000\/svg"\s+id="map"[^>]*?width="1000"[^>]*?height="700"[^>]*?>/i, '<svg xmlns="http://www.w3.org/2000/svg" id="map" version="1.1" viewBox="0 0 1000 700" preserveAspectRatio="xMinYMin" data-originalStrokeWidth=".55">');

        containerRef.current.innerHTML = modifiedSvg;

        const svgEl = containerRef.current.querySelector("svg");
        if (!svgEl) return;

        const stateElements = svgEl.querySelectorAll("path[id], polygon[id], g[id]");
        
        const cleanupListeners = [];

        stateElements.forEach((el) => {
            const rawId = el.getAttribute("id");
            const postal = normalizeId(rawId);
            const rep = repMap[postal] || null;
            
            // 🛑 FIX: Ignore non-state elements based on common SVG map metadata IDs
            const ignoredIds = ["legend-svg", "legend-g-svg", "credit-text-svg"];
            if (rawId && ignoredIds.includes(rawId.toLowerCase())) {
                return; // Skip attaching listeners/data to these elements
            }
            // 🛑 FIX: Also skip if the postal code isn't recognized
            if (!postal || !stateNames[postal]) {
                return; // Skip if it's not a recognized state (e.g., small islands, map metadata)
            }


            // Set data attributes for CSS based on the rep map of the current configuration
            if (rep) {
                el.setAttribute("data-rep", rep);
            } else {
                el.removeAttribute("data-rep");
            }

            const label = (postal && stateNames[postal]) ? `${stateNames[postal]} — ${rep || "No assignment"}` : rawId;
            el.setAttribute("aria-label", label);
            el.setAttribute("tabindex", "0"); 

            // event handlers
            const onEnter = (ev) => {
                setHovered(postal);
                setCursorPos({ x: ev.clientX, y: ev.clientY });
                el.classList.add("st-hover");
            };
            const onLeave = () => {
                setHovered(null);
                el.classList.remove("st-hover");
            };
            const onClick = (ev) => {
                ev.stopPropagation();
                setSelected((cur) => (cur === postal ? null : postal));
                setCursorPos({ x: ev.clientX, y: ev.clientY });
            };
            const onKey = (ev) => {
                if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    setSelected((cur) => (cur === postal ? null : postal));
                }
            };

            // Setup listeners and cleanup function
            el.addEventListener("mouseenter", onEnter);
            el.addEventListener("mouseleave", onLeave);
            el.addEventListener("click", onClick);
            el.addEventListener("keyup", onKey);

            cleanupListeners.push(() => {
                el.removeEventListener("mouseenter", onEnter);
                el.removeEventListener("mouseleave", onLeave);
                el.removeEventListener("click", onClick);
                el.removeEventListener("keyup", onKey);
            });
        });

        const onDocClick = () => setSelected(null);
        document.addEventListener("click", onDocClick);

        return () => {
            document.removeEventListener("click", onDocClick);
            cleanupListeners.forEach(fn => fn());
        };
    }, [svgText, repMap]); 

    // Helper: get postal from postal or full name or partials
    function findPostalFromQuery(q) {
        if (!q) return null;
        const normalizedQ = q.trim().toLowerCase();

        const asPostal = Object.keys(stateNames).find((p) => p.toLowerCase() === normalizedQ);
        if (asPostal) return asPostal;

        const full = Object.keys(stateNames).find((p) => stateNames[p].toLowerCase() === normalizedQ);
        if (full) return full;

        const partial = Object.keys(stateNames).find((p) => stateNames[p].toLowerCase().startsWith(normalizedQ) || stateNames[p].toLowerCase().includes(normalizedQ));
        if (partial) return partial;

        return null;
    }

    // --- 3. Handle Search/Query Logic ---
    useEffect(() => {
        const postal = findPostalFromQuery(query);
        if (postal) {
            setSelected(postal);
        } else {
            setSelected(null);
        }
    }, [query]);

    // --- 4. Apply CSS classes for visuals (runs when selected/hovered changes) ---
    useEffect(() => {
        const svgEl = containerRef.current?.querySelector("svg");
        if (!svgEl) return;
        
        // Clear all highlight classes
        svgEl.querySelectorAll(".st-active, .st-hover").forEach((el) => {
             el.classList.remove("st-active");
             el.classList.remove("st-hover");
        });

        // Apply st-active for selected
        if (selected) {
            const el = svgEl.querySelector(`[id="${selected}"], [id="US-${selected}"], [id="us-${selected.toLowerCase()}"]`);
            if (el) el.classList.add("st-active");
        }

        // Apply st-hover for hovered (hover has priority visually)
        if (hovered) {
            const el = svgEl.querySelector(`[id="${hovered}"], [id="US-${hovered}"], [id="us-${hovered.toLowerCase()}"]`);
            if (el) el.classList.add("st-hover");
        }
    }, [selected, hovered]);


    // derive visible info
    const activePostal = selected || hovered;
    const activeName = activePostal ? stateNames[activePostal] || activePostal : null;
    const activeRep = activePostal ? (repMap[activePostal] || "No assignment") : null;
    
    // --- Switch UI Component ---
    const SwitchComponent = (
        <div className="map-type-switch">
            <span className={`switch-label ${isSalesMap ? 'active' : ''}`}>Sales Map</span>
            <button 
                className="toggle-button" 
                onClick={handleToggle}
                aria-label={`Switch to ${isSalesMap ? 'Shipping Location Map' : 'Sales Representative Map'}`}
                // Dynamic style applied here for the "green active" effect
                style={{ backgroundColor: isSalesMap ? '#2ecc71' : '#ccc' }} 
            >
                <div 
                    className="toggle-slider" 
                    style={{ 
                        // Move to the right (30px) when Sales Map (active/green) is selected
                        transform: isSalesMap ? 'translateX(30px)' : 'translateX(0)', 
                    }}
                ></div>
            </button>
            <span className={`switch-label ${!isSalesMap ? 'active' : ''}`}>Shipping Map</span>
        </div>
    );

    return (
        <div className="stm-root">
            <div className="stm-header">
                <img src={monarchLogo} alt='Monarch Logo' className='stm-logo' />
                <div className="stm-title-search">
                    <p>{title}</p>
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

            </div>

            <div className="stm-body">
                <div className="stm-map" ref={containerRef} aria-hidden={svgText ? "false" : "true"}>
                    {!svgText && <div className="stm-loading">Loading map…</div>}
                </div>

                <aside className="stm-panel" aria-live="polite">
                    {/* Inject the switch component here */}
                    {SwitchComponent}
                    <hr className="panel-divider" />
                    
                    {activePostal ? (
                        <>
                            <div className="stm-panel-state">{activeName} <span className="stm-postal">({activePostal})</span></div>
                            <div className="stm-panel-rep">
                                <strong>{activeRep}</strong>
                            </div>
                            <div className="stm-actions">
                                <button onClick={() => { navigator.clipboard?.writeText(`${activeName} (${activePostal}) — ${activeRep}`); }}>Copy</button>
                            </div>
                        </>
                    ) : (
                        <div className="stm-placeholder">Hover a state or search to see details here.</div>
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