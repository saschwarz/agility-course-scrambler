import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, ItemSliding } from 'ionic-angular';

import { Course, CourseProvider } from '../../providers/course/course';

import { HomePage } from '../home/home';


@Component({
  selector: 'page-double-box',
  templateUrl: 'double-box.html',
})
export class DoubleBoxPage {
  courses: Array<Course> = [];

  constructor(
    private alertCtrl: AlertController,
    private courseProvider: CourseProvider,
    private navCtrl: NavController) {
      courseProvider.courses.subscribe(courses => this.courses = courses);
  }

  scramble(course: Course, slidingItem: ItemSliding) {
    let newCourse = new Course({type: course.type, name: course.name, obstacles: course.obstacles});
    slidingItem.close()
    this.navCtrl.push(HomePage, {course: newCourse});
  }

  delete(course: Course){
    let confirm = this.alertCtrl.create({
      title: `Delete "${course.name}"?`,
      message: 'There is no UNDO!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.courseProvider.remove(course);
          }
        },
        {
          text: 'Cancel'
        }
      ]
    });
    confirm.present();
  }
}
