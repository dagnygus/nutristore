import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';

@Component({
  selector: 'app-payment-methods',
  standalone: true,
  imports: [SharedModule],
  hostDirectives: [DetachView],
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'page min-h-[90vh] bg-blue-grey-400 text-white rounded-[16px] mat-elevation-z3 p-[24px]' }
})
export class PaymentMethodsComponent {

}
