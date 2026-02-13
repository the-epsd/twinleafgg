import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GamePhase, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, ADD_MARKER, HAS_MARKER, REMOVE_MARKER, HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Jellicent extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Frillish';
  public cardType: CardType = W;
  public hp: number = 120;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Vengeful Wish',
      cost: [C],
      damage: 0,
      text: 'If this Pokémon was damaged by an attack during your opponent\'s last turn, this attack does the same amount of damage done to the Defending Pokémon.'
    },
    {
      name: 'Absorb Life',
      cost: [W, W, C],
      damage: 30,
      text: 'Heal 30 damage from this Pokémon.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '35';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Jellicent';
  public fullName: string = 'Jellicent NXD';

  public readonly DAMAGE_RECEIVED_MARKER = 'DAMAGE_RECEIVED_MARKER';
  private lastDamageReceived: number = 0;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Track damage received during opponent's attack
    if (effect instanceof AfterDamageEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      // Only track if damaged by opponent during attack phase
      if (effect.damage > 0 && player !== targetPlayer && state.phase === GamePhase.ATTACK) {
        this.lastDamageReceived = effect.damage;

        targetPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
          if (cardList.cards.includes(this)) {
            ADD_MARKER(this.DAMAGE_RECEIVED_MARKER, cardList, this);
          }
        });
      }
    }

    // Vengeful Wish - deal same damage back
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.cards.includes(this) && HAS_MARKER(this.DAMAGE_RECEIVED_MARKER, cardList, this)) {
          if (this.lastDamageReceived > 0) {
            const putDamageEffect = new PutDamageEffect(effect, this.lastDamageReceived);
            putDamageEffect.target = opponent.active;
            store.reduceEffect(state, putDamageEffect);
          }
        }
      });
    }

    // Absorb Life - heal 30 damage
    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
    }

    // Clear marker at end of turn (marker lasts one turn cycle)
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.cards.includes(this)) {
          REMOVE_MARKER(this.DAMAGE_RECEIVED_MARKER, cardList, this);
          this.lastDamageReceived = 0;
        }
      });
    }

    return state;
  }
}
