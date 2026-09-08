import { PokemonCard, Stage, CardType, StoreLike, State, PlayerType } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

/** #34 — Pika Chain */
export class Pikachu34 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C, C];
  public attacks = [{
    name: 'Pika Chain',
    cost: [L, L, L],
    damage: 40,
    damageCalculation: 'x',
    text: 'This attack does 40 damage for each of your Pikachu and Pikachu ex in play.'
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 34';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Pika Chain
    if (WAS_ATTACK_USED(effect, 0, this)) {
      let count = 0;
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList.getPokemonCard() !== card) {
          return;
        }
        if (card.name === 'Pikachu' || card.name === 'Pikachu ex') {
          count++;
        }
      });
      effect.damage = 40 * count;
    }
    return state;
  }
}
