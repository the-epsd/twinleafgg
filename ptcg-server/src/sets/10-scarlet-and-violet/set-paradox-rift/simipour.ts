import { CardType, Player, PlayerType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../../game';
import { CheckAttackCostEffect } from '../../../game/store/effects/check-effects';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

const MONKEY_TRIO_NAMES = ['Simisage', 'Simisear', 'Simipour'];

function hasMonkeyTrioInPlay(player: Player): boolean {
  const found = new Set<string>();
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, pokemonCard) => {
    if (MONKEY_TRIO_NAMES.includes(pokemonCard.name)) {
      found.add(pokemonCard.name);
    }
  });
  return found.size === MONKEY_TRIO_NAMES.length;
}

export class Simipour extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Panpour';
  public hp: number = 100;
  public cardType: CardType = W;
  public weakness = [{ type: L }];
  public resistance = [];
  public retreat = [C];

  public powers = [{
    name: 'Monkey Trio',
    powerType: PowerType.ABILITY,
    text: 'If you have Simisage, Simisear, and Simipour in play, ignore all [C] Energy in the costs of attacks used by this Pokémon.',
  }];

  public attacks = [{
    name: 'Liquid Lashing',
    cost: [W, C, C],
    damage: 50,
    text: 'This attack also does 30 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)',
  }];

  public regulationMark: string = 'G';
  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Simipour';
  public fullName: string = 'Simipour PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Monkey Trio
    if (effect instanceof CheckAttackCostEffect) {
      if (effect.player.active.getPokemonCard() !== this) {
        return state;
      }
      const player = effect.player;
      if (!StateUtils.isPokemonInPlay(player, this)) {
        return state;
      }
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }
      if (!hasMonkeyTrioInPlay(player)) {
        return state;
      }
      effect.cost = effect.cost.filter(c => c !== CardType.COLORLESS);
    }

    // Liquid Lashing
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.bench.forEach(benched => {
        if (benched.cards.length > 0) {
          const damage = new PutDamageEffect(effect, 30);
          damage.target = benched;
          store.reduceEffect(state, damage);
        }
      });
    }

    return state;
  }
}