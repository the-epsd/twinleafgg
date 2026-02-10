import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GamePhase, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Aerodactyl extends PokemonCard {
  public stage: Stage = Stage.RESTORED;
  public evolvesFrom: string = 'Old Amber Aerodactyl';
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Ancient Scream',
    powerType: PowerType.ABILITY,
    text: 'Your Pokémon\'s attacks do 10 more damage to the Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Wing Attack',
    cost: [C, C, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'DEX';
  public setNumber: string = '53';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Aerodactyl';
  public fullName: string = 'Aerodactyl DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ancient Scream - boost damage to Active Pokemon
    if (effect instanceof DealDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Only works during attack phase
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      // Check if this Aerodactyl is in play
      let isThisInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });

      if (!isThisInPlay) {
        return state;
      }

      // Check if ability is blocked
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      // Only boost damage to opponent's Active Pokemon
      if (effect.target !== opponent.active) {
        return state;
      }

      // Only boost if attack actually does damage
      if (effect.damage > 0) {
        effect.damage += 10;
      }
    }

    return state;
  }
}
