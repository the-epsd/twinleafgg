import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { GameMessage, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Slowpoke extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Unlimited Disposal',
      cost: [P],
      damage: 0,
      text: 'You may discard as many cards from your hand as you like.',
    },
    {
      name: 'Headbutt',
      cost: [C, C],
      damage: 20,
      text: '',
    },
  ];

  public set: string = 'M5';
  public setNumber: string = '28';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Slowpoke';
  public fullName: string = 'Slowpoke M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const self = this;
      const attackEffect = effect as AttackEffect;
      const player = attackEffect.player;
      function* useUnlimitedDisposal(next: Function): IterableIterator<State> {
        const max = player.hand.cards.length;
        if (max === 0) {
          return state;
        }
        yield store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.hand,
          { superType: SuperType.ANY },
          { min: 0, max, allowCancel: false }
        ), selected => {
          const cards = selected || [];
          if (cards.length > 0) {
            MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: self, sourceEffect: attackEffect });
          }
          next();
        });
        return state;
      }
      const generator = useUnlimitedDisposal(() => generator.next());
      return generator.next().value;
    }
    return state;
  }
}
