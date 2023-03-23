import { AddressData } from './../../cart-checkout.component';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';
import { Observable } from 'rxjs';
import { AuthUserModel } from 'src/app/state/auth/auth.state';
import { CartItemModel } from 'src/app/state/cart/cart.state';

@Component({
  selector: 'app-checkout-summary',
  standalone: true,
  imports: [SharedModule],
  hostDirectives: [DetachView],
  templateUrl: './checkout-summary.component.html',
  styleUrls: ['./checkout-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'w-full grid gap-[18px] text-[12px] min-[520px]:text-[16px]' }
})
export class CheckoutSummaryComponent {
  @Input() deliveryAddressData$: Observable<AddressData> = null!;
  @Input() addresseeData$: Observable<AuthUserModel> = null!
  @Input() cartList$: Observable<readonly CartItemModel[]> = null!;
  @Input() totalPrice$: Observable<string> = null!;
}
