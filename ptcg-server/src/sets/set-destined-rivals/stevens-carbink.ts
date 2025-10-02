import { PokemonCard, PowerType, SlotType, StateUtils } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class StevensCarbink extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags: CardTag[] = [CardTag.STEVENS];
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public powers = [{
    name: 'Stone Palace',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is on the Bench, all of your Steven\'s Pokémon take 30 less damage ' +
      'from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance). ' +
      'The effect of Stone Palace doesn\'t stack.'
  }];

  public attacks = [
    {
      name: 'Magical Shot',
      cost: [P, C, C],
      damage: 80,
      text: ''
    }
  ];

  public regulationMark: string = 'I';
  public set: string = 'DRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';
  public name: string = 'Steven\'s Carbink';
  public fullName: string = 'Steven\'s Carbink DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && StateUtils.isPokemonInPlay(effect.player, this, SlotType.BENCH)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, opponent, this)) {
        return state;
      }

      if (effect.target.getPokemonCard()?.tags.includes(CardTag.STEVENS)) {
        effect.reduceDamage(30, this.powers[0].name);
      }
      return state;
    }
    return state;
  }
}
