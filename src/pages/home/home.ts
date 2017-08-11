import { Component, ViewChild } from '@angular/core';

import { Course, DoubleBoxCourse } from '../../providers/course/course';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  course: Course;
  @ViewChild('content') content: any;
  courseHeight: number = 300;

  constructor() {
    this.course = new DoubleBoxCourse();
  }

  ionViewDidEnter() {
    this.courseHeight = this.content.contentHeight || 300;
  }
}
