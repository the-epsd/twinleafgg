import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { PowerType, PlayerType } from '../../game';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Seviper extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 120;
  public weakness = [{ type: F }];
  public resistance = [];
  public retreat = [C];

  public powers = [{
    name: 'Excite Power',
    powerType: PowerType.ABILITY,
    text: 'If you have a [D] Pokemon ex in play, this Pokemon\'s attacks do 120 more damage to your opponent\'s Active Pokemon.'
  }];

  public attacks = [{
    name: 'Jet Black Fang',
    cost: [D, D, D],
    damage: 120,
    text: '',
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '62';
  public name: string = 'Seviper';
  public fullName: string = 'Seviper M2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.source.cards.includes(this)) {
      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Check if player has a [D] Pokemon ex in play
      let hasDarkPokemonEx = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card && card instanceof PokemonCard &&
          card.cardType === CardType.DARK &&
          card.tags.includes(CardTag.POKEMON_ex)) {
          hasDarkPokemonEx = true;
        }
      });

      // Add 120 more damage if condition is met
      if (hasDarkPokemonEx && effect.damage > 0) {
        effect.damage += 120;
      }
    }

    return state;
  }
}
