import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { DoubleBoxPage } from '../pages/double-box/double-box';

import { Course, CourseProvider } from '../providers/course/course';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  courses: Array<Course> = [];
  pages: Array<{title: string, component: any, count?: boolean}>;

  constructor(
    private courseProvider: CourseProvider,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Scramble!', component: HomePage },
      { title: 'Double Box', component: DoubleBoxPage, count: true },
      { title: 'About', component: AboutPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.courseProvider.courses.subscribe(courses => this.courses = courses);
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
