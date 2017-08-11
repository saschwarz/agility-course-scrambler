import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseComponent } from './course/course';
import { LabelComponent } from './label/label';
import { ObstacleComponent } from './obstacle/obstacle';


@NgModule({
	declarations: [
    CourseComponent,
    ObstacleComponent,
    LabelComponent],
	imports: [CommonModule],
	exports: [
    CourseComponent,
    ObstacleComponent,
    LabelComponent]
})
export class ComponentsModule {}
