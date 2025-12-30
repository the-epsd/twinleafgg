import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, Card, ChooseCardsPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class GroudonEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 180;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Rip Claw',
      cost: [F, C],
      damage: 30,
      text: 'Flip a coin. If heads, discard an Energy attached to your opponent\'s Active Pokémon.'
    }, {
      name: 'Massive Rend',
      cost: [F, F, F, C],
      damage: 130,
      text: ''
    },
  ];

  public set: string = 'PRC';
  public name: string = 'Groudon-EX';
  public fullName: string = 'Groudon EX PRC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rip Claw
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {

          if (!opponent.active.energies.cards.some(c => c.superType === SuperType.ENERGY)) {
            return state;
          }

          let cards: Card[] = [];
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.active,
            { superType: SuperType.ENERGY },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            cards = selected;

            MOVE_CARDS(store, state, opponent.active, opponent.discard, { cards: cards });
          });

        }
      });
    }

    return state;
  }

}
