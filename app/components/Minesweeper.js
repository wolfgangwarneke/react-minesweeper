import React from 'react';
import Tile from './Tile';

document.oncontextmenu = () => false;

class Minesweeper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      game: {
        status: 'unmounted'
      },
      tiles: []
    };
    this.handleTileClick = this.handleTileClick.bind(this);
  }
  componentDidMount() {
    this.setupGame();
  }
  setupGame(rows = 10, cols = 10, mineCount = 10) {
    const getTiles = () => {
      const grid = Array(rows).fill(null).map(() => Array(cols).fill(null));
      return grid.map((row, rowIndex) => row.map((col, colIndex) => ({
        index: [rowIndex, colIndex]
      })));
    }
    this.setState({
      game: {
        status: 'ready',
        rows: rows,
        cols: cols,
        mineCount: mineCount
      },
      tiles: getTiles()
    });
  }
  startGame(firstClickIndex) {
    const { rows, cols, mineCount } = this.state.game;
    console.log('starting game', rows, cols, mineCount);
    const getTiles = () => {
      const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
      }
      let minesToPlace = mineCount;
      const grid = Array(rows).fill(null).map(() => Array(cols).fill(null));
      while (minesToPlace) {
        const coords = [getRandomInt(0, rows), getRandomInt(0, cols)];
        const coordsMatchFirstClickedTile = firstClickIndex[0] === coords[0] && firstClickIndex[1] === coords[1];
        if (!coordsMatchFirstClickedTile && !grid[coords[0]][coords[1]]) {
          grid[coords[0]][coords[1]] = true;
          minesToPlace -= 1;
        }
      }
      const gridMinesPlaced = grid.map((row, rowIndex) => row.map((bool, colIndex) => {
        return {
          hasMine: bool,
          clicked: false,
          index: [rowIndex, colIndex]
        };
      }));
      const getTileNumber = (grid, [rowIndex, colIndex]) => {
        if (grid[rowIndex][colIndex].hasMine) {
          return null;
        }
        let totalProximityMines = 0;
        for (let i = rowIndex - 1; i <= rowIndex + 1; i += 1) {
          for (let j = colIndex - 1; j <= colIndex + 1; j += 1) {
            if (i >= 0 && i < rows && j >= 0 && j < cols) {
              if (grid[i][j].hasMine) {
                totalProximityMines += 1;
              }
            }
          }
        }
        return totalProximityMines;
      }
      const gridNumbersPlaced = gridMinesPlaced.map(row => row.map(tileObject => {
        return {
          ...tileObject,
          number: getTileNumber(gridMinesPlaced, tileObject.index)
        };
      }));
      return gridNumbersPlaced;
    }
    this.setState({
      game: {
        ...this.state.game,
        status: 'playing'
      },
      tiles: getTiles()
    }, () => this.handleTileClick(firstClickIndex));
  }
  handleTileClick([rowIndex, colIndex], recursiveCallFinal = false) {
    const selectedTile = this.state.tiles[rowIndex][colIndex];
    if (!selectedTile.clicked) {
      if (selectedTile.hasMine) {
        console.log('YOU HAVE LOST.');
      }
      const updatedTiles = this.state.tiles;
      updatedTiles[rowIndex][colIndex] = {
        ...selectedTile,
        clicked: true
      };
      this.setState({ tiles: updatedTiles });
      if (selectedTile.number === 0) {
        const neighbors = { // TODO avoid magic constants
          up: (rowIndex - 1 >= 0 && rowIndex - 1 < 10 && colIndex >= 0 && colIndex < 10) && updatedTiles[rowIndex - 1][colIndex],
          right: (rowIndex  >= 0 && rowIndex < 10 && (colIndex + 1) >= 0 && (colIndex + 1) < 10) && updatedTiles[rowIndex][colIndex + 1],
          down: (rowIndex + 1 >= 0 && rowIndex + 1 < 10 && colIndex >= 0 && colIndex < 10) && updatedTiles[rowIndex + 1][colIndex],
          left: (rowIndex  >= 0 && rowIndex < 10 && (colIndex - 1) >= 0 && (colIndex - 1) < 10) && updatedTiles[rowIndex][colIndex - 1]
        };
        Object.values(neighbors).map((tile) => {
          if (tile) {
            this.handleTileClick(tile.index);
          }
        });
      }
    }
  }
  render() {
    return this.state.game.status === 'playing' ?
      <div>
        <h1>this is minesweeper</h1>
        {this.state.tiles.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((tileProps, colIndex) => <Tile key={tileProps.index.join('')} {...tileProps} handleClick={() => this.handleTileClick(tileProps.index)} />)}
          </div>
        ))}
      </div>
      :
      <div>
        <h1>please begin minesweeper</h1>
        {this.state.tiles.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((tileProps, colIndex) => <Tile key={tileProps.index.join('')} handleClick={() => this.startGame(tileProps.index)} />)}
          </div>
        ))}
      </div>  
    ;
  }
}

export default Minesweeper;
