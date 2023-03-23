import { animate, style, transition } from '@angular/animations';
export const commonLeaveAnimation = animate('200ms', style({ opacity: 0, transform: 'scale(.6)', easing: 'cubic-bezier(0.32, 0, 0.67, 0)' }));
export const commonEnterAnimation = [
  style({ opacity: 0, transform: 'scale(.6)' }),
  animate('200ms', style({ opacity: 1, transform: 'scale(1)', easing: 'cubic-bezier(0.33, 1, 0.68, 1)' }))
]

export const commonApearanceAnimation = [
  transition(':enter', commonEnterAnimation),
  transition(':leave', commonLeaveAnimation)
]
