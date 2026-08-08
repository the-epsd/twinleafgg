import { PokemonCard, CardTag, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, YOUR_OPPONENT_CANNOT_ATTACH_ENERGY_FROM_HAND_TO_DEFENDING_POKEMON, DISCARD_TOP_X_CARDS_FROM_YOUR_DECK } from "../../../game/store/prefabs/prefabs";

export class DracozoltV extends PokemonCard {
  public tags = [CardTag.POKEMON_V];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 220;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Primeval Beak',
    cost: [L],
    damage: 30,
    text: 'During your opponent\'s next turn, Energy cards can\'t be attached from your opponent\'s hand to the Defending Pokémon.'
  },
  {
    name: 'Mountain Swing',
    cost: [L, L, C],
    damage: 180,
    text: 'Discard the top 3 cards of your deck.'
  }];

  public regulationMark: string = 'E';
  public set: string = 'EVS';
  public setNumber: string = '58';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dracozolt V';
  public fullName: string = 'Dracozolt V EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Primeval Beak
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return YOUR_OPPONENT_CANNOT_ATTACH_ENERGY_FROM_HAND_TO_DEFENDING_POKEMON(store, state, effect, this);
    }

    // Mountain Swing
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_TOP_X_CARDS_FROM_YOUR_DECK(store, state, effect.player, 3, this, effect);
    }

    return state;
  }
}
