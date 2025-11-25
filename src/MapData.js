// MapData.js

// STATE NAMES for searching (Shared by both maps)
export const stateNames = {
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

// --- SALES MAP CONFIG ---
const salesRepMap = {
    // Allison = Red (8 States)
    AK: "Allison", CA: "Allison", ID: "Allison", HI: "Allison", NV: "Allison",
    OR: "Allison", UT: "Allison", WA: "Allison",
    // Theresa = Blue (20 States)
    AL: "Theresa", AR: "Theresa", FL: "Theresa", GA: "Theresa", IA: "Theresa",
    IL: "Theresa", KS: "Theresa", LA: "Theresa", MN: "Theresa", MO: "Theresa",
    MS: "Theresa", MT: "Theresa", NE: "Theresa", ND: "Theresa", NM: "Theresa",
    OK: "Theresa", SD: "Theresa", TX: "Theresa", WI: "Theresa", WY: "Theresa",
    // Both = Yellow (23 States)
    AZ: "Both", CT: "Both", CO: "Both", DC: "Both", DE: "Both", IN: "Both",
    KY: "Both", ME: "Both", MD: "Both", MA: "Both", MI: "Both", NH: "Both",
    NY: "Both", NJ: "Both", NC: "Both", OH: "Both", PA: "Both", RI: "Both",
    SC: "Both", TN: "Both", VT: "Both", VA: "Both", WV: "Both",
};

export const SALES_CONFIG = {
    title: "Sales Representative by State",
    svgPath: "/usa.svg",
    repMap: salesRepMap,
    legend: [
        { label: "Allison", className: "allison" },
        { label: "Theresa", className: "theresa" },
        { label: "Both", className: "both" },
    ],
};

// --- SHIPPING MAP CONFIG ---
const shipRepMap = {
    // Sparks (8 States)
    AK: "Sparks, NV - 89431", CA: "Sparks, NV - 89431", ID: "Sparks, NV - 89431",
    HI: "Sparks, NV - 89431", NV: "Sparks, NV - 89431", OR: "Sparks, NV - 89431",
    UT: "Sparks, NV - 89431", WA: "Sparks, NV - 89431",
    //Grand Prairie (20 States)
    AL: "Grand Prairie, TX - 75050", AR: "Grand Prairie, TX - 75050", FL: "Grand Prairie, TX - 75050",
    GA: "Grand Prairie, TX - 75050", IA: "Grand Prairie, TX - 75050", IL: "Grand Prairie, TX - 75050",
    KS: "Grand Prairie, TX - 75050", LA: "Grand Prairie, TX - 75050", MN: "Grand Prairie, TX - 75050",
    MO: "Grand Prairie, TX - 75050", MS: "Grand Prairie, TX - 75050", MT: "Grand Prairie, TX - 75050",
    NE: "Grand Prairie, TX - 75050", ND: "Grand Prairie, TX - 75050", NM: "Grand Prairie, TX - 75050",
    OK: "Grand Prairie, TX - 75050", SD: "Grand Prairie, TX - 75050", TX: "Grand Prairie, TX - 75050",
    WI: "Grand Prairie, TX - 75050", WY: "Grand Prairie, TX - 75050",
    //Ronkonkoma (20 States)
    CT: "Ronkonkoma, NY - 11779", DC: "Ronkonkoma, NY - 11779", DE: "Ronkonkoma, NY - 11779",
    IN: "Ronkonkoma, NY - 11779", KY: "Ronkonkoma, NY - 11779", ME: "Ronkonkoma, NY - 11779",
    MD: "Ronkonkoma, NY - 11779", MA: "Ronkonkoma, NY - 11779", MI: "Ronkonkoma, NY - 11779",
    NH: "Ronkonkoma, NY - 11779", NY: "Ronkonkoma, NY - 11779", NJ: "Ronkonkoma, NY - 11779",
    NC: "Ronkonkoma, NY - 11779", OH: "Ronkonkoma, NY - 11779", PA: "Ronkonkoma, NY - 11779",
    RI: "Ronkonkoma, NY - 11779", SC: "Ronkonkoma, NY - 11779", VT: "Ronkonkoma, NY - 11779",
    VA: "Ronkonkoma, NY - 11779", WV: "Ronkonkoma, NY - 11779",
    // Grand Prairie or Ronkonkoma (1 State)
    TN: "Grand Prairie or Ronkonkoma",
    // Grand Prairie or Sparks (2 States)
    AZ: "Grand Prairie or Sparks", CO: "Grand Prairie or Sparks",
};

export const SHIP_CONFIG = {
    title: "Shipping Location by State",
    svgPath: "/ship.svg",
    repMap: shipRepMap,
    legend: [
        { label: "Sparks, NV", className: "sparks" },
        { label: "Grand Prairie, TX", className: "grand-prairie" },
        { label: "Ronkonkoma, NY", className: "ronkonkoma" },
        { label: "Grand Prairie/Ronkonkoma", className: "gp-rok" },
        { label: "Grand Prairie/Sparks", className: "gp-sparks" },
    ],
};