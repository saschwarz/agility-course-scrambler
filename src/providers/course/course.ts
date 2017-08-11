import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/range'


export class Side {
  // One side/approach of an Obstacle and the sequence numbers currently assigned to it.
  labels: Array<string> = [];

  addLabel(label: string) {
    this.labels.unshift(label);
  }

  removeLabel() : string {
    return this.labels.shift();
  }
}


export class Obstacle {
  // for now a single winged jump
  transform: string = '';  // SVG style transform translate/rotate/transform within the Course.
  sides: Array<Side>;

  constructor(transform: string) {
    this.transform = transform;
    this.sides = [new Side(), new Side()];
  }

  numLabels(): number {
    return this.sides.reduce((sum, side) => sum + side.labels.length, 0);
  }

  popLabel(): string {
    // pop from Side with most labels
    let side = this.sides[0].labels.length > this.sides[1].labels.length ? this.sides[0] : this.sides[1];
    return side.removeLabel();
  }

  pushLabel(label: string) {
    // push on Side with fewest labels
    let side = this.sides[0].labels.length < this.sides[1].labels.length ? this.sides[0] : this.sides[1];
    side.addLabel(label);
  }
}


export class Course {
  // The obstacles and the sequence through them
  obstacles: Array<Obstacle> = [];

  constructor(obstacles: Array<Obstacle>) {
    this.obstacles = obstacles;
  }

  scramble(): string {
    // get most used obstacle pop a Label off it.
    let source = this.mostUsedObstacle();
    let dest = source;
    // find a least used obstacle and add the label to it.
    do {
     dest = this.leastUsedObstacle();
    } while(source === dest);
    let label = source.popLabel();
    dest.pushLabel(label);
    return label;
  }

  protected generateSequence(numLabels: number) {
    // generate a random sequence through Obstacles and their Sides
    let lastObstacle = this.obstacles[0];
    Observable.range(1, numLabels)
      .forEach(l => {
        let obstacle = this.leastUsedObstacle();
        if (obstacle === lastObstacle) {
          // try again - want to avoid back to back on same obstacle
          obstacle = this.leastUsedObstacle();
        }
        lastObstacle = obstacle;
        obstacle.sides[Math.round(Math.random())].labels.push(l.toString(10));
    });
  }

  protected mostUsedObstacle(): Obstacle {
    return this.obstacles.sort((a, b) => b.numLabels() - a.numLabels()).slice(0, 4)[Math.floor(Math.random() * 4)];
  }

  protected leastUsedObstacle(): Obstacle {
    // Don't want least used obstacles in the same order.
    // Grab the four least used and randomly choose one.
    return this.obstacles.sort((a, b) => a.numLabels() - b.numLabels()).slice(0, 4)[Math.floor(Math.random() * 4)];
  }
}


export class DoubleBoxCourse extends Course {
  constructor() {
    // start with a randomly created course
    let obstacles = [
      new Obstacle('translate(190 80)'),
      new Obstacle('matrix(0,1,-1,0,290,179)'),
      new Obstacle('matrix(0,1,-1,0,90,179)'),
      new Obstacle('translate(190,278)'),
      new Obstacle('matrix(0,1,-1,0,290,376)'),
      new Obstacle('matrix(0,1,-1,0,90,376)'),
      new Obstacle('translate(190,475)')];
    super(obstacles);
    this.generateSequence(16);
  }
}


@Injectable()
export class CourseProvider {
  private courses: Array<Course> = [];

  add(course: Course) {
    this.courses.push(course);
  }
}
