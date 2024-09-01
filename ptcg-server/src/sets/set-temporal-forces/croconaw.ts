import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Croconaw extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Totodile';

  public cardType: CardType = CardType.WATER;

  public hp: number = 90;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Reverse Thrust',
    cost: [CardType.WATER],
    damage: 30,
    text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
  }];

  public set: string = 'TEF';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '40';

  public name: string = 'Croconaw';

  public fullName: string = 'Croconaw TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const hasBenched = player.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: true },
      ), selected => {
        if (!selected || selected.length === 0) {
          return state;
        }
        const target = selected[0];
        player.switchPokemon(target);
      });
    }
    return state;
  }
}
