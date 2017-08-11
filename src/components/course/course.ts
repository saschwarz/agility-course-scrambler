import { Component, Input } from '@angular/core';


@Component({
  selector: 'course',
  templateUrl: 'course.html'
})
export class CourseComponent {
  @Input() height: string;
  @Input() sequence: string;
  @Input() course;
}
