import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, THIS_ATTACK_DOES_X_MORE_DAMAGE } from '../../game/store/prefabs/prefabs';

export class MarniesLiepard extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Marnie\'s Purrloin';
  public tags = [CardTag.MARNIES];
  public cardType: CardType = D;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Pointy Claws',
    cost: [D, D],
    damage: 70,
    text: 'If your opponent\'s Active Pokémon is a Pokémon ex, this attack does 70 more damage.'
  }];

  public regulationMark = 'I';
  public set: string = 'SVOM';
  public setNumber = '2';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Marnie\'s Liepard';
  public fullName: string = 'Marnie\'s Liepard SVOM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const defending = opponent.active.getPokemonCard();

      if (defending && defending.tags.includes(CardTag.POKEMON_ex)) {
        THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 70);
      }
    }
    return state;
  }
}
