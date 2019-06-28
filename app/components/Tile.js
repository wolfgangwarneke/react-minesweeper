import React from "react";

document.oncontextmenu = () => false;

class Tile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      flagIndex: 0,
    };
    this.handleClick = this.handleClick.bind(this);
    this.advanceFlagIndex = this.advanceFlagIndex.bind(this);
    this.getDisplay = this.getDisplay.bind(this);
  }
  handleClick(e) {
    if (e.type === 'click' && this.state.flagIndex === 0) console.log('left click');
    if (e.type === 'contextmenu') this.advanceFlagIndex();
  }
  advanceFlagIndex() {
    this.setState({
      flagIndex: (this.state.flagIndex + 1) % 3
    })
  }
  getDisplay() {
    if (this.state.clicked) {
      return 'has been clicked!';
    }
    return this.getFlagDisplay();
  }
  getFlagDisplay() {
    return [
      '',
      <i className="fa fa-flag"></i>,
      <i className="fa fa-question"></i>
    ][this.state.flagIndex];
  }
  render() {
    return (
      <div className={this.props.hasMine ? 'mine' : ''} onClick={this.handleClick} onContextMenu={this.handleClick} style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid black',
        width: '50px',
        height: '50px'
      }}>
        {this.getDisplay()}
      </div>
    );
  }
}

export default Tile;
