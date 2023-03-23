import { NgModule } from '@angular/core';
import { RX_RENDER_STRATEGIES_CONFIG } from '@rx-angular/cdk/render-strategies';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    AutocompleteComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    SharedModule,
  ],
  providers: [{
    provide: RX_RENDER_STRATEGIES_CONFIG,
    useValue: {
      parent: false // this applies to all letDirectives
    }
  }]
})
export class CoreModule { }
