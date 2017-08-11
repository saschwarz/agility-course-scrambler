import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Platform } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/range';


export class Side {
  // One side/approach of an Obstacle and the sequence numbers currently assigned to it.
  labels: Array<string> = [];

  constructor(labels?: Array<string>) {
    if (labels) {
      this.labels = labels;
    }
  }

  addLabel(label: string) {
    this.labels.unshift(label);
  }

  removeLabel(): string {
    return this.labels.shift();
  }
}


export class Obstacle {
  // for now a single winged jump
  transform: string = '';  // SVG style transform translate/rotate/transform within the Course.
  sides: Array<Side>;

  constructor({ transform = '', sides = [] }: { transform?: string, sides?: Array<Side> }) {
    this.transform = transform;
    if (sides.length) {
      this.sides = [new Side(sides[0].labels), new Side(sides[1].labels)];
    } else {
      this.sides = [new Side(), new Side()];
    }
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
  name: string = '';
  type: string = 'course';
  created: Date;
  obstacles: Array<Obstacle> = [];

  constructor({ type = 'course', name = '', obstacles, created = null }: { type?: string, name?: string, obstacles?: Array<Obstacle>, created?: Date }) {
    this.type = type;
    this.name = name;
    this.obstacles = obstacles.map(o => new Obstacle({ transform: o.transform, sides: o.sides }));
    this.created = created || new Date();
  }

  scramble() {
    // get most used obstacle pop a Label off it.
    let source = this.mostUsedObstacle();
    let dest = source;
    // find a least used obstacle and add the label to it.
    do {
      dest = this.leastUsedObstacle();
    } while (source === dest);
    let label = source.popLabel();
    dest.pushLabel(label);
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
  static type: string = 'doublebox';

  constructor({ name = '', obstacles = [] }: { name?: string, obstacles?: Array<Obstacle> }) {
    super({
      type: DoubleBoxCourse.type,
      name: name,
      obstacles: obstacles
    });
    if (!obstacles.length) {
      // start with a randomly created course
      this.obstacles = [
        new Obstacle({ transform: 'translate(190 80)' }),
        new Obstacle({ transform: 'matrix(0,1,-1,0,290,179)' }),
        new Obstacle({ transform: 'matrix(0,1,-1,0,90,179)' }),
        new Obstacle({ transform: 'translate(190,278)' }),
        new Obstacle({ transform: 'matrix(0,1,-1,0,290,376)' }),
        new Obstacle({ transform: 'matrix(0,1,-1,0,90,376)' }),
        new Obstacle({ transform: 'translate(190,475)' })];
      this.generateSequence(16);
    }
  }
}


@Injectable()
export class CourseProvider {
  courses: BehaviorSubject<Array<Course>>;
  private _courses: Array<Course> = [];

  constructor(private platform: Platform,
    private storage: Storage) {
    this.platform.ready().then(() => {
      this.storage.get('courses').then(courses => courses && courses.map(c => this._add(this._courseFactory(c))));
    });
    this.courses = new BehaviorSubject(this._courses);
  }

  private _courseFactory(course: any): Course {
    let newCourse;
    switch (course.type) {
      case DoubleBoxCourse.type:
        newCourse = new DoubleBoxCourse(course)
        break;

      default:
        newCourse = new Course(course);
    }
    return newCourse;
  }

  _add(course: Course) {
    this._courses.push(course);
    this._courses.sort((a, b) => b.created.getTime() - a.created.getTime());
    this.courses.next(this._courses);
  }

  add(course: Course) {
    this._add(course);
    this.storage.set('courses', this._courses)
  }

  remove(course: Course) {
    this._courses = this._courses.filter(c => c !== course);
    this.storage.set('courses', this._courses)
    this.courses.next(this._courses);
  }

}
