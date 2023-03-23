import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-products-list-item-placeholder',
  templateUrl: './products-list-item-placeholder.component.html',
  styleUrls: ['./products-list-item-placeholder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'flex flex-col relative justify-between bg-transparent-blue-grey rounded-[12px] overflow-hidden backdrop-blur-sm mat-elevation-z3' }
})
export class ProductsListItemPlaceholderComponent {

}
