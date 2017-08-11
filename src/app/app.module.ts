import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { Shake } from '@ionic-native/shake';

import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { DoubleBoxPage } from '../pages/double-box/double-box';
import { HomePage } from '../pages/home/home';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { ComponentsModule } from '../components/components.module';
import { CourseProvider } from '../providers/course/course';


@NgModule({
  declarations: [
    AboutPage,
    DoubleBoxPage,
    HomePage,
    MyApp
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AboutPage,
    DoubleBoxPage,
    HomePage,
    MyApp,
  ],
  providers: [
    Shake,
    SplashScreen,
    StatusBar,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CourseProvider
  ]
})
export class AppModule {}
