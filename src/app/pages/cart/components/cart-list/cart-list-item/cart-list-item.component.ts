import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { CartItemModel } from 'src/app/state/cart/cart.state';

@Component({
  selector: 'app-cart-list-item',
  standalone: true,
  imports: [SharedModule],
  hostDirectives: [ DetachView ],
  templateUrl: './cart-list-item.component.html',
  styleUrls: ['./cart-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': `grid grid-cols-[2fr_1fr] grid-rows-[auto_auto_auto] bg-transparent-blue-grey
              backdrop-blur-sm mat-elevation-z3 text-[12px] rounded-[4px] overflow-hidden text-white
              min-[440px]:grid-cols-[1fr_1fr_100px] min-[440px]:grid-rows-[auto_auto_auto]
              min-[560px]:grid-cols-[1fr_1fr_100px_100px] min-[640px]:grid-cols-[204px_1fr_100px_100px]`
  }
})
export class CartListItemComponent {
  private _cartItem: CartItemModel = null!
  cartItem$ = new ReplaySubject<CartItemModel>(1);

  @Input()
  public set cartItem(value: CartItemModel) {
    this._cartItem = value
    this.cartItem$.next(value);
  }
  public get cartItem(): CartItemModel {
    return this._cartItem
  }
  @Output() increase = new EventEmitter<void>();
  @Output() decrease = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
}
