import { Delete, Check, Close } from "@mui/icons-material";
import { useEffect, useState } from "react";

export const Sidebar = ({
  setBoxes,
  setShowSidebar,
  boxes,
}) => {
  const [name, setName] = useState("");
  const [savedBoxes, setSavedBoxes] = useState([]);

  useEffect(() => {
    getSavedBoxes();
  }, []);

  const getSavedBoxes = () => {
    const savedBoxes = JSON.parse(localStorage.getItem("boxes"));
    setSavedBoxes(savedBoxes);
  };

  // Remove a saved box from the local storage
  const removeSavedBox = (box) => {
    let savedBoxes = JSON.parse(localStorage.getItem("boxes"));
    const newBoxes = savedBoxes.filter(
      (savedBox) => savedBox.name !== box.name
    );
    localStorage.setItem("boxes", JSON.stringify(newBoxes));
    getSavedBoxes();
  };

  // Save the current state to the local storage
  const saveToDatabase = () => {
    let savedBoxes = JSON.parse(localStorage.getItem("boxes"));

    // If there is no saved data, create an empty array
    if (!savedBoxes) savedBoxes = [];

    if (!name || name === "")
      return alert("Please enter a name for the session");

    // Create a new object with the current state
    const savedObject = {
      name,
      box: boxes,
    };

    // Add the new object to the saved data
    const newSavedBoxes = [...savedBoxes, savedObject];

    // Save the new data
    localStorage.setItem("boxes", JSON.stringify(newSavedBoxes));

    setShowSidebar(false);
    getSavedBoxes();
    setName("");
  };
  return (
    <div className="outMenu">
      <Close className="close" onClick={() => setShowSidebar(false)} />
      <h3>Store Your Sessions</h3>

      <div className="inputBox">
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          type="text"
          placeholder="Enter Session Name"
        />

        <button
          onClick={() => {
            saveToDatabase();
          }}
        >
          Save
        </button>
      </div>

      {savedBoxes &&
        savedBoxes.map((savedBox, index) => {
          return (
            <div key={index} className="savedBox">
              <h4>{savedBox.name}</h4>
              <button
                className="restore"
                onClick={() => {
                  setBoxes(savedBox.box);
                  setShowSidebar(false);
                }}
              >
                <Check />
              </button>
              <button
                onClick={() => {
                  removeSavedBox(savedBox);
                }}
                className="trash"
              >
                <Delete />
              </button>
            </div>
          );
        })}
    </div>
  );
};
