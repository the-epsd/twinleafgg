import { PokemonCard, Stage, CardType, StoreLike, State, PlayerType } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { PutDamageEffect } from "../../game/store/effects/attack-effects";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Diggersby extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Bunnelby';
  public cardType: CardType = C;
  public hp: number = 150;
  public weakness = [{ type: F }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Earthquake',
    cost: [C],
    damage: 140,
    text: 'This attack does 30 damage to each of your Benched Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
  },
  {
    name: 'Whap Down',
    cost: [C, C, C],
    damage: 100,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'Diggersby';
  public fullName: string = 'Diggersby M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Earthquake - damage to benched Pokemon (no weakness/resistance)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList !== player.active) {
          const putDamageEffect = new PutDamageEffect(effect, 30);
          putDamageEffect.target = cardList;
          putDamageEffect.source = player.active;
          store.reduceEffect(state, putDamageEffect);
        }
      });
    }

    return state;
  }
}
