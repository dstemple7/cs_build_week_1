import React, {useState, useEffect} from 'react';
import './index.css'

const Game = () => {

    const [cellSize, setCellSize] = useState(8)
    const [canvasWidth, setCanvasWidth] = useState(1500)
    const [canvasHeight, setCanvasHeight] = useState(750)
    const dead = `#000000`
    const alive = `#FFFFFF`
    const defaultColumns = Math.floor(canvasWidth / cellSize)
    const defaultRows = Math.floor(canvasWidth / cellSize)
    const [columns, setColumns] = useState(defaultColumns)
    const [rows, setRows] = useState(defaultRows)
    let active_array = []
    let inactive_array = []

    const arrayInit = () => {
        for (let i = 0; i < rows; i++){
            active_array[i] = [];
            for (let j = 0; j < columns; j++){
                active_array[i][j] = 0;
            }
        }
        inactive_array = active_array
    }

    const gameSetUp = () => {
        arrayInit();
    };

    useEffect(() => {
        arrayInit()
    }, [])

     const randomArray = () => {
        for (let i = 0; i < rows; i++){
            for (let j = 0; j < columns; j++){
                active_array[i][j] = (Math.random() > 0.5) ? 1 : 0;
            }
        }
    }
    
    const fillArray = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                let canvas = document.querySelector("#canvas")
                let ctx = canvas.getContext("2d")
                let color;
                if (active_array[i][j] === 1)
                    color = alive;
                else
                    color = dead;
                ctx.fillStyle = color;
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
        }
    };

    const runGame = () => {
        updateLifeCycle();
        fillArray();
    };

    
    const start = () => {
        randomArray()
        fillArray()
        window.setInterval(() => {runGame()}, 250)
    }

    const speedUp = () => {
        randomArray()
        fillArray()
        window.setInterval(() => {runGame()}, 25)
    }

    const slowDown = () => {
        randomArray()
        fillArray()
        window.setInterval(() => {runGame()}, 750)
    }

    const stop = () => {
        gameSetUp()
    }

    const cellCountNeighbors = (row, col) => {
        try {
            return active_array[row][col];
        }
        catch {
            return 0;
        }
    };

    const countNeighbors = (row, col) => {
        let total_neighbors = 0;
        total_neighbors += cellCountNeighbors(row - 1, col - 1);
        total_neighbors += cellCountNeighbors(row - 1, col);
        total_neighbors += cellCountNeighbors(row - 1, col + 1);
        total_neighbors += cellCountNeighbors(row, col - 1);
        total_neighbors += cellCountNeighbors(row, col + 1);
        total_neighbors += cellCountNeighbors(row + 1, col - 1);
        total_neighbors += cellCountNeighbors(row + 1, col);
        total_neighbors += cellCountNeighbors(row + 1, col + 1);
        return total_neighbors;
    };

    const updateCellValue = (row, col) => {
        const total = countNeighbors(row, col);
        if (total > 4 || total < 3) {
            return 0;
        }
        else if (active_array[row][col] === 0 && total === 3) {
            return 1;
        }
        else {
            return active_array[row][col];
        }
    };

    const updateLifeCycle = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                let new_state = updateCellValue(i, j);
                inactive_array[i][j] = new_state;
            }
        }
        active_array = inactive_array
    };

    const pinkMe = () => {
        var body = document.getElementById("fullBody");
        body.classList.toggle('body_toggle')
      }

    return (
        <div>
            <canvas id="canvas" width={canvasWidth} height={canvasHeight}></canvas>
            <h1>ΖΩΗ</h1>
            <div class="buttons-div">
                <button onClick={start}>start</button>
                <button onClick={slowDown}>slow down</button>
                <button onClick={speedUp}>speed up</button>
                <button onClick={stop}>stop</button>
                <button id="pinkButton" onClick={pinkMe}>PINK ME!!!</button>
            </div>
            <input 
                type="text"
                style={{backgroundColor:`#FFFFFF`}}
                placeholder='Canvas Height, init = 800' 
                min = {200}
                max = {1600}
                value={canvasHeight}
                onChange={e => setCanvasHeight(e.target.value)}
            />
        </div>
    )
}

export default Game
