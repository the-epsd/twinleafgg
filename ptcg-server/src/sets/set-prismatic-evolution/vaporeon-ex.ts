import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType } from '../../game';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Vaporeonex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Eevee';
  public cardType: CardType = W;
  public hp: number = 280;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Severe Squall',
    cost: [W, C],
    damage: 0,
    text: 'This attack does 60 damage to each of your opponent\'s Pokémon ex. Don\'t apply Weakness and Resistance for this damage.'
  },
  {
    name: 'Aquamarine',
    cost: [R, W, L],
    damage: 280,
    text: 'During your next turn, this Pokemon can\'t attack.'
  }];

  public regulationMark: string = 'H';
  public set: string = 'PRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Vaporeon ex';
  public fullName: string = 'Vaporeon ex PRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Severe Squall
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card.tags.includes(CardTag.POKEMON_ex)) {
          const damageEffect = new PutDamageEffect(effect, 60);
          damageEffect.target = cardList;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    // Aquamarine
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }

    return state;
  }
}