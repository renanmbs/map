// MapContainer.js
import React, { useState } from "react";
import TerritoryMap from "./TerritoryMap"; 
import { SALES_CONFIG, SHIP_CONFIG } from "./MapData";

export default function MapContainer() {
    // true = Sales, false = Shipping (Default to Sales)
    const [isSalesMap, setIsSalesMap] = useState(true);
    const [query, setQuery] = useState("");

    const currentConfig = isSalesMap ? SALES_CONFIG : SHIP_CONFIG;
    
    // Logic to reset query and flip the map
    const handleToggle = () => {
        setIsSalesMap(prev => !prev);
        setQuery(""); 
    };

    return (
        <div className="map-container-root">
            {/* TerritoryMap now handles the rendering of the switch inside the panel */}
            <TerritoryMap 
                config={currentConfig}
                query={query}
                setQuery={setQuery}
                isSalesMap={isSalesMap}
                handleToggle={handleToggle}
            />
        </div>
    );
}