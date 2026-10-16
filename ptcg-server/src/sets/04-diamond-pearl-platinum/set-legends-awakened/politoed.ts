import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Player, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../../game/store/prefabs/attack-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

const ENTHUSIASM_ATTACKERS = new Set(['Poliwag', 'Poliwhirl', 'Poliwrath']);

function hasEnthusiasmLine(player: Player): boolean {
  const names = new Set<string>();
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_list, card) => {
    names.add(card.name);
  });
  return names.has('Poliwag') && names.has('Poliwhirl') && names.has('Poliwrath');
}

export class Politoed extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Poliwhirl';
  public hp: number = 120;
  public cardType: CardType[] = [W];
  public weakness = [{ type: G, value: +30 }];
  public retreat = [C];

  public powers = [{
    name: 'Enthusiasm',
    powerType: PowerType.POKEBODY,
    text: 'If you have Poliwag, Poliwhirl, and Poliwrath in play, each of these Pokémon\'s attacks does 60 more damage to the Defending Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Frog Hop',
    cost: [W, C],
    damage: 40,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 40 damage plus 40 more damage.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Politoed';
  public fullName: string = 'Politoed LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Enthusiasm
    if (effect instanceof DealDamageEffect) {
      const attacker = effect.source.getPokemonCard();
      if (!attacker || !ENTHUSIASM_ATTACKERS.has(attacker.name)) {
        return state;
      }
      const player = effect.player;
      if (!StateUtils.isPokemonInPlay(player, this)) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }
      if (hasEnthusiasmLine(player)) {
        effect.damage += 60;
      }
    }

    // Frog Hop
    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 40);
    }

    return state;
  }
}
