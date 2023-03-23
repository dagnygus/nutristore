import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ProductsItemModel } from 'src/app/state/products/products.state';
import { DetachView } from '../../../directives/detach-view.directive';

@Component({
  selector: 'app-products-list-item[product]',
  templateUrl: './products-list-item.component.html',
  styleUrls: ['./products-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [DetachView],
  host: { 'class': 'flex flex-col relative justify-between bg-transparent-blue-grey rounded-[12px] overflow-hidden backdrop-blur-sm mat-elevation-z3' }
})
export class ProductsListItemComponent {
  @Input() product: ProductsItemModel = null!
  @Output() addProduct = new EventEmitter<ProductsItemModel>();
}
