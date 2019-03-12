import {
    trigger, animateChild, group,
    transition, animate, style, query, state
  } from '@angular/animations';
  
  
  // Routable animations
  export const slideInAnimation =
    trigger('routeAnimation', [
      transition('*  <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'relative',
            top: 0,
            left: 0,
            width: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ left: '-100%'})
        ], { optional: true }),
        group([
          query(':leave', [
            animate('300ms ease-out', style({ left: '100%'}))
          ], { optional: true }),
          query(':enter', [
            animate('300ms ease-out', style({ left: '0%'}))
          ], { optional: true })
        ]),
      ])
    ]);

