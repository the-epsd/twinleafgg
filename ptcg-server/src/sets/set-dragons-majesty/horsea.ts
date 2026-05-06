import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';

import { DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Horsea extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 40;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Splatter',
    cost: [W],
    damage: 0,
    text: 'This attack does 20 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'DRM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '16';
  public name: string = 'Horsea';
  public fullName: string = 'Horsea DRM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 20, targets);
      });
    }
    return state;
  }
}