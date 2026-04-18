import "./App.css";
import { Scene3D_2 } from "./components/Scene3D_2";

function App() {
  return (
    <div className="app">
      <header>
        <h1>Computer broken cube</h1>
        <p>MotherBoard in the cube geometry</p>
      </header>
      <div className="canvas-container">
        {/* <img
      src="/public/material/backCanva5.png"
      alt="Overlay"
      className="canvas-overlay"
    /> */}
        <Scene3D_2 />
      </div>
    </div>
  );
}

export default App;
