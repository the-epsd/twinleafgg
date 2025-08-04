import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Flygonex extends PokemonCard {
  public tags = [CardTag.DELTA_SPECIES, CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Vibrava';
  public cardType: CardType = P;
  public hp: number = 150;
  public retreat = [C, C];

  public powers = [{
    name: 'Sand Damage',
    powerType: PowerType.POKEBODY,
    text: 'As long as Flygon ex is your Active Pokémon, put 1 damage counter on each of your opponent\'s Benched Basic Pokémon between turns. You can\'t use more than 1 Sand Damage Poké-Body between turns.'
  }];

  public attacks = [{
    name: 'Psychic Pulse',
    cost: [P, P, C],
    damage: 80,
    text: 'Does 10 damage to each of your opponent\'s Benched Pokémon that has any damage counters on it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';
  public name: string = 'Flygon ex';
  public fullName: string = 'Flygon ex DF 92';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof BetweenTurnsEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList === opponent.active) {
          return;
        }

        // ex era ruling is that this should mean unevolved
        if (cardList.getPokemons().length === 1 || card.tags.includes(CardTag.LEGEND)) {
          cardList.damage += (10);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      benched.forEach(target => {
        if (target.damage !== 0) {
          const damageEffect = new PutDamageEffect(effect, 10);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    return state;
  }
}