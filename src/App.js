/* eslint-disable react-hooks/exhaustive-deps */

import { useState } from "react";
import "./App.scss";
import RectangleBuilder from "./RectangleBuilder";
import { Menu } from "@mui/icons-material";
import { Sidebar } from "./components/sidebar";

function App() {
  const height = window.screen.height;
  const width = window.screen.width;
  const [boxes, setBoxes] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="App">
      <div className="actions">
        <div
          onClick={(e) => {
            setShowSidebar(!showSidebar);
          }}
          className="menu"
        >
          <Menu />
        </div>

        {showSidebar && (
          <Sidebar
            setBoxes={setBoxes}
            setShowSidebar={setShowSidebar}
            boxes={boxes}
          />
        )}
        <h1>Rectangle Builder</h1>
        <p>
          Click and drag to create a rectangle. Press the backspace key to
          remove the rectangle.
        </p>
      </div>
      <RectangleBuilder
        width={width}
        height={height}
        boxes={boxes}
        lineOffset={4}
        anchorSize={5}
        updateBoxes={setBoxes}
        color={"#8c9cf3"}
        anchorColor="#b8c1f3"
      />
    </div>
  );
}

export default App;
