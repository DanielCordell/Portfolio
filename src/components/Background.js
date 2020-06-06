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

  getRandomPosNeg = () => this.getRandomBetween(0, 1) == 0 ? -1 : 1;

  initCircles = () => {
    const count = this.getRandomBetween(4, 8);
    const colours = distinctColors({ count });
    // Generate 4-8 random circles
    for (let i = 0; i < count; ++i) {
      const radius = this.getRandomBetween(2, 15) * this.state.width / 150;
      console.log(radius);
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
    ctx.clearRect(0, 0, this.state.width, this.state.height);

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
        if (this.getMetaballVal(x, y) >= 1) {
          ctx.beginPath();
          ctx.rect(x-2, y-2, 4, 4);
          ctx.fill();
        }
      }
    }
  }

  getMetaballVal = (x, y) => {
    return this.circles.map(circle => {
      return (circle.radius * circle.radius) / (Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2))
    }).reduce((a, b) => a + b, 0);
  }

  render() {
    if (this.canvasRef.current) {
      this.canvasRef.current.width = this.state.width;
      this.canvasRef.current.height = this.state.height;
    }

    return (
      <canvas
        style={{ position: "fixed", zIndex: -1 }}
        ref={this.canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    );
  }
}

export default Background;
