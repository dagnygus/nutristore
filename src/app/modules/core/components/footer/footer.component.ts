import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';

@Component({
  selector: 'footer[nutristore]',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    DetachView
  ],
  host: { 'class': 'grid grid-cols-1 min-[500px]:grid-cols-2 min-[860px]:grid-cols-4 auto-rows-fr text-white bg-primary text-center mt-[32px]', 'style': 'border-top: 12px solid #bbb'}
})
export class FooterComponent {
  constructor() {}
}
