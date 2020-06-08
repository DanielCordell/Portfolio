import React from 'react';

import distinctColors from 'distinct-colors'

class Background extends React.Component {
  canvasRef = React.createRef(null);

  circles = [];

  interval = null;

  INTERVAL_MILLIS = 15;

  constructor(props) {
    super(props);
    window.addEventListener('resize', this.windowResize);
    this.state = { width: window.innerWidth, height: window.innerHeight };

    this.initCircles();
    this.interval = setInterval(this.draw, this.INTERVAL_MILLIS);
  }

  windowResize = () => {
    if (this.canvasRef.current) {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }
  };

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  getRandomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

  getRandomPosNeg = () => this.getRandomBetween(0, 1) === 0 ? -1 : 1;

  initCircles = () => {
    const count = this.getRandomBetween(4, 8);
    const colours = distinctColors({ count });
    // Generate 4-8 random circles
    for (let i = 0; i < count; ++i) {
      const radius = this.getRandomBetween(2, 15) * this.state.width / 150;
      this.circles.push({
        radius: radius,
        x: this.getRandomBetween(radius, this.state.width - radius),
        y: this.getRandomBetween(radius + 56, this.state.height - radius), // height of navbar
        color: colours[i],
        velX: this.getRandomBetween(10, 100) * this.getRandomPosNeg(),
        velY: this.getRandomBetween(10, 100) * this.getRandomPosNeg(),
      });
    }
  }

  draw = () => {
    if (!this.canvasRef.current) return;
    const ctx = this.canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, this.state.width * 4, this.state.height * 4);

    // Draw circles
    this.circles.forEach(circle => {
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
      else if (circle.y < circle.radius + 56) {
        circle.y = circle.radius + 56;
        circle.velY *= -1;
      }
      /*
      // Draw Circle
      ctx.beginPath();
      ctx.fillStyle = circle.color;
      ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
      ctx.fill();
      */
    });

    // Draw points
    for (let x = 0; x <= this.state.width; x += 8) {
      for (let y = 0; y <= this.state.height; y += 8) {
        let marchingBinary = ((this.getMetaballVal(x - 0.5, y + 0.5) >= 1) && 0b0001)
          + ((this.getMetaballVal(x + 0.5, y + 0.5) >= 1) && 0b0010)
          + ((this.getMetaballVal(x + 0.5, y - 0.5) >= 1) && 0b0100)
          + ((this.getMetaballVal(x - 0.5, y - 0.5) >= 1) && 0b1000);
        
        this.drawCell(ctx, x, y, marchingBinary);
      }
    }
  }

  getMetaballVal = (x, y) => {
    return this.circles.map(circle => {
      return (circle.radius * circle.radius) / (Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2))
    }).reduce((a, b) => a + b, 0);
  }

  drawCell = (ctx, x, y, marchingBinary) => {
    let coords = []
    switch (marchingBinary) {
      case 1: coords = [{x: x-2, y}, {x, y: y+2}, {x: x-2, y: y+2}]; break;
      case 2: coords = [{x: x+2, y}, {x, y: y+2}, {x: x+2, y: y+2}]; break;
      case 3: coords = [{x: x-2, y}, {x: x+2, y}, {x: x+2, y: y+2}, {x: x-2, y: y+2}]; break;
      case 4: coords = [{x: x+2, y}, {x, y: y-2}, {x: x+2, y: y-2}]; break;
      case 5: coords = [{x: x-2, y: y+2}, {x: x-2, y}, {x, y: y-2}, {x: x+2, y: y-2}, {x: x+2, y}, {x, y: y+2}]; break;
      case 6: coords = [{x: x+2, y: y+2}, {x, y: y+2}, {x, y: y-2}, {x: x+2, y: y-2}]; break;
      case 7: coords = [{x: x-2, y: y+2}, {x, y: y+2}, {x, y: y-2}, {x: x+2, y: y-2}, {x: x+2, y: y+2}]; break;
      case 8: coords = [{x: x-2, y: y-2}, {x, y: y-2}, {x: x-2, y}]; break;
      case 9: coords = [{x: x-2, y: y+2}, {x, y: y+2}, {x, y: y-2}, {x: x-2, y: y-2}]; break;
      case 10: coords = [{x: x+2, y: y+2}, {x: x+2, y}, {x, y: y-2}, {x: x-2, y: y-2}, {x: x-2, y}, {x, y: y+2}]; break;
      case 11: coords = [{x: x+2, y: y+2}, {x, y: y+2}, {x, y: y-2}, {x: x-2, y: y-2}, {x: x-2, y: y+2}]; break;
      case 12: coords = [{x: x-2, y}, {x: x+2, y}, {x: x+2, y: y-2}, {x: x-2, y: y-2}]; break;
      case 13: coords = [{x: x+2, y: y-2}, {x, y: y-2}, {x, y: y+2}, {x: x-2, y: y+2}, {x: x-2, y: y-2}]; break;
      case 14: coords = [{x: x-2, y: y-2}, {x, y: y-2}, {x, y: y+2}, {x: x+2, y: y+2}, {x: x+2, y: y-2}]; break;
      case 15: coords = [{x: x-2, y: y-2}, {x: x+2, y: y-2}, {x: x+2, y: y+2}, {x: x-2, y: y+2}]; break;
      default: break;
    }
    if (coords.length == 0) return;

    ctx.beginPath();
    ctx.moveTo(coords[0].x * 4, coords[0].y * 4);
    for (let i = 1; i < coords.length; ++i) {
      ctx.lineTo(coords[i].x * 4, coords[i].y * 4);
    }
    ctx.closePath();
    ctx.fill();
  }

  render() {
    if (this.canvasRef.current) {
      this.canvasRef.current.width = this.state.width * 4;
      this.canvasRef.current.height = this.state.height * 4;
    }

    return (
      <canvas
        style={{ position: "fixed", zIndex: -1, width: window.innerWidth + "px", height: window.innerHeight + "px" }}
        ref={this.canvasRef}
        width={window.innerWidth * 4}
        height={window.innerHeight * 4}
      />
    );
  }
}

export default Background;
