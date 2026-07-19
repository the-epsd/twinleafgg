import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { Card } from '../../../game/store/card/card';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  DISCARD_TOP_X_OF_OPPONENTS_DECK,
  SHOW_CARDS_TO_PLAYER,
  SHUFFLE_DECK,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';
import { StateUtils } from '../../../game/store/state-utils';

export class Sizzlipede extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
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
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const revealCount = Math.min(7, player.deck.cards.length);
      const revealed: Card[] = [];
      for (let i = 0; i < revealCount; i++) {
        const c = player.deck.cards.pop();
        if (c !== undefined) {
          revealed.push(c);
        }
      }

      SHOW_CARDS_TO_PLAYER(store, state, player, revealed);
      SHOW_CARDS_TO_PLAYER(store, state, opponent, revealed);

      const bugOutPokemon = revealed.filter(
        (c) => c instanceof PokemonCard && c.attacks.some((a) => a.name === 'Bug Out'),
      );

      effect.damage = 50 * bugOutPokemon.length;

      bugOutPokemon.forEach((c) => {
        player.deck.cards.push(c);
      });
      revealed
        .filter((c) => !bugOutPokemon.includes(c))
        .forEach((c) => player.discard.cards.push(c));
      SHUFFLE_DECK(store, state, player);
    }

    return state;
  }
}
