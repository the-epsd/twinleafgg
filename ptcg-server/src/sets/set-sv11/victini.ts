import { PokemonCard, Stage, CardType, StoreLike, State } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Victini extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'V Force',
    cost: [R, R],
    damage: 120,
    text: 'If you have less than 5 Benched Pokémon, this attack does nothing.'
  }];

  public regulationMark = 'I';
  public set: string = 'SV11B';
  public setNumber: string = '12';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Victini';
  public fullName: string = 'Victini SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Count number of benched Pokémon
      const benchedCount = player.bench.reduce((count, b) => count + (b.cards.length ? 1 : 0), 0);

      // If less than 5 benched Pokémon, attack does nothing
      if (benchedCount < 5) {
        effect.damage = 0;
      }
    }
    return state;
  }
}
