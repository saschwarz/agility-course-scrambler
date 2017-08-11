import { Component, Input } from '@angular/core';


@Component({
  selector: '[label]',
  templateUrl: 'label.html'
})
export class LabelComponent {
  @Input() label;
  @Input() transform;
}
