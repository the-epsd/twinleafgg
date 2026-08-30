import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Fuecoco extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [R];
  public hp: number = 90;
  public weakness = [{ type: W }];
  public resistance = [];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Spacing Out',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, heal 30 damage from this Pokémon.'
  }, {
    name: 'Flare',
    cost: [R, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'G';

  public set: string = 'PAL';
  public setNumber: string = '35';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Fuecoco';
  public fullName: string = 'Fuecoco PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return COIN_FLIP_PROMPT(store, state, player, flipResult => {
        if (flipResult) {
          const healEffect = new HealEffect(effect.player, effect.source, 30);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    return state;
  }
}
