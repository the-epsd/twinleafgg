import { CardType, PokemonCard, Stage, State, StoreLike } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, DRAW_CARDS } from "../../../game/store/prefabs/prefabs";
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Lunatone extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Double Draw',
    cost: [C],
    damage: 0,
    text: 'Draw 2 cards.'
  },
  {
    name: 'Moonblast',
    cost: [F, C],
    damage: 20,
    text: 'During your opponent\'s next turn, any damage done by attacks from the Defending Pokémon is reduced by 20 (before applying Weakness and Resistance).'
  }];

  public set: string = 'XY';
  public setNumber: string = '63';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lunatone';
  public fullName: string = 'Lunatone XY';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Double Draw
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(store, state, player, 2);
    }

    // Moonblast
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 20);
    }

    return state;
  }
}
