import { DetachView } from 'src/app/modules/shared/directives/detach-view.directive';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { filter, Observable } from 'rxjs';
import { AuthUserModel } from 'src/app/state/auth/auth.state';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  hostDirectives: [ DetachView ],
  imports: [ SharedModule ],
  host: { 'class': 'text-white flex flex-col items-center bg-transparent-blue-grey backdrop-blur-sm page min-h-[90vh]' }
})
export class AccountComponent {

  authUser$: Observable<AuthUserModel>

  constructor(store: Store<AppState>) {
    this.authUser$ = store.pipe(select(({ auth }) => auth.authUser!), filter((data) => data !== null));
  }
}
