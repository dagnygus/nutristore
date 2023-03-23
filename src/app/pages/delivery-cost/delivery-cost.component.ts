import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';

@Component({
  selector: 'app-delivery-cost',
  standalone: true,
  imports: [SharedModule],
  hostDirectives: [DetachView],
  templateUrl: './delivery-cost.component.html',
  styleUrls: ['./delivery-cost.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'page min-h-[90vh] bg-blue-grey-400 text-white rounded-[16px] mat-elevation-z3 p-[24px]' }
})
export class DeliveryCostComponent {
  
}
