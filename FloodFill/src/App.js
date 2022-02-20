import "./styles.css";
import { useState, useEffect } from "react";
export default function App() {
  //we are making a flag to toggle the state
  //if flag is false it means you can select the blockages
  //if flag is true, which happens when you push the start button, then click on any tile and algo will start from there
  const [flag, setflag] = useState(false);

  //making grid and visited grid
  let grid = [];
  const color = "#FFD32D";
  let n = 10;
  let m = 10;
  for (var i = 0; i < n; i++) {
    let row = [];
    for (var j = 0; j < m; j++) {
      row.push(0);
    }
    grid.push(row);
  }
  const visited = new Array(n).fill(false);
  visited.forEach((e, i, a) => (visited[i] = new Array(m).fill(false)));

  //so when we are selecting blockages, we want click and drag kinda feature
  let onclick = (e, row, col) => {
    e.preventDefault();
    if (e.buttons !== 1) return;
    e.target.style.backgroundColor = "black";
  };

  //this ensures when our algo reaches an unvisited tile, it changes it's color
  const changeColor = (e, row, col) => {
    const class1 = `.kk${row}-${col}`; //this is the unique class name that I have given to every tile of the grid
    document.querySelector(class1).style.backgroundColor = color;
  };

  //this tells curren tile's color
  const curr = (e, row, col) => {
    const class1 = `.kk${row}-${col}`;
    return document.querySelector(class1).style.backgroundColor;
  };

  //this our main algorithm that we have implemented recursively
  const runFillFloodAlgo = async (e, row, col) => {
    if (row < 0 || col < 0 || row >= m || col >= n) return;
    const current_color = curr(e, row, col);
    if (current_color === "black") return;
    if (grid[row][col] === 1) return;
    if (visited[row][col]) return;

    //we are pausing our algo, to see the actual working
    await new Promise((resolve) => {
      setTimeout(resolve, 300);
    });
    visited[row][col] = true;
    changeColor(e, row, col);

    await runFillFloodAlgo(e, row - 1, col);
    await runFillFloodAlgo(e, row + 1, col);
    await runFillFloodAlgo(e, row, col - 1);
    await runFillFloodAlgo(e, row, col + 1);
    return;
  };

  //this is also our algorithm but we haven't used recursion, rather we use a queue here
  const bfs = async (e, row, col) => {
    let queue = [[row, col]];

    while (queue.length > 0) {
      const [r, c] = queue[0];
      queue = queue.slice(1);

      if (r < 0 || r >= n || c < 0 || c >= m) continue;
      const current_color = curr(e, r, c);
      if (current_color === "black") continue;
      if (visited[r][c]) continue;
      visited[r][c] = true;

      await new Promise((resolve) => setTimeout(resolve, 300));
      changeColor(e, r, c);
      queue.push([r - 1, c]);
      queue.push([r + 1, c]);
      queue.push([r, c - 1]);
      queue.push([r, c + 1]);
    }
  };
  //this happens when we click a tile after clicking start button, this starts our algorithm
  const algostart = async (e, row, col) => {
    document.querySelector(".grid").style.pointerEvents = "none";
    bfs(e, row, col);
    // await runFillFloodAlgo(e, row, col);
    setflag(false);
  };

  //we are returning the jsx representing our grid
  return (
    <div className="grid">
      <button
        onClick={() => {
          setflag(true);
        }}
      >
        Start
      </button>

      {!flag
        ? grid.map((row, rowid) => {
            return (
              <div key={rowid}>
                {row.map((node, nodeid) => {
                  return (
                    <div
                      onMouseEnter={(e) => {
                        onclick(e, rowid, nodeid);
                      }}
                      onMouseDown={(e) => {
                        onclick(e, rowid, nodeid);
                      }}
                      className={`kk${rowid}-${nodeid} node`}
                    ></div>
                  );
                })}
              </div>
            );
          })
        : grid.map((row, rowid) => {
            return (
              <div key={rowid}>
                {row.map((node, nodeid) => {
                  return (
                    <div
                      onClick={(e) => algostart(e, rowid, nodeid)}
                      className={`kk${rowid}-${nodeid} node`}
                    ></div>
                  );
                })}
              </div>
            );
          })}
    </div>
  );
}
