import React from 'react';

import distinctColors from 'distinct-colors'

class Background extends React.Component {
  canvasRef = React.createRef(null);

  circles = [];

  interval = null;

  INTERVAL_MILLIS = 15;

  MULTIPLIER = 2;

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
    const count = this.getRandomBetween(5, 7);
    // Generate 4-8 random circles
    for (let i = 0; i < count; ++i) {
      const radius = (count % 2 == 0 ? this.getRandomBetween(5, 10) : this.getRandomBetween(12,16)) * this.state.width / 150;
      this.circles.push({
        radius: radius,
        x: this.getRandomBetween(radius, this.state.width - radius),
        y: this.getRandomBetween(radius + 56, this.state.height - radius), // height of navbar
        color: this.colourScheme.colours[i % this.colourScheme.colours.length],
        velX: this.getRandomBetween(50, 100) * this.getRandomPosNeg(),
        velY: this.getRandomBetween(50, 100) * this.getRandomPosNeg(),
      });
    }
  }

  draw = () => {
    if (!this.canvasRef.current) return;
    const ctx = this.canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, this.state.width * this.MULTIPLIER, this.state.height * this.MULTIPLIER);
    ctx.fillStyle = "#343a40";
    ctx.fillRect(0, 0, this.state.width * this.MULTIPLIER, this.state.height * this.MULTIPLIER);
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
    for (let x = 0; x <= this.state.width; x += 10) {
      for (let y = 0; y <= this.state.height; y += 10) {
        const metaballData = this.getMetaballData(x, y);
        const marchingBinary = this.calculateMarching(x, y);
        
        this.drawCell(ctx, x, y, metaballData, marchingBinary);
      }
    }
  }

  getMetaballColour = (metaballData) => {
    /* DOESNT WORK, COME BACK TO THIS LATER
    // If no circles, set default color.
    if (metaballData.data.length == 0) {
      return [255,255,255];
    }
    // If only one circle just return that colour, no averaging
    else if (metaballData.data.length == 1) {
      return metaballData.data[0].color;
    }

    // This is factoring in other circles and dulling out other colours
    // Filtering doesn't work, will try switching this with a (2d array of colour arrays that all get flattened/avgd when drawn.)
    const totalWeight = metaballData.totalVal;
  
    // make this weighted based on distance to inside of circle?
    const abcd = metaballData.data.reduce((a, b) =>  [
      (a[0] + Math.pow(b.color[0], 2) * (b.val / totalWeight)), 
      (a[1] + Math.pow(b.color[1], 2) * (b.val / totalWeight)),
      (a[2] + Math.pow(b.color[2], 2) * (b.val / totalWeight)),
    ], [0, 0, 0]);
      return abcd.map(it => Math.round(Math.sqrt(it)));
      */

    return [255,255,255];
  }

  getMetaballData = (x, y) => {
    const data = this.circles.map(circle => {
      return { 
        val: (circle.radius * circle.radius) / (Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2)), 
        //color: circle.color, 
        //distanceFromPointdistanceFromPoint: Math.max(0, Math.sqrt(Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2)) - circle.radius),
      };
    });

    return {data, totalVal: data.reduce((a, b) => a + b.val, 0)};
  }

  drawCell = (ctx, x, y, metaballData, marchingBinary) => {
    let coords = []
    switch (marchingBinary) {
      case 1: coords = [{x: x-5, y}, {x, y: y+5}, {x: x-5, y: y+5}]; break;
      case 2: coords = [{x: x+5, y}, {x, y: y+5}, {x: x+5, y: y+5}]; break;
      case 3: coords = [{x: x-5, y}, {x: x+5, y}, {x: x+5, y: y+5}, {x: x-5, y: y+5}]; break;
      case 4: coords = [{x: x+5, y}, {x, y: y-5}, {x: x+5, y: y-5}]; break;
      case 5: coords = [{x: x-5, y: y+5}, {x: x-5, y}, {x, y: y-5}, {x: x+5, y: y-5}, {x: x+5, y}, {x, y: y+5}]; break;
      case 6: coords = [{x: x+5, y: y+5}, {x, y: y+5}, {x, y: y-5}, {x: x+5, y: y-5}]; break;
      case 7: coords = [{x: x-5, y: y+5}, {x, y: y+5}, {x, y: y-5}, {x: x+5, y: y-5}, {x: x+5, y: y+5}]; break;
      case 8: coords = [{x: x-5, y: y-5}, {x, y: y-5}, {x: x-5, y}]; break;
      case 9: coords = [{x: x-5, y: y+5}, {x, y: y+5}, {x, y: y-5}, {x: x-5, y: y-5}]; break;
      case 10: coords = [{x: x+5, y: y+5}, {x: x+5, y}, {x, y: y-5}, {x: x-5, y: y-5}, {x: x-5, y}, {x, y: y+5}]; break;
      case 11: coords = [{x: x+5, y: y+5}, {x, y: y+5}, {x, y: y-5}, {x: x-5, y: y-5}, {x: x-5, y: y+5}]; break;
      case 12: coords = [{x: x-5, y}, {x: x+5, y}, {x: x+5, y: y-5}, {x: x-5, y: y-5}]; break;
      case 13: coords = [{x: x+5, y: y-5}, {x, y: y-5}, {x, y: y+5}, {x: x-5, y: y+5}, {x: x-5, y: y-5}]; break;
      case 14: coords = [{x: x-5, y: y-5}, {x, y: y-5}, {x, y: y+5}, {x: x+5, y: y+5}, {x: x+5, y: y-5}]; break;
      case 15: coords = [{x: x-5, y: y-5}, {x: x+5, y: y-5}, {x: x+5, y: y+5}, {x: x-5, y: y+5}]; break;
      default: break;
    }
    if (coords.length == 0) return;

    const colour = this.getMetaballColour(metaballData);
    ctx.beginPath();
    ctx.fillStyle = "#" + colour.map(x => {
      const hex = Math.floor(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex
    }).join('');
    ctx.moveTo(coords[0].x * this.MULTIPLIER, coords[0].y * this.MULTIPLIER);
    for (let i = 1; i < coords.length; ++i) {
      ctx.lineTo(coords[i].x * this.MULTIPLIER, coords[i].y * this.MULTIPLIER);
    }
    ctx.closePath();
    ctx.fill();
  }

  calculateMarching(x, y) {
    return ((this.getMetaballData(x - 0.5, y + 0.5).totalVal >= 1) && 0b0001)
      + ((this.getMetaballData(x + 0.5, y + 0.5).totalVal >= 1) && 0b0010)
      + ((this.getMetaballData(x + 0.5, y - 0.5).totalVal >= 1) && 0b0100)
      + ((this.getMetaballData(x - 0.5, y - 0.5).totalVal >= 1) && 0b1000);
  }

  render() {
    if (this.canvasRef.current) {
      this.canvasRef.current.width = this.state.width * this.MULTIPLIER;
      this.canvasRef.current.height = this.state.height * this.MULTIPLIER;
    }

    return (
      <canvas
        style={{ position: "fixed", zIndex: -1, width: window.innerWidth + "px", height: window.innerHeight + "px" }}
        ref={this.canvasRef}
        width={window.innerWidth * this.MULTIPLIER}
        height={window.innerHeight * this.MULTIPLIER}
      />
    );
  }

  componentToHex = (c) => {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
}

export default Background;
