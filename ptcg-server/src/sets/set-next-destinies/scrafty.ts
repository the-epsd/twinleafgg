import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, ADD_MARKER, HAS_MARKER, REMOVE_MARKER } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Scrafty extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Scraggy';
  public cardType: CardType = D;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Rock Head',
      cost: [D],
      damage: 20,
      text: 'During your opponent\'s next turn, any damage done to this Pokemon by attacks is reduced by 20 (after applying Weakness and Resistance).'
    },
    {
      name: 'Hammer Kick',
      cost: [D, C, C],
      damage: 50,
      damageCalculation: '+',
      text: 'If this Pokemon has fewer remaining HP than the Defending Pokemon, this attack does 30 more damage.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '74';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Scrafty';
  public fullName: string = 'Scrafty NXD';

  public readonly ROCK_HEAD_MARKER = 'ROCK_HEAD_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rock Head - add marker for damage reduction
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          ADD_MARKER(this.ROCK_HEAD_MARKER, cardList, this);
        }
      });
    }

    // Reduce damage if marker is present
    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) {
      if (HAS_MARKER(this.ROCK_HEAD_MARKER, effect.target, this)) {
        effect.damage = Math.max(0, effect.damage - 20);
      }
    }

    // Hammer Kick - bonus damage if less HP
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const myRemainingHP = this.hp - player.active.damage;
      const defenderCard = opponent.active.getPokemonCard();
      const defenderRemainingHP = defenderCard ? defenderCard.hp - opponent.active.damage : 0;

      if (myRemainingHP < defenderRemainingHP) {
        effect.damage += 30;
      }
    }

    // Remove marker at end of opponent's turn
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          REMOVE_MARKER(this.ROCK_HEAD_MARKER, cardList, this);
        }
      });
    }

    return state;
  }
}
