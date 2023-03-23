import { fadeInDownAnimation, fadeOutUpAnimation } from './../../../../utils/ng-animations';
import { Subject, ReplaySubject } from 'rxjs';
import { ChangeDetectionStrategy, Component, Input, AfterViewInit, HostBinding, HostListener } from '@angular/core';
import { trigger, transition, style, animate, AnimationEvent } from '@angular/animations';
import { DetachView } from '../../directives/detach-view.directive';

const dialogAnimationMetadata = trigger('dialog', [
  transition(':enter', fadeInDownAnimation('300ms', '0ms')),
  transition(':leave', fadeOutUpAnimation('300ms', '0ms')),
]);

@Component({
  selector: 'app-add-to-cart-dialog',
  templateUrl: './add-to-cart-dialog.component.html',
  styleUrls: ['./add-to-cart-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'flex flex-col p-[16px] bg-gray-600 w-[80vw] rounded-[8px] text-[12px] sm:text-[16px] max-w-[400px]' },
  animations: [
    dialogAnimationMetadata
  ],
  hostDirectives: [ DetachView ]
})
export class AddToCartDialogComponent {
  productName$ = new ReplaySubject<string>(1);
  onClose = new Subject<void>();
  onLeavedDone = new Subject<void>();

  @HostBinding('@dialog')
  animationState = null;

  @HostListener('@dialog.done', ['$event'])
  onLeaved(e: AnimationEvent): void {
    if (e.toState === 'void') {
      this.onLeavedDone.next();
    }
  }
}
