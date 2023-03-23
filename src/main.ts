import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { RxFor } from '@rx-angular/template/for';
import { LetDirective } from '@rx-angular/template/let';

import { AppModule } from './app/app.module';

setTimeout(() => {

  Object.defineProperty(RxFor.prototype, 'ngOnDestroy', {
    value() {
      (this as any)._subscription.unsubscribe();
    }
  })

  Object.defineProperty(LetDirective, 'ngOnDestroy', {
    value() {
      (this as any).subscription.unsubscribe();
    }
  })

  platformBrowserDynamic().bootstrapModule(AppModule, { ngZone: 'noop' })
    .catch(err => console.error(err));
});
