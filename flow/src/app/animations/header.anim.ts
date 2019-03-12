import { trigger, state, transition, style, animate } from '@angular/animations';

export const slideDownAnimation = trigger('dropdownAnim', [
    state('show', style({
        height: '*'
    })),
    state('hide', style({
        height: 0
    })),
    transition('show <=> hide', animate('.25s ease'))
]);