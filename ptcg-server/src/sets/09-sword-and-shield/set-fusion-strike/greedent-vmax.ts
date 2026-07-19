
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_CARDS, IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class GreedentVMAX extends PokemonCard {
  public stage: Stage = Stage.VMAX;
  public evolvesFrom = 'Greedent V';
  public cardType: CardType = C;
  public hp: number = 320;
  public tags = [CardTag.POKEMON_VMAX];
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Turn a Profit',
    cost: [C, C],
    damage: 30,
    text: 'If your opponent\'s Basic Pokémon is Knocked Out by damage from this attack, take 2 more Prize cards.'
  },
  {
    name: 'Max Gimme Gimme',
    cost: [C, C, C],
    damage: 160,
    text: 'Draw 3 cards.'
  }];

  public set: string = 'FST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '218';
  public name: string = 'Greedent VMAX';
  public fullName: string = 'Greedent VMAX FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DRAW_CARDS(store, state, effect.player, 3);
    }

    return IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES(store, state, effect, this, {
      attackName: 'Turn a Profit',
      extraPrizes: 2,
      validate: (store, state, koEffect) => koEffect.target.isStage(Stage.BASIC),
    });
  }
}
