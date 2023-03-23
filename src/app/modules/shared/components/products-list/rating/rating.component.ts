import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DetachView } from '../../../directives/detach-view.directive';

@Component({
  selector: 'app-rating[rating]',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [DetachView]
})
export class RatingComponent {
  @Input() rating: number = null!
}
