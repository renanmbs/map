// import './App.css';
// import monarchLogo from './images/Monarch3Logo.svg';
// import SalesTerritoryMap from "./sales_map/SalesTerritoryMap"
// import ShipTerritoryMap from './ship_map/ship_map';

// function App() {
//   return (
//     <div className="App">

//       <div className="stm-header">

//         <img src={monarchLogo} alt='Monarch Logo' className='stm-logo' />

//         <div className="stm-title-search">
//           <p>Sales Representative by State</p>

//         </div>
//       </div>
//       <SalesTerritoryMap svgPath="/usa.svg" />
//       <ShipTerritoryMap svgPath="/ship.svg" />
//     </div>
//   );
// }

// export default App;

import './App.css';
import MapContainer from "./MapContainer";

function App() {
  return (
    <div className="App">
      <MapContainer />
    </div>
  );
}

export default App;
