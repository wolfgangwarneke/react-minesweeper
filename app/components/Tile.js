import React from "react";

class Tile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flagIndex: 0
    };
    this.handleClick = this.handleClick.bind(this);
    this.advanceFlagIndex = this.advanceFlagIndex.bind(this);
    this.getDisplay = this.getDisplay.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reset && this.state.flagIndex > 0) {
      this.setState({
        flagIndex: 0
      });
    }
  }
  handleClick(e) {
    if (e.type === 'click' && this.state.flagIndex === 0) {
      if (!this.props.clicked) this.props.handleClick();
    };
    if (e.type === 'contextmenu') this.advanceFlagIndex();
  }
  advanceFlagIndex() {
    this.setState({
      flagIndex: (this.state.flagIndex + 1) % 3
    })
  }
  getDisplay() {
    if (this.props.clicked) {
      if (this.props.hasMine) {
        return <i className="fa fa-bomb"></i>
      }
      return this.props.number || '';
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
  renderClass() {
    if (!this.props.clicked){
      return 'tile unclicked';
    }
    return `tile number-${this.props.number}`;
  }
  render() {
    return (
      <div className={this.renderClass()} onClick={this.handleClick} onContextMenu={this.handleClick} style={{
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
