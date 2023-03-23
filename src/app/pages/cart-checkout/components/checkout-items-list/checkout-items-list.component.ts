import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';
import { Observable } from 'rxjs';
import { CartItemModel } from 'src/app/state/cart/cart.state';

@Component({
  selector: 'app-checkout-items-list',
  standalone: true,
  imports: [SharedModule],
  hostDirectives: [ DetachView ],
  templateUrl: './checkout-items-list.component.html',
  styleUrls: ['./checkout-items-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { 'class': 'grid gap-[16px] my-[16px] justify-items-center sm:grid-cols-2' }
})
export class CheckoutItemsListComponent {
  @Input() list$: Observable<readonly CartItemModel[]> = null!
}
