import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { BetweenTurnsEffect } from '../../../game/store/effects/game-phase-effects';
import { PlayerType, PowerType, StateUtils, StoreLike, State } from '../../../game';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Weezing extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Koffing';
  public hp: number = 120;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Detention Gas',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is your Active Pokémon, put 1 damage counter on each of your opponent\'s Basic Pokémon between turns.'
  }];

  public attacks = [{
    name: 'Splattering Sludge',
    cost: [C, C],
    damage: 40,
    text: 'This attack does 20 damage to each of your opponent\'s Benched Pokémon that has any damage counters on it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Weezing';
  public fullName: string = 'Weezing UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Detention Gas
    if (effect instanceof BetweenTurnsEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card.stage === Stage.BASIC) {
          store.reduceEffect(
            state,
            new PlaceDamageCountersEffect(player, cardList, 10, this, this.powers[0]),
          );
        }
      });
    }

    // Splattering Sludge
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.bench.forEach(benched => {
        if (benched.cards.length > 0 && benched.damage > 0) {
          const damage = new PutDamageEffect(effect, 20);
          damage.target = benched;
          store.reduceEffect(state, damage);
        }
      });
    }

    return state;
  }
}
