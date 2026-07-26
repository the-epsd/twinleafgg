import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class MegaTatsugiriex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = W;
  public hp: number = 260;
  public weakness = [{ type: L }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Triple Crown Headbutt',
    cost: [W, W, W],
    damage: 150,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 150 damage for each heads.'
  }];

  public regulationMark = 'J';
  public set: string = 'M-P';
  public setNumber: string = '139';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Tatsugiri ex';
  public fullName: string = 'Mega Tatsugiri ex M-P';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Triple Crown Headbutt
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 150 * heads;
      });
    }

    return state;
  }
}