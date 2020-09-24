import React, {useState, useEffect} from 'react';
import './index.css'

const Game = () => {

    let [cellSize, setCellSize] = useState(5)
    const [canvasWidth, setCanvasWidth] = useState(1800)
    const [canvasHeight, setCanvasHeight] = useState(700)
    const dead = `#000000`
    const alive = `#FFFFFF`
    const defaultColumns = Math.floor(canvasWidth / cellSize)
    const defaultRows = Math.floor(canvasWidth / cellSize)

    let [columns, setColumns] = useState(defaultColumns)
    let [rows, setRows] = useState(defaultRows)
    let [counter, setCounter] = useState(0)
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
                let cellMatrix = canvas.getContext("2d")
                let color;
                if (active_array[i][j] === 1)
                    color = alive;
                else
                    color = dead;
                cellMatrix.fillStyle = color;
                cellMatrix.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
        }
    }

    const runGame = () => {
        updateLifeCycle()
        fillArray()
    }
    
    const start = () => {
        let count = 0
        randomArray()
        fillArray()
        window.setInterval(() => {runGame()}, 250)
        window.setInterval(() => {setCounter(count++)}, 125)
    }

    const stop = () => {
        window.location.reload(true)
    }

    const speedUp = () => {
        let count = 0
        randomArray()
        fillArray()
        window.setInterval(() => {runGame()}, 25)
        window.setInterval(() => {setCounter(count++)}, 25)
    }

    const slowDown = () => {
        let count = 0
        randomArray()
        fillArray()
        window.setInterval(() => {runGame()}, 750)
        window.setInterval(() => {setCounter(count++)}, 750)
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
        const total = countNeighbors(row, col)
        if (total > 4 || total < 3) {
            return 0
        }
        else if (active_array[row][col] === 0 && total === 3) {
            return 1
        }
        else {
            return active_array[row][col]
        }
    }

    const updateLifeCycle = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                let new_state = updateCellValue(i, j)
                inactive_array[i][j] = new_state
            }
        }
        active_array = inactive_array
    }

    const pinkMe = () => {
        var body = document.getElementById("fullBody");
        body.classList.toggle('body_toggle')
      }

    const rules = () => {
        window.open("https://docs.google.com/document/d/1lzFEJkdYtdykPgNplpbIguoJAXBvQwt6MIsZliJ2Ljg/edit?usp=sharing", '_blank')
    }

    return (
        <div>
            <canvas id="canvas" width={canvasWidth} height={canvasHeight}></canvas>
            <h1>ΖΩΗ</h1>
            <button>Generation: {counter}</button>
            <div class="buttons-div">
                <button onClick={start}>start</button>
                <button onClick={slowDown}>slow down</button>
                <button onClick={speedUp}>speed up</button>
                <button onClick={stop}>stop</button>
                <button id="pinkButton" onClick={pinkMe}>PINK ME!!!</button>
                <button onClick={rules}>About</button>
            </div>
            <label style={{color: 'white'}}>Set the Canvas Height </label>
            <input
                type="text"
                style={{backgroundColor:`#FFFFFF`}}
                value={canvasHeight}
                onChange={e => setCanvasHeight(e.target.value)}
            />
        </div>
    )
}

export default Game
