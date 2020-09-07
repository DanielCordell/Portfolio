import React from 'react';

class Background extends React.Component {
  canvasRef = React.createRef(null);

  circles = [];

  interval = null;

  INTERVAL_MILLIS = 15;

  SIZECONST = 4;

  colourScheme = null;

  constructor(props) {
    super(props);

    this.colourScheme = props.colourSchemes[props.colourSchemeIndex];

    window.addEventListener('resize', this.windowResize);
    this.state = { width: window.innerWidth, height: window.innerHeight };

    this.initCircles();
    this.interval = setInterval(this.draw, this.INTERVAL_MILLIS);
  }

  windowResize = () => {
    if (this.canvasRef.current) 
      this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  componentDidUpdate() {
    this.draw();
  }

  getRandomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

  getRandomPosNeg = () => this.getRandomBetween(0, 1) === 0 ? -1 : 1;

  initCircles = () => {
    const count = this.getRandomBetween(4, 6);
    // Generate 4-8 random circles
    for (let i = 0; i < count; ++i) {
      const radius = (this.getRandomBetween(5, 12)) * this.state.width / 150;
      this.circles.push({
        radius: radius,
        x: this.getRandomBetween(radius, this.state.width - radius),
        y: this.getRandomBetween(radius + 56, this.state.height - radius), // height of navbar
        velX: this.getRandomBetween(75, 125) * this.getRandomPosNeg(),
        velY: this.getRandomBetween(75, 125) * this.getRandomPosNeg(),
      });
    }
  }

  draw = () => {
    if (!this.canvasRef.current) return;
    const ctx = this.canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, this.state.width, this.state.height);
    ctx.fillStyle = "#343a40";
    ctx.fillRect(0, 0, this.state.width, this.state.height);
    // Update circles
    if (!this.props.stillMode) this.circles.forEach(circle => {
      // Move Circle
      circle.x += circle.velX * (this.INTERVAL_MILLIS/1000);
      circle.y += circle.velY * (this.INTERVAL_MILLIS/1000);

      // Bounce Circle
      if (circle.x > this.state.width - circle.radius) {
        circle.x = this.state.width - circle.radius;
        circle.velX *= -1;
      }
      else if (circle.x < circle.radius) {
        circle.x = circle.radius;
        circle.velX *= -1;
      }
      if (circle.y > this.state.height - circle.radius) {
        circle.y = this.state.height - circle.radius;
        circle.velY *= -1;
      }
      else if (circle.y < circle.radius + 68) {
        circle.y = circle.radius + 68;
        circle.velY *= -1;
      }
    });
    
    // Draw points
    for (let x = 0; x <= this.state.width; x += this.SIZECONST * 2) {
      for (let y = 0; y <= this.state.height; y += this.SIZECONST * 2) {
        const marchingBinary = this.calculateMarching(x, y);
        
        this.drawCell(ctx, x, y, marchingBinary);
      }
    }
    
  }

  getMetaballData = (x, y) => {
    const data = this.circles.map(circle => {
      return (circle.radius * circle.radius) / (Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2))      
    });

