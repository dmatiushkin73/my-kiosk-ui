import { trigger, state, style, animate, transition } from '@angular/animations';

export function visibility() {
    return trigger('visibility', [
        state('shown', style({
          transform: 'scale(1.0)',
          opacity: 1
        })),
        state('hidden', style({
          transform: 'scale(0.5)',
          opacity: 0
        })),
        transition('* => *', animate('5s ease-in-out'))
    ]);
}

export function flyInOut() {
    return trigger('flyInOut', [
        state('*', style({
            opacity: 1,
            transform: 'translateY(0)'
        })),
        transition(':enter', [
            style({ transform: 'translateY(100%)', opacity: 0}),
            animate('500ms ease-out')
        ]),
        transition(':leave', [
            animate('500ms ease-in', style({ transform: 'translateY(100%)', opacity: 0}))
        ])
    ]);
}

export function flyInOutLeft() {
    return trigger('flyInOutLeft', [
        state('*', style({
            opacity: 1,
            transform: 'translateX(0)'
        })),
        transition(':enter', [
            style({ transform: 'translateX(-100%)', opacity: 0}),
            animate('500ms ease-out')
        ]),
        transition(':leave', [
            animate('500ms ease-in', style({ transform: 'translateX(-100%)', opacity: 0}))
        ])
    ]);
}

export function expand() {
    return trigger('expand', [
        state('*', style({
            opacity: 1,
            transform: 'translateY(0)'
        })),
        transition(':enter', [
            style({ transform: 'translateY(-50%)', opacity: 0}),
            animate('200ms ease-in', style({
                opacity: 1,
                transform: 'translateY(0)'
            }))
        ])
    ]);
}

export function appear() {
    return trigger('appear', [
        state('*', style({
            opacity: 1,
            transform: 'scale(1.0)'
        })),
        transition(':enter', [
            style({ transform: 'scale(0.5)', opacity: 0}),
            animate('500ms ease-in', style({
                opacity: 1,
                transform: 'scale(1.0)'
            }))
        ])
    ]);
}

export function emerge() {
    return trigger('emerge', [
        state('*', style({
            opacity: 1
        })),
        transition(':enter', [
            style({ opacity: 0}),
            animate('1000ms ease-out', style({
                opacity: 1
            }))
        ])
    ]);
}