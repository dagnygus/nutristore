import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';

@Component({
  selector: 'app-regulations',
  standalone: true,
  imports: [SharedModule],
  hostDirectives: [DetachView],
  templateUrl: './regulations.component.html',
  styleUrls: ['./regulations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'page min-h-[90vh] bg-blue-grey-400 text-white rounded-[16px] mat-elevation-z3 p-[24px]' }
})
export class RegulationsComponent {

}
