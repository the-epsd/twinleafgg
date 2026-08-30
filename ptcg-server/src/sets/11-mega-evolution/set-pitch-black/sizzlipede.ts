import { CardType, PokemonCard, Stage, State, StoreLike } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, DISCARD_TOP_X_OF_OPPONENTS_DECK } from "../../../game/store/prefabs/prefabs";
import { BUG_OUT } from "../../../game/store/prefabs/shared-attack-prefabs";

export class Sizzlipede extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [R];
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Controlled Burn',
      cost: [R],
      damage: 0,
      text: "Discard the top card of your opponent's deck.",
    },
    {
      name: 'Bug Out',
      cost: [C, C, C],
      damage: 50,
      damageCalculation: 'x',
      text: 'Reveal the bottom 7 cards of your deck, and this attack does 50 damage for each Pokémon you find there that has the Bug Out attack. Then, shuffle any revealed Pokémon back into your deck. Discard the other cards.',
    },
  ];

  public set: string = 'PBL';
  public setNumber: string = '9';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sizzlipede';
  public fullName: string = 'Sizzlipede M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_TOP_X_OF_OPPONENTS_DECK(store, state, effect.player, 1, this, effect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      BUG_OUT(store, state, effect);
    }

    return state;
  }
}
