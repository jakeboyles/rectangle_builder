/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import "./App.scss";
import { Menu, Delete } from "@mui/icons-material";
import RectangleBuilder from "./RectangleBuilder";
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
          remove the rectangle. Hit the trash can in the top right to remove all. 
          Hit the menu button to get access to your saved layouts and to save your current layout.
        </p>

        <div className="removeAll">
          <button onClick={() => setBoxes([])}><Delete /></button> 
        </div>


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
