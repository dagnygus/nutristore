import { CartListItemComponent } from './cart-list-item/cart-list-item.component';
import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { CartItemModel } from 'src/app/state/cart/cart.state';
import { Observable, filter } from 'rxjs';
import { CdConnector } from 'src/app/modules/shared/directives/cd-connector.directive';
import { trigger, transition, animate, style } from '@angular/animations';
import { commonLeaveAnimation } from 'src/app/utils/common-ng-aniamtions';

const cartItemAnimationMetadata = trigger('cartItem', [
  transition(':leave', commonLeaveAnimation)
]);

@Component({
  selector: 'app-cart-list',
  standalone: true,
  imports: [SharedModule, CartListItemComponent],
  hostDirectives: [ DetachView, CdConnector ],
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'grid gap-[16px] px-[16px]' },
  animations: [
    cartItemAnimationMetadata
  ]
})
export class CartListComponent implements OnInit {

  @Input() cartList$: Observable<readonly CartItemModel[]> = null!;
  @Output() increase = new EventEmitter<number>();
  @Output() decrease = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();

  constructor(private _cdConnector: CdConnector) {}

  ngOnInit(): void {
    this._cdConnector.connect(this.cartList$.pipe(filter((list) => list.length === 0)));
  }

}
