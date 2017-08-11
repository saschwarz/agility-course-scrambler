import { Component, Input } from '@angular/core';


@Component({
  selector: '[obstacle]',
  templateUrl: 'obstacle.html'
})
export class ObstacleComponent {
  @Input() obstacle;

  sideTranslate(i) {
    // up to 6 labels per side
    let t = ['0', '-40', '40'][i % 3];
    return `translate(${t})`;
  }

  labelTransform() {
    // hack to detect if obstacle is rotated 90 so can counter rotate label's text
    if (this.obstacle.transform.startsWith('matrix')) {
      return 'rotate(-90)';
    }
    return '';
  }
}
