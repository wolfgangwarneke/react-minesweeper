import React from 'react';
import Tile from './Tile';
import SmileStatus from './SmileStatus';

document.oncontextmenu = () => false;

// TODO decrement left 'mine' display on flag placement
// TODO componetize controls
// TODO even more style!
// TODO look for logic refactors

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
  componentDidUpdate() {
    if (!this.state.game.winState) {
      const winning = this.state.tiles.every((row) => {
        return row.every(tile => tile.hasMine || tile.clicked);
      });
      if (winning) {
        this.setState({
          game: {
            ...this.state.game,
            winState: 'win'
          }
        }, () => this.stopTimer());
      }
    }
  }
  getDifficultySettings(difficulty) {
    return {
      easy: [9, 9, 10],
      medium: [16, 16, 40],
      expert: [16, 30, 99]
    }[difficulty || this.state.difficulty || 'easy'];
  }
  setupGame(difficulty) {
    this.stopTimer();
    const [rows, cols, mineCount] = this.getDifficultySettings(difficulty);
    const getTiles = () => {
      const grid = Array(rows).fill(null).map(() => Array(cols).fill(null));
      return grid.map((row, rowIndex) => row.map((col, colIndex) => ({
        index: [rowIndex, colIndex]
      })));
    }
    this.setState({
      game: {
        status: 'ready',
        winState: null,
        rows: rows,
        cols: cols,
        mineCount: mineCount,
        clicks: 0,
        difficulty: difficulty
      },
      tiles: getTiles()
    });
  }
  startGame(firstClickIndex) {
    this.stopTimer();
    const { rows, cols, mineCount } = this.state.game;
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
        status: 'playing',
        timer: 0
      },
      tiles: getTiles()
    }, () => {
      this.startTimer();
      this.handleTileClick(firstClickIndex)
    });
  }
  startTimer() {
    const timerID = setInterval(() => {
      this.setState({
        game: {
          ...this.state.game,
          timer: this.state.game.timer + 1,
          timerID: timerID
        }
      });
    }, 1000);
  }
  stopTimer() {
    clearInterval(this.state.game.timerID);
    this.setState({
      game: {
        ...this.state.game,
        timerID: null
      }
    });
  }
  handleTileClick([rowIndex, colIndex], recursiveCallFinal = false) {
    const { game } = this.state;
    const selectedTile = this.state.tiles[rowIndex][colIndex];
    if (!selectedTile.clicked && !this.state.game.winState) {
      let updatedTiles = this.state.tiles;
      updatedTiles[rowIndex][colIndex] = {
        ...selectedTile,
        clicked: true
      };
      if (selectedTile.hasMine) {
        updatedTiles = updatedTiles.map((row, i) => row.map((tileInfo, j) => {
          if (tileInfo.hasMine) {
            return (rowIndex === i && colIndex === j) ? {
              ...tileInfo,
              triggeredMine: true,
              clicked: true
            } : {
              ...tileInfo,
              clicked: true
            };
          };
          return tileInfo;
        }));
      }
      this.setState({
        game: {
          ...this.state.game,
          winState: selectedTile.hasMine ? 'lose' : this.state.game.winState,
          clicks: this.state.game.clicks + 1
        },
        tiles: updatedTiles
      }, () => {
        if (selectedTile.hasMine) {
          this.stopTimer();
        }
      });
      if (selectedTile.number === 0) {
        for (let i = rowIndex - 1; i <= rowIndex + 1; i += 1) {
          for (let j = colIndex - 1; j <= colIndex + 1; j += 1) {
            if (i >= 0 && i < game.rows && j >= 0 && j < game.cols) {
              this.handleTileClick([i, j]);
            }
          }
        }
      }
    }
  }
  render() {
    return (
      <div className="Minesweeper">
        <div className="status-bar status-bar-main">
          <div>{this.state.game.mineCount || 0}</div>
          <div>
            <SmileStatus status={this.state.game.winState || this.state.game.status} onClick={() => this.setupGame()} />
          </div>
          <div className="status-bar-timer">{this.state.game.timer || 0}</div>
        </div>
        <div className="tile-grid-block">
          {
            this.state.game.status === 'playing' ?
            <div className="tile-grid-container">
              {this.state.tiles.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                  {row.map((tileProps, colIndex) => <Tile key={tileProps.index.join('')} {...tileProps} handleClick={() => this.handleTileClick(tileProps.index)} />)}
                </div>
              ))}
            </div>
            :
            <div className="tile-grid-container">
              {this.state.tiles.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                  {row.map((tileProps, colIndex) => <Tile key={tileProps.index.join('')} handleClick={() => this.startGame(tileProps.index)} reset />)}
                </div>
              ))}
            </div>  
          }
        </div>
        <div className="status-bar difficulty">
          <div onClick={() => this.setState({
            difficulty: 'easy'
          }, () => this.setupGame())}>easy</div>
          <div onClick={() => this.setState({
            difficulty: 'medium'
          }, () => this.setupGame())}>medium</div>
          <div onClick={() => this.setState({
            difficulty: 'expert'
          }, () => this.setupGame())}>expert</div>
        </div>
      </div>
    );
  }
}

export default Minesweeper;
