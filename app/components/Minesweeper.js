import React from 'react';
import Tile from './Tile';

class Minesweeper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      game: null
    };
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
      return grid.map(row => row.map(bool => <Tile hasMine={bool} />));
    }
    this.setState({
      game: 'playing',
      tiles: getTiles()
    });
  }
  render() {
    return this.state.game ?
      <div>
        <h1>this is minesweeper</h1>
        {this.state.tiles.map(row => (
          <div style={{ display: 'flex' }}>
            {row}
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
