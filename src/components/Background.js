import React from 'react';

import distinctColors from 'distinct-colors'

class Background extends React.Component {
  canvasRef = React.createRef(null);

  circles = [];

  interval = null;

  INTERVAL_MILLIS = 15;

  MULTIPLIER = 2

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
    ctx.clearRect(0, 0, this.state.width * this.MULTIPLIER, this.state.height * this.MULTIPLIER);

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
      ctx.arc(circle.x * this.MULTIPLIER, circle.y * this.MULTIPLIER, circle.radius * this.MULTIPLIER, 0, 2 * Math.PI);
      ctx.fill();
      */
    });

    // Draw points
    for (let x = 0; x <= this.state.width; x += 8) {
      for (let y = 0; y <= this.state.height; y += 8) {
        let marchingBinary = this.calculateMarching(x, y);
        
        this.drawCell(ctx, x, y, marchingBinary);
      }
    }
  }

  getMetaballVal = (x, y) => {
    return this.getDataForAllCirclesAtPosition(x, y).reduce((a, b) => a + b.val, 0);
  }

  getMetaballColor = (x, y) => {
      // Get all circles overlapping
    var circleData = this.getDataForAllCirclesAtPosition(x, y);

    // If no circles overlap get the closest (literally an edge-case).
    if (circleData.length == 0) {
      var closestDistance = Infinity;
      var closestColor = [255,255,255];
      circleData.forEach(it => {
        if (closestDistance > it.distanceToMid) {
          closestDistance = it.distanceToMid;
          closestColor = it.color._rgb.slice(0, 3);
        }
      });
      return closestColor;
    }
    // If only one circle just return that colour, no averaging
    else if (circleData.length == 1) {
      return circleData[0].color._rgb.slice(0, 3);
    }

    // This is factoring in other circles and dulling out other colours
    // Filtering doesn't work, will try switching this with a (2d array of colour arrays that all get flattened/avgd when drawn.)
    const totalWeight = circleData.map(it => 1/it.distanceToMid).reduce((a, b) => a + b, 0);
  
    const abcd = circleData.reduce((a, b) =>  [
      (a[0] + Math.pow(b.color._rgb[0] * (1/b.distanceToMid), 2)), 
      (a[1] + Math.pow(b.color._rgb[1] * (1/b.distanceToMid), 2)),
      (a[2] + Math.pow(b.color._rgb[2] * (1/b.distanceToMid), 2)),
    ], [0, 0, 0]);
      return abcd.map(it => Math.round(Math.sqrt(it) / totalWeight));

      /*

    var color = 0;
    var maxVal = 0;
    this.getDataForAllCirclesAtPosition(x, y).forEach(it => {
      if (it.val > maxVal) {
        color = it.color._rgb;
        maxVal = it.val;
      }
    });
    return color;
    */
  }

  getDataForAllCirclesAtPosition = (x, y) => {
    return this.circles.map(circle => {
      return { 
        val: (circle.radius * circle.radius) / (Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2)), 
        color: circle.color, 
        distanceToMid: Math.sqrt(Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2)),
      };
    });
  }

  drawCell = (ctx, x, y, marchingBinary) => {
    let coords = []
    switch (marchingBinary) {
      case 1: coords = [{x: x-3, y}, {x, y: y+3}, {x: x-3, y: y+3}]; break;
      case 2: coords = [{x: x+3, y}, {x, y: y+3}, {x: x+3, y: y+3}]; break;
      case 3: coords = [{x: x-3, y}, {x: x+3, y}, {x: x+3, y: y+3}, {x: x-3, y: y+3}]; break;
      case 4: coords = [{x: x+3, y}, {x, y: y-3}, {x: x+3, y: y-3}]; break;
      case 5: coords = [{x: x-3, y: y+3}, {x: x-3, y}, {x, y: y-3}, {x: x+3, y: y-3}, {x: x+3, y}, {x, y: y+3}]; break;
      case 6: coords = [{x: x+3, y: y+3}, {x, y: y+3}, {x, y: y-3}, {x: x+3, y: y-3}]; break;
      case 7: coords = [{x: x-3, y: y+3}, {x, y: y+3}, {x, y: y-3}, {x: x+3, y: y-3}, {x: x+3, y: y+3}]; break;
      case 8: coords = [{x: x-3, y: y-3}, {x, y: y-3}, {x: x-3, y}]; break;
      case 9: coords = [{x: x-3, y: y+3}, {x, y: y+3}, {x, y: y-3}, {x: x-3, y: y-3}]; break;
      case 10: coords = [{x: x+3, y: y+3}, {x: x+3, y}, {x, y: y-3}, {x: x-3, y: y-3}, {x: x-3, y}, {x, y: y+3}]; break;
      case 11: coords = [{x: x+3, y: y+3}, {x, y: y+3}, {x, y: y-3}, {x: x-3, y: y-3}, {x: x-3, y: y+3}]; break;
      case 12: coords = [{x: x-3, y}, {x: x+3, y}, {x: x+3, y: y-3}, {x: x-3, y: y-3}]; break;
      case 13: coords = [{x: x+3, y: y-3}, {x, y: y-3}, {x, y: y+3}, {x: x-3, y: y+3}, {x: x-3, y: y-3}]; break;
      case 14: coords = [{x: x-3, y: y-3}, {x, y: y-3}, {x, y: y+3}, {x: x+3, y: y+3}, {x: x+3, y: y-3}]; break;
      case 15: coords = [{x: x-3, y: y-3}, {x: x+3, y: y-3}, {x: x+3, y: y+3}, {x: x-3, y: y+3}]; break;
      default: break;
    }
    if (coords.length == 0) return;

        // So none of this i right, colours needs to weigh up all the colours together. Weighted average!
    const colors = this.getMetaballColor(x, y);
    ctx.beginPath();
    ctx.fillStyle = "#" + colors.map(x => {
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
    return ((this.getMetaballVal(x - 0.5, y + 0.5) >= 1) && 0b0001)
      + ((this.getMetaballVal(x + 0.5, y + 0.5) >= 1) && 0b0010)
      + ((this.getMetaballVal(x + 0.5, y - 0.5) >= 1) && 0b0100)
      + ((this.getMetaballVal(x - 0.5, y - 0.5) >= 1) && 0b1000);
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