    return data.reduce((a, b) => a + b, 0);
  }

  drawCell = (ctx, x, y, marchingBinary) => {
    let coords = []
    switch (marchingBinary) {
      case 1: coords = [{x: x-this.SIZECONST, y: this.linearInterpolate(x - this.SIZECONST, y + this.SIZECONST, x - this.SIZECONST, y - this.SIZECONST, false)}, {x: this.linearInterpolate(x + this.SIZECONST, y + this.SIZECONST, x - this.SIZECONST, y + this.SIZECONST, true), y: y+this.SIZECONST}, {x: x-this.SIZECONST, y: y+this.SIZECONST}]; break;
      case 2: coords = [{x: x+this.SIZECONST, y: this.linearInterpolate(x + this.SIZECONST, y + this.SIZECONST, x + this.SIZECONST, y - this.SIZECONST, false)}, {x: this.linearInterpolate(x + this.SIZECONST, y + this.SIZECONST, x - this.SIZECONST, y + this.SIZECONST, true), y: y+this.SIZECONST}, {x: x+this.SIZECONST, y: y+this.SIZECONST}]; break;
      case 3: coords = [{x: x-this.SIZECONST, y: this.linearInterpolate(x - this.SIZECONST, y - this.SIZECONST, x - this.SIZECONST, y + this.SIZECONST, false)}, {x: x+this.SIZECONST, y: this.linearInterpolate(x + this.SIZECONST, y - this.SIZECONST, x + this.SIZECONST, y + this.SIZECONST, false)}, {x: x+this.SIZECONST, y: y+this.SIZECONST}, {x: x-this.SIZECONST, y: y+this.SIZECONST}]; break;
      case 4: coords = [{x: x+this.SIZECONST, y: this.linearInterpolate(x + this.SIZECONST, y + this.SIZECONST, x + this.SIZECONST, y - this.SIZECONST, false)}, {x: this.linearInterpolate(x + this.SIZECONST, y - this.SIZECONST, x - this.SIZECONST, y - this.SIZECONST, true), y: y-this.SIZECONST}, {x: x+this.SIZECONST, y: y-this.SIZECONST}]; break;
      case 5: coords = [{x: x-this.SIZECONST, y: y+this.SIZECONST}, {x: x-this.SIZECONST, y: this.linearInterpolate(x - this.SIZECONST, y + this.SIZECONST, x - this.SIZECONST, y - this.SIZECONST, false)}, {x: this.linearInterpolate(x - this.SIZECONST, y - this.SIZECONST, x + this.SIZECONST, y - this.SIZECONST, true), y: y-this.SIZECONST}, {x: x+this.SIZECONST, y: y-this.SIZECONST}, {x: x+this.SIZECONST, y: this.linearInterpolate(x + this.SIZECONST, y + this.SIZECONST, x + this.SIZECONST, y - this.SIZECONST, false)}, {x: this.linearInterpolate(x + this.SIZECONST, y + this.SIZECONST, x - this.SIZECONST, y + this.SIZECONST, true), y: y+this.SIZECONST}]; break;
      case 6: coords = [{x: x+this.SIZECONST, y: y+this.SIZECONST}, {x: this.linearInterpolate(x + this.SIZECONST, y + this.SIZECONST, x - this.SIZECONST, y + this.SIZECONST, true), y: y+this.SIZECONST}, {x: this.linearInterpolate(x + this.SIZECONST, y - this.SIZECONST, x - this.SIZECONST, y - this.SIZECONST, true), y: y-this.SIZECONST}, {x: x+this.SIZECONST, y: y-this.SIZECONST}]; break;
      case 7: coords = [{x: x-this.SIZECONST, y: y+this.SIZECONST}, {x: x-this.SIZECONST, y: this.linearInterpolate(x - this.SIZECONST, y + this.SIZECONST, x - this.SIZECONST, y - this.SIZECONST, false)}, {x: this.linearInterpolate(x + this.SIZECONST, y - this.SIZECONST, x - this.SIZECONST, y - this.SIZECONST, true), y: y-this.SIZECONST}, {x: x+this.SIZECONST, y: y-this.SIZECONST}, {x: x+this.SIZECONST, y: y+this.SIZECONST}]; break;
      case 8: coords = [{x: x-this.SIZECONST, y: this.linearInterpolate(x - this.SIZECONST, y + this.SIZECONST, x - this.SIZECONST, y - this.SIZECONST, false)}, {x: this.linearInterpolate(x + this.SIZECONST, y - this.SIZECONST, x - this.SIZECONST, y - this.SIZECONST, true), y: y-this.SIZECONST}, {x: x-this.SIZECONST, y: y-this.SIZECONST}]; break;
      case 9: coords = [{x: x-this.SIZECONST, y: y+this.SIZECONST}, {x: this.linearInterpolate(x + this.SIZECONST, y + this.SIZECONST, x - this.SIZECONST, y + this.SIZECONST, true), y: y+this.SIZECONST}, {x: this.linearInterpolate(x + this.SIZECONST, y - this.SIZECONST, x - this.SIZECONST, y - this.SIZECONST, true), y: y-this.SIZECONST}, {x: x-this.SIZECONST, y: y-this.SIZECONST}]; break;
      case 10: coords = [{x: x+this.SIZECONST, y: y+this.SIZECONST}, {x: x+this.SIZECONST, y: this.linearInterpolate(x - this.SIZECONST, y + this.SIZECONST, x - this.SIZECONST, y - this.SIZECONST, false)}, {x: this.linearInterpolate(x - this.SIZECONST, y - this.SIZECONST, x + this.SIZECONST, y - this.SIZECONST, true), y: y-this.SIZECONST}, {x: x-this.SIZECONST, y: y-this.SIZECONST}, {x: x-this.SIZECONST, y: this.linearInterpolate(x + this.SIZECONST, y + this.SIZECONST, x + this.SIZECONST, y - this.SIZECONST, false)}, {x: this.linearInterpolate(x + this.SIZECONST, y + this.SIZECONST, x - this.SIZECONST, y + this.SIZECONST, true), y: y+this.SIZECONST}]; break;
      case 11: coords = [{x: x+this.SIZECONST, y: y+this.SIZECONST}, {x: x+this.SIZECONST, y: this.linearInterpolate(x + this.SIZECONST, y + this.SIZECONST, x + this.SIZECONST, y - this.SIZECONST, false)}, {x: this.linearInterpolate(x + this.SIZECONST, y - this.SIZECONST, x - this.SIZECONST, y - this.SIZECONST, true), y: y-this.SIZECONST}, {x: x-this.SIZECONST, y: y-this.SIZECONST}, {x: x-this.SIZECONST, y: y+this.SIZECONST}]; break;
      case 12: coords = [{x: x-this.SIZECONST, y: this.linearInterpolate(x - this.SIZECONST, y - this.SIZECONST, x - this.SIZECONST, y + this.SIZECONST, false)}, {x: x+this.SIZECONST, y: this.linearInterpolate(x + this.SIZECONST, y - this.SIZECONST, x + this.SIZECONST, y + this.SIZECONST, false)}, {x: x+this.SIZECONST, y: y-this.SIZECONST}, {x: x-this.SIZECONST, y: y-this.SIZECONST}]; break;
      case 13: coords = [{x: x+this.SIZECONST, y: y-this.SIZECONST}, {x: x+this.SIZECONST, y: this.linearInterpolate(x + this.SIZECONST, y + this.SIZECONST, x + this.SIZECONST, y - this.SIZECONST, false)}, {x: this.linearInterpolate(x + this.SIZECONST, y + this.SIZECONST, x - this.SIZECONST, y + this.SIZECONST, true), y: y+this.SIZECONST}, {x: x-this.SIZECONST, y: y+this.SIZECONST}, {x: x-this.SIZECONST, y: y-this.SIZECONST}]; break;
      case 14: coords = [{x: x-this.SIZECONST, y: y-this.SIZECONST}, {x: x-this.SIZECONST, y: this.linearInterpolate(x - this.SIZECONST, y + this.SIZECONST, x - this.SIZECONST, y - this.SIZECONST, false)}, {x: this.linearInterpolate(x + this.SIZECONST, y + this.SIZECONST, x - this.SIZECONST, y + this.SIZECONST, true), y: y+this.SIZECONST}, {x: x+this.SIZECONST, y: y+this.SIZECONST}, {x: x+this.SIZECONST, y: y-this.SIZECONST}]; break;
      case 15: coords = [{x: x-this.SIZECONST, y: y-this.SIZECONST}, {x: x+this.SIZECONST, y: y-this.SIZECONST}, {x: x+this.SIZECONST, y: y+this.SIZECONST}, {x: x-this.SIZECONST, y: y+this.SIZECONST}]; break;
      default: return;
    }

    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.moveTo(coords[0].x, coords[0].y);
    for (let i = 1; i < coords.length; ++i) {
      ctx.lineTo(coords[i].x, coords[i].y);
    }
    ctx.closePath();
    ctx.fill();
  }

  calculateMarching(x, y) {
    return ((this.getMetaballData(x - this.SIZECONST, y + this.SIZECONST) >= 1) && 0b0001)
      + ((this.getMetaballData(x + this.SIZECONST, y + this.SIZECONST) >= 1) && 0b0010)
      + ((this.getMetaballData(x + this.SIZECONST, y - this.SIZECONST) >= 1) && 0b0100)
      + ((this.getMetaballData(x - this.SIZECONST, y - this.SIZECONST) >= 1) && 0b1000);
  }

  render() {
    if (this.canvasRef.current) {
      this.canvasRef.current.width = this.state.width;
      this.canvasRef.current.height = this.state.height;
    }

    return (
      <canvas
        style={{ position: "fixed", zIndex: -1, width: window.innerWidth + "px", height: window.innerHeight + "px" }}
        ref={this.canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    );
  }

  componentToHex = (c) => {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

  linearInterpolate(aX, aY, bX, bY, xCoord) {
    const fA = this.getMetaballData(aX, aY);
    const fB = this.getMetaballData(bX, bY);

    const lerp = (1 - fA) / (fB - fA);

    return xCoord ? (aX + (bX - aX) * lerp) : (aY + (bY - aY) * lerp);
  }
  
}

export default Background;
