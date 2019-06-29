import React from 'react';
import Tile from './Tile';

document.oncontextmenu = () => false;

class Minesweeper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      game: null
    };
    this.handleTileClick = this.handleTileClick.bind(this);
  }
  startGame(rows = 10, cols = 10, mineCount = 10) {
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
        if (!grid[coords[0]][coords[1]]) {
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
      game: 'playing',
      tiles: getTiles()
    });
  }
  handleTileClick([rowIndex, colIndex]) {
    const selectedTile = this.state.tiles[rowIndex][colIndex];
    if (!selectedTile.clicked) {
      const updatedTiles = this.state.tiles;
      updatedTiles[rowIndex][colIndex] = {
        ...selectedTile,
        clicked: true
      };
      this.setState({ tiles: updatedTiles });
    }
  }
  render() {
    return this.state.game ?
      <div>
        <h1>this is minesweeper</h1>
        {this.state.tiles.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((tileProps, colIndex) => <Tile key={tileProps.index.join('')} {...tileProps} handleClick={() => this.handleTileClick(tileProps.index)} />)}
          </div>
        ))}
      </div>
      :
      <div onClick={() => this.startGame()}>
        Start
      </div>  
    ;
  }
}

export default Minesweeper;
