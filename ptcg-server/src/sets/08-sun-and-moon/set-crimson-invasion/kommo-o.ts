import { CardType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class KommoO extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Hakamo-o';
  public cardType: CardType[] = [N];
  public hp: number = 160;
  public weakness = [{ type: Y }];
  public retreat = [C, C];

  public attacks = [{
    name: 'War Cry',
    cost: [C, C],
    damage: 30,
    damageCalculation: '+',
    text: 'If you have fewer Pokémon in play than your opponent, this attack does 90 more damage.'
  },
  {
    name: 'Clanging Scales',
    cost: [L, F, C],
    damage: 130,
    text: 'During your opponent\'s next turn, this Pokémon takes 30 more damage from attacks (after applying Weakness and Resistance).'
  }];

  public set: string = 'CIN';
  public setNumber: string = '77';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Kommo-o';
  public fullName: string = 'Kommo-o CIN';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // War Cry
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let myCount = 1;
      player.bench.forEach(b => { if (b.cards.length > 0) myCount++; });

      let oppCount = 1;
      opponent.bench.forEach(b => { if (b.cards.length > 0) oppCount++; });

      if (myCount < oppCount) {
        effect.damage += 90;
      }
    }

    // Clanging Scales — self takes more damage (negative damageReductionNextTurn)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.damageReductionNextTurn = -30;
    }

    return state;
  }
}
