import { state, style, animate, transition, trigger } from '@angular/animations';

export const drowAnimation = trigger('openClose', [
    state('dr1', style({
        height: '3.5rem',
        opacity: 1,
    })),
    state('dr2', style({
        height: '3.5rem',
        opacity: 1,
    })),
    state('dr3', style({
        height: '3.5rem',
        opacity: 1,
    })),
    state('dr4', style({
        height: '3.5rem',
        opacity: 1,
    })),
    state('void', style({
        height: '0px',
        opacity: 0,
    })),
    state(':leave', style({
        height: '0px',
        opacity: 0,
    })),
    transition('* => *', [
        animate('0.3s'),
    ]),
]);
