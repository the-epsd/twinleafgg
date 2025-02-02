import { Attack, Power, State, StoreLike } from '../../..';
import { Effect } from '../effects/effect';
import { ToolEffect } from '../effects/play-card-effects';
import { Card } from './card';
import { Format, SuperType, TrainerType } from './card-types';
export declare abstract class TrainerCard extends Card {
    superType: SuperType;
    trainerType: TrainerType;
    format: Format;
    text: string;
    attacks: Attack[];
    powers: Power[];
    firstTurn: boolean;
    stadiumDirection: 'up' | 'down';
    toolEffect: ToolEffect | undefined;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
