import { trigger, transition, animate, style } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { StateStatus } from 'src/app/state/app.state.utils';
import { ProductsItemModel } from 'src/app/state/products/products.state';
import { DetachView } from '../../directives/detach-view.directive';

const productItemAnimationMetadata = trigger('item', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(.6)' }),
    animate('200ms 300ms', style({ opacity: 1, transform: 'scale(1)', easing: 'cubic-bezier(0.33, 1, 0.68, 1)' }))
  ]),
  transition(':leave', animate('200ms', style({ opacity: 0, transform: 'scale(.6)', easing: 'cubic-bezier(0.32, 0, 0.67, 0)' })))
])

@Component({
  selector: 'app-products-list[products\\$][productsStatus\\$]',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { 'class': 'grid gap-[6px] grid-cols-2 min-[560px]:grid-cols-3 min-[800px]:grid-cols-4' },
  hostDirectives: [DetachView],
  animations: [
    productItemAnimationMetadata
  ]
})
export class ProductsListComponent {

  readonly StateStatus = StateStatus;

  @Input() products$: Observable<readonly ProductsItemModel[]> = null!;
  @Input() productsStatus$: Observable<StateStatus> = null!;
  @Output() productSelected = new EventEmitter<string>();
  @Output() addProduct = new EventEmitter<ProductsItemModel>()
}
