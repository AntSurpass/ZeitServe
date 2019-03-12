import {
  trigger, animateChild, group,
  transition, animate, style, query, state
} from '@angular/animations';


// Routable animations
export const headerAnimation = trigger('headerAnimation', [
  transition(':enter', [
    style({  transform: 'translateX(100%)' }),
    animate('0.2s', style({ transform: 'translateX(0px)'})),
  ]),
  transition(':leave', [
    animate('0.2s', style({ transform: 'translateX(100%)' }))
  ])
]);

