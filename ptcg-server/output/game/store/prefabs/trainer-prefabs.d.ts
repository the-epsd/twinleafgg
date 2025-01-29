import { TrainerEffect } from '../effects/play-card-effects';
import { State } from '../state/state';
import { Store } from '../store';
import { StoreLike } from '../store-like';
export declare function DISCARD_X_CARDS_FROM_YOUR_HAND(effect: TrainerEffect, store: StoreLike, state: State, minAmount: number, maxAmount: number): void;
export declare function TRAINER_SHOW_OPPONENT_CARDS(effect: TrainerEffect, store: Store, state: State): void;
export declare function SHUFFLE_DECK(effect: TrainerEffect, store: Store, state: State): State;
