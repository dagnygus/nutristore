import { ScrollOnClickDirectice } from './directives/scroll-on-click.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LayoutModule } from '@angular/cdk/layout';
import { ReactiveFormsModule } from '@angular/forms'
import { PushModule } from '@rx-angular/template/push';
import { LetModule } from '@rx-angular/template/let';
import { ForModule } from '@rx-angular/template/for';
import { IfModule } from '@rx-angular/template/if';
import { ChangeDetectionViewDirective } from './directives/change-detection-view.directive';
import { HttpClientModule } from '@angular/common/http';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductsListItemComponent } from './components/products-list/products-list-item/products-list-item.component';
import { RatingComponent } from './components/products-list/rating/rating.component';
import { RouterModule } from '@angular/router';
import { RxRepositionScrollStrategyDirective } from './directives/rx-reposition-scroll-strategy.directive';
import { FirstKeyOfDirective } from './directives/first-key-of.directive';
import { AddToCartDialogComponent } from './components/add-to-cart-dialog/add-to-cart-dialog.component';
import { TargetGuardedLink } from './directives/target-guarded-link.directive';
import { TriiggerCheckOnClick } from './directives/trigger-check-on-click.directive';
import { ToogleOverflowDirective } from './directives/toogle-overflow.directive';
import { ProductsListItemPlaceholderComponent } from './components/products-list/products-list-item-placeholder/products-list-item-placeholder.component';
import { RxBindTwoWayInputDirective } from './directives/rx-bind-two-way-input.directive';



@NgModule({
  declarations: [
    ChangeDetectionViewDirective,
    ProductsListComponent,
    ProductsListItemComponent,
    RatingComponent,
    RxRepositionScrollStrategyDirective,
    FirstKeyOfDirective,
    AddToCartDialogComponent,
    TargetGuardedLink,
    TriiggerCheckOnClick,
    ScrollOnClickDirectice,
    ToogleOverflowDirective,
    ProductsListItemPlaceholderComponent,
    RxBindTwoWayInputDirective
  ],
  imports: [
    RouterModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    OverlayModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    LayoutModule,
    ReactiveFormsModule,
    HttpClientModule,
    PushModule,
    LetModule,
    ForModule,
    IfModule,
  ],
  exports: [
    RouterModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    OverlayModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    LayoutModule,
    ReactiveFormsModule,
    HttpClientModule,
    PushModule,
    LetModule,
    ForModule,
    IfModule,
    ChangeDetectionViewDirective,
    ProductsListComponent,
    ProductsListItemComponent,
    RatingComponent,
    RxRepositionScrollStrategyDirective,
    FirstKeyOfDirective,
    AddToCartDialogComponent,
    TargetGuardedLink,
    TriiggerCheckOnClick,
    ScrollOnClickDirectice,
    ToogleOverflowDirective,
    ProductsListItemPlaceholderComponent,
    RxBindTwoWayInputDirective
  ]
})
export class SharedModule { }
