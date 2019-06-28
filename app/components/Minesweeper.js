import React from 'react';
import Tile from './Tile';

class Minesweeper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      game: null
    };
  }
  startGame() {
    this.setState({
      game: 'playing'
    });
  }
  render() {
    return this.state.game ?
      <div>
        <h1>this is minesweeper</h1>
        <Tile />
        <Tile />
        <Tile />
      </div>
      :
      <div onClick={() => this.startGame()}>
        Start
      </div>  
    ;
  }
}

export default Minesweeper;
