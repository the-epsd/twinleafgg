import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';
import { TrainerTargetEffect } from '../../game/store/effects/play-card-effects';

export class Electrike extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Ω Barrier',
    powerType: PowerType.ANCIENT_TRAIT,
    text: 'Whenever your opponent plays a Trainer card (excluding Pokémon Tools and Stadium cards), prevent all effects of that card done to this Pokémon.'
  }];

  public attacks = [
    {
      name: 'Thunder Fang',
      cost: [L],
      damage: 10,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
  ];

  public set: string = 'PRC';
  public setNumber = '60';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Electrike';
  public fullName: string = 'Electrike PRC';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (
      effect instanceof TrainerTargetEffect &&
      effect.target &&
      effect.target?.cards?.includes(this) &&
      !(effect.trainerCard?.trainerType === TrainerType.TOOL || effect.trainerCard?.trainerType === TrainerType.STADIUM)
    ) {
      const targetCard = effect.target.getPokemonCard();
      if (targetCard && targetCard.fullName === this.fullName) {
        effect.target = undefined;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, (result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      }));
    }

    return state;
  }

}