import { Component, NgZone, ViewChild } from '@angular/core';
import { AlertController, NavController, NavParams, Platform, ToastController } from 'ionic-angular';

import { Shake } from '@ionic-native/shake';

import { Observable } from 'rxjs/Observable';

import "rxjs/add/operator/mergeMap";
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/timer';

import { Course, CourseProvider, DoubleBoxCourse } from '../../providers/course/course';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  course: Course;
  device: boolean = false;
  @ViewChild('content') content: any;
  courseHeight: number = 300;
  scrambling: boolean = false;
  private _watch;

  constructor(
    private alertCtrl: AlertController,
    private courseProvider: CourseProvider,
    private navCtrl: NavController,
    private navParams: NavParams,
    private platform: Platform,
    private shake: Shake,
    private toastCtrl: ToastController,
    private zone: NgZone,
  ) {
    this.course = this.navParams.get('course');
    if (!this.course) {
      this.course = new DoubleBoxCourse({});
    }

    this.platform.ready().then(() => {
      // runtime check for desktop
      if (!this.platform.is('core') && !this.platform.is('mobileweb')) {
        this.device = true;
        this._watch = this.shake.startWatch().subscribe((event) => {
          // iOS needs this run in NgZone
          this.zone.run(() => this.scramble());
        });
      }
    });
  }

  ionViewDidEnter() {
    this.courseHeight = this.content.contentHeight || 300;
  }

  ionViewDidExit() {
    this._watch && this._watch.unsubscribe();
  }

  scramble() {
    this.scrambling = true;
    let timers = Observable
      .from([0, 400, 800, 1200, 1600])
      .flatMap(x => Observable.timer(x));
    timers.subscribe(v => this.course.scramble(),
      () => {},
      () => this.scrambling = false
    );
  }

  save() {
    let confirm = this.alertCtrl.create({
      title: 'Save',
      message: 'Enter a name for this Course',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'OK',
          handler: (data) => {
            this.courseProvider.add(new Course({type: this.course.type, name: data.name, obstacles: this.course.obstacles}));
            let toast = this.toastCtrl.create({
              message: `Course "${data.name}" saved!`,
              position: 'top',
              duration: 2000
            });
            toast.present();
          }
        }
      ]
    });
    confirm.present();
  }
}
