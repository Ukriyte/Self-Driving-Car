import { Controls, ControlType } from "./Controls";
import { NeuralNetwork } from "./NeuralNetwork";
import { Sensor } from "./Sensor";
import { Point, polysIntersect } from "./utils";

export class Car {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  acceleration: number;
  maxSpeed: number;
  friction: number;
  angle: number;
  damaged: boolean;
  useBrain: boolean;
  sensor: Sensor | null;
  brain: NeuralNetwork | null;
  controls: Controls;
  polygon: Point[];

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    controlType: ControlType,
    maxSpeed: number = 3
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;
    this.angle = 0;

    this.damaged = false;

    this.useBrain = controlType === "AI";

    if (controlType !== "DUMMY") {
      this.sensor = new Sensor();
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
    } else {
      this.sensor = null;
      this.brain = null;
    }
    this.controls = new Controls(controlType);
    this.polygon = [];
  }

  update(roadBorders: Point[][], traffic: Car[]): void {
    if (!this.damaged) {
      this.move();
      this.polygon = this.createPolygon();
      this.damaged = this.assessDamage(roadBorders, traffic);
    }
    if (this.sensor && this.brain) {
      this.sensor.update(this.x, this.y, this.angle, roadBorders, traffic);
      const offsets = this.sensor.readings.map((s) =>
        s === null ? 0 : 1 - s.offset!
      );
      const outputs = NeuralNetwork.feedForward(offsets, this.brain);
      if (this.useBrain) {
        this.controls.forward = outputs[0] === 1;
        this.controls.left = outputs[1] === 1;
        this.controls.right = outputs[2] === 1;
        // Disable reverse for better AI learning - prevents cars from going backwards
        // this.controls.reverse = outputs[3] === 1;
      }
    }
  }

  private assessDamage(roadBorders: Point[][], traffic: Car[]): boolean {
    for (let i = 0; i < roadBorders.length; i++) {
      if (
        polysIntersect(
          [...this.polygon, this.polygon[0]],
          roadBorders[i]
        )
      ) {
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      const poly = traffic[i].polygon;
      if (
        polysIntersect(
          [...this.polygon, this.polygon[0]],
          [...poly, poly[0]]
        )
      ) {
        return true;
      }
    }
    return false;
  }

  private createPolygon(): Point[] {
    const points: Point[] = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });
    return points;
  }

  private move(): void {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed !== 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx: CanvasRenderingContext2D, drawSensor: boolean = false, color: string = "#00ffff"): void {
    if (this.damaged) {
      ctx.fillStyle = "#ff3366";
    } else {
      ctx.fillStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();
    if (this.sensor && drawSensor) {
      this.sensor.draw(ctx);
    }
  }

  destroy(): void {
    this.controls.destroy();
  }
}
