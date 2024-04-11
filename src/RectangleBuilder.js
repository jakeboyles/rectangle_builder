/* eslint-disable react-hooks/exhaustive-deps */

import "./App.scss";
import { useEffect, useRef } from "react";

function RectangleBuilder({
  color,
  lineOffset = 5,
  anchorSize = 5,
  boxes = [],
  width,
  height,
  updateBoxes,
  anchorColor = "#fff",
}) {
  // Holds the state of the mouse
  let mouseDown = false;

  // Holds the box that we are currently interacting with
  let clickedArea = { box: -1, pos: "o" };

  // Holds the positions of the mouse
  let x1 = -1;
  let y1 = -1;
  let x2 = -1;
  let y2 = -1;

  // Holds the box that we are currently creating
  let tmpBox = null;

  // Reference to the canvas
  const canvas = useRef(null);

  // Redraw the canvas when the boxes change
  useEffect(() => {
    redrawCanvas();
  }, [boxes]);

  // When the mouse is pressed we need to update the state of the mouse and the clicked box
  const onMouseDown = (event) => {
    const e = event.nativeEvent;
    mouseDown = true;
    clickedArea = findCurrentBox(e.offsetX, e.offsetY);
    x1 = e.offsetX;
    y1 = e.offsetY;
    x2 = e.offsetX;
    y2 = e.offsetY;
  };

  // When the mouse leaves the canvas we need to reset the state of the mouse
  const onMouseOut = () => {
    if (clickedArea?.box !== -1) {
      var selectedBox = boxes[clickedArea.box];
      if (selectedBox?.x1 > selectedBox?.x2) {
        selectedBox.x1 = selectedBox.x2;
      }
      if (selectedBox?.y1 > selectedBox?.y2) {
        selectedBox.y1 = selectedBox.y2;
      }
    }
    mouseDown = false;
    clickedArea = { box: -1, pos: "o" };
    tmpBox = null;
  };


  // When the backspace key is pressed we need to remove the box
  const onKeyDown = (event) => {
    if (event.key === "Backspace" && clickedArea.box !== -1) {
      // Get the box that we are currently interacting with
      clickedArea = findCurrentBox(x2, y2);

      // Remove the box from the list of boxes
      const filteredBoxes = boxes.filter(
        (box, index) => index !== clickedArea.box
      );

      boxes = filteredBoxes;
      redrawCanvas();
    }
  };

  // When the mouse is released we need to add the box to the list of boxes
  const onMouseUp = (event) => {
    // If we are are not in the middle of creating a box, we add the box to the list
    if (clickedArea.box === -1 && tmpBox != null) {
      boxes.push(tmpBox);
      updateBoxes(boxes);
    } else if (clickedArea.box !== -1) {
      var selectedBox = boxes[clickedArea.box];
      if (selectedBox.x1 > selectedBox.x2) {
        var previousX1 = selectedBox.x1;
        selectedBox.x1 = selectedBox.x2;
        selectedBox.x2 = previousX1;
      }
      if (selectedBox.y1 > selectedBox.y2) {
        var previousY1 = selectedBox.y1;
        selectedBox.y1 = selectedBox.y2;
        selectedBox.y2 = previousY1;
      }
    }
    // Reset the box that we are currently creating
    tmpBox = null;

    clickedArea = { box: selectedBox, pos: "i" };
    
    // Reset the state of the mouse
    mouseDown = false;
  };

  // When the mouse moves we need to update the position of the box
  const onMouseMove = (event) => {
    const e = event.nativeEvent;

    const activeBox = findCurrentBox(e.offsetX, e.offsetY);

    // If we are interacting with a box, we need to change the cursor
    if (activeBox.box !== -1) {
      canvas.current.style.cursor = "move";
    } else {
      canvas.current.style.cursor = "default";
    }

    // If the mouse is down and we are not interacting with a box, we are creating a new box
    if (mouseDown && clickedArea.box === -1) {
      x2 = e.offsetX;
      y2 = e.offsetY;
      redrawCanvas();
    } else if (mouseDown && clickedArea.box !== -1) {
      x2 = e.offsetX;
      y2 = e.offsetY;
      let xOffset = x2 - x1;
      let yOffset = y2 - y1;
      x1 = x2;
      y1 = y2;

      // If the indicator is inside, top left, left or bottom left then add to the x1 offset
      if (
        clickedArea.pos === "i" ||
        clickedArea.pos === "tl" ||
        clickedArea.pos === "l" ||
        clickedArea.pos === "bl"
      ) {
        boxes[clickedArea.box].x1 += xOffset;
      }

      // If the indicator is inside, top left, top or top right add to the y1 offset
      if (
        clickedArea.pos === "i" ||
        clickedArea.pos === "tl" ||
        clickedArea.pos === "t" ||
        clickedArea.pos === "tr"
      ) {
        boxes[clickedArea.box].y1 += yOffset;
      }

      // if the indicator is the inside, top right, right or bottom right add to the x2 offset
      if (
        clickedArea.pos === "i" ||
        clickedArea.pos === "tr" ||
        clickedArea.pos === "r" ||
        clickedArea.pos === "br"
      ) {
        boxes[clickedArea.box].x2 += xOffset;
      }

      // If the indicator is the inside, bottom left, bottom or bottom right then add to the y2 offset
      if (
        clickedArea.pos === "i" ||
        clickedArea.pos === "bl" ||
        clickedArea.pos === "b" ||
        clickedArea.pos === "br"
      ) {
        boxes[clickedArea.box].y2 += yOffset;
      }
      redrawCanvas();
    }
  };

  // Redraw the canvas by iterating over the boxes and drawing them.
  const redrawCanvas = ()=> {
    let context = canvas.current.getContext("2d");
    context.clearRect(0, 0, width, height);
    context.beginPath();
    updateBoxes(boxes);
    boxes.forEach((box) => {
        drawOnCanvas(box, context);
    });
    if (clickedArea.box === -1) {
      tmpBox = newBox(x1, y1, x2, y2);
      if (tmpBox != null) {
        drawOnCanvas(tmpBox, context);
      }
    }
  }

  // Create a new box object with the given coordinates and color if the box is big enough
  // Otherwise return null
  const newBox = (x1, y1, x2, y2) => {
    let boxX1 = x1 < x2 ? x1 : x2;
    let boxY1 = y1 < y2 ? y1 : y2;
    let boxX2 = x1 > x2 ? x1 : x2;
    let boxY2 = y1 > y2 ? y1 : y2;
    if (boxX2 - boxX1 > lineOffset * 2 && boxY2 - boxY1 > lineOffset * 2) {
      return {
        x1: boxX1,
        y1: boxY1,
        x2: boxX2,
        y2: boxY2,
        lineWidth: 1,
        color,
      };
    } else {
      return null;
    }
  };

  // Draw the box on the canvas
  const drawOnCanvas = (box, context) => {
    let xCenter = box.x1 + (box.x2 - box.x1) / 2;
    let yCenter = box.y1 + (box.y2 - box.y1) / 2;

    context.strokeStyle = "#000";
    context.fillStyle = box.color;

    context.fillRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1);
    context.lineWidth = box.lineWidth;
    context.stroke();

    context.fillStyle = anchorColor;

    // Draw the top left anchor
    context.fillRect(
      box.x1 - anchorSize,
      box.y1 - anchorSize,
      2 * anchorSize,
      2 * anchorSize
    );

    // Draw the left anchor
    context.fillRect(
      box.x1 - anchorSize,
      yCenter - anchorSize,
      2 * anchorSize,
      2 * anchorSize
    );

    // Draw the bottom left anchor
    context.fillRect(
      box.x1 - anchorSize,
      box.y2 - anchorSize,
      2 * anchorSize,
      2 * anchorSize
    );

    // Draw the top anchor
    context.fillRect(
      xCenter - anchorSize,
      box.y1 - anchorSize,
      2 * anchorSize,
      2 * anchorSize
    );

    // Draw the center anchor
    context.fillRect(
      xCenter - anchorSize,
      yCenter - anchorSize,
      2 * anchorSize,
      2 * anchorSize
    );

    // Draw the bottom anchor
    context.fillRect(
      xCenter - anchorSize,
      box.y2 - anchorSize,
      2 * anchorSize,
      2 * anchorSize
    );

    // Draw the top right anchor
    context.fillRect(
      box.x2 - anchorSize,
      box.y1 - anchorSize,
      2 * anchorSize,
      2 * anchorSize
    );

    // Draw the right anchor
    context.fillRect(
      box.x2 - anchorSize,
      yCenter - anchorSize,
      2 * anchorSize,
      2 * anchorSize
    );

    // Draw the bottom right anchor
    context.fillRect(
      box.x2 - anchorSize,
      box.y2 - anchorSize,
      2 * anchorSize,
      2 * anchorSize
    );
  };

  // Find the area that the mouse is currently in and return the box and
  // the position of the mouse in the box
  const findCurrentBox = (x, y) => {
    // Map over the boxes and check if the mouse is in the area of the box
    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[i];
      let xCenter = box.x1 + (box.x2 - box.x1) / 2;
      let yCenter = box.y1 + (box.y2 - box.y1) / 2;
      if (box.x1 - lineOffset < x && x < box.x1 + lineOffset) {
        if (box.y1 - lineOffset < y && y < box.y1 + lineOffset) {
          return { box: i, pos: "tl" };
        } else if (box.y2 - lineOffset < y && y < box.y2 + lineOffset) {
          return { box: i, pos: "bl" };
        } else if (yCenter - lineOffset < y && y < yCenter + lineOffset) {
          return { box: i, pos: "l" };
        }
      } else if (box.x2 - lineOffset < x && x < box.x2 + lineOffset) {
        if (box.y1 - lineOffset < y && y < box.y1 + lineOffset) {
          return { box: i, pos: "tr" };
        } else if (box.y2 - lineOffset < y && y < box.y2 + lineOffset) {
          return { box: i, pos: "br" };
        } else if (yCenter - lineOffset < y && y < yCenter + lineOffset) {
          return { box: i, pos: "r" };
        }
      } else if (xCenter - lineOffset < x && x < xCenter + lineOffset) {
        if (box.y1 - lineOffset < y && y < box.y1 + lineOffset) {
          return { box: i, pos: "t" };
        } else if (box.y2 - lineOffset < y && y < box.y2 + lineOffset) {
          return { box: i, pos: "b" };
        } else if (box.y1 - lineOffset < y && y < box.y2 + lineOffset) {
          return { box: i, pos: "i" };
        }
      } else if (box.x1 - lineOffset < x && x < box.x2 + lineOffset) {
        if (box.y1 - lineOffset < y && y < box.y2 + lineOffset) {
          return { box: i, pos: "i" };
        }
      }
    }
    return { box: -1, pos: "o" };
  };

  return (
    <canvas
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseOut={onMouseOut}
      onKeyDown={onKeyDown}
      ref={canvas}
      tabindex="1"
      id="canvas"
      width={width}
      height={height}
    ></canvas>
  );
}

export default RectangleBuilder;
