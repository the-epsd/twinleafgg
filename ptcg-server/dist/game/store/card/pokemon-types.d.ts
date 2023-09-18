import { CardType } from './card-types';
export interface Weakness {
    type: CardType;
    value?: number;
}
export interface Resistance {
    type: CardType;
    value: number;
}
export interface Attack {
    cost: CardType[];
    damage: number;
    name: string;
    text: string;
}
export declare enum PowerType {
    POKEBODY = 0,
    POKEPOWER = 1,
    ABILITY = 2,
    ANCIENT_TRAIT = 3
}
export interface Power {
    name: string;
    powerType: PowerType;
    text: string;
    useWhenInPlay?: boolean;
    useFromHand?: boolean;
    useFromDiscard?: boolean;
    useFromLostZone?: boolean;
}
