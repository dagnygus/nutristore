import { CartCheckoutComponent } from './pages/cart-checkout/cart-checkout.component';
import { AccountComponent } from './pages/account/account.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AccountCanActivated, AccountCanMatch, FormsCanActivated, FormsCanMatch } from './modules/core/guards/app.guard';
import { FormsComponent } from './pages/forms/forms.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProductsPageComponent } from './pages/products/products-page.component';
import { SingleProductComponent } from './pages/single-product/single-product.component';
import { CartComponent } from './pages/cart/cart.component';
import { WholesaleComponent } from './pages/wholesale/wholesale.component';
import { PaymentMethodsComponent } from './pages/payment-methods/payment-methods.component';
import { DeliveryCostComponent } from './pages/delivery-cost/delivery-cost.component';
import { RegulationsComponent } from './pages/regulations/regulations.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomePageComponent },
  { path: 'products', loadComponent: () =>  ProductsPageComponent},
  { path: 'forms/:auth', loadComponent: () => FormsComponent, canMatch: [ FormsCanMatch ], canActivate: [ FormsCanActivated ] },
  { path: 'account', loadComponent: () => AccountComponent, canMatch: [ AccountCanMatch ], canActivate: [ AccountCanActivated ] },
  { path: 'product/:productId', loadComponent: () => SingleProductComponent },
  { path: 'cart', loadComponent: () => CartComponent },
  { path: 'checkout', loadComponent: () => CartCheckoutComponent, canMatch: [ AccountCanMatch ], canActivate: [ AccountCanActivated ] },
  { path: 'wholesale', loadComponent: () => WholesaleComponent },
  { path: 'peymant-methods', loadComponent: () => PaymentMethodsComponent },
  { path: 'delivery-cost', loadComponent: () => DeliveryCostComponent },
  { path: 'regulations', loadComponent: () =>  RegulationsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabledBlocking' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
