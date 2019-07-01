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
    const classes = [
      'tile',
      this.props.clicked && 'clicked',
      this.props.clicked && this.props.hasMine && 'clicked-mine',
      this.props.triggeredMine && this.props.hasMine && 'triggered-mine',
      this.props.clicked && this.props.number && `number-${this.props.number}`
    ];
    return classes.filter(c => c).join(' ');
  }
  render() {
    return (
      <div className={this.renderClass()} onClick={this.handleClick} onContextMenu={this.handleClick} style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        border: '3px inset',
        borderColor: 'rgb(255, 255, 255) rgb(82, 82, 82) rgb(93, 93, 93) rgb(230, 230, 230)',
        width: '32px',
        height: '32px'
      }}>
        {this.getDisplay()}
      </div>
    );
  }
}

export default Tile;
