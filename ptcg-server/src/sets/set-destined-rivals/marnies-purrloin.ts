import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, THIS_ATTACK_DOES_X_MORE_DAMAGE } from '../../game/store/prefabs/prefabs';

export class MarniesPurrloin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.MARNIES];
  public cardType: CardType = D;
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Sharp Nail',
    cost: [D],
    damage: 20,
    text: 'If your opponent\'s Active Pokémon is a Pokémon ex, this attack does 40 more damage.'
  }];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber = '130';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Marnie\'s Purrloin';
  public fullName: string = 'Marnie\'s Purrloin DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const defending = opponent.active.getPokemonCard();

      if (defending && defending.tags.includes(CardTag.POKEMON_ex)) {
        THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 40);
      }
    }
    return state;
  }
}