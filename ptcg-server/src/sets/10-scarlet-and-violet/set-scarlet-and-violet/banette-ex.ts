import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, TrainerCard, ShowCardsPrompt } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_ITEM_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Banetteex extends PokemonCard {
  public regulationMark = 'G';
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Shuppet';
  public cardType: CardType = P;
  public hp: number = 250;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Everlasting Darkness',
    cost: [P],
    damage: 30,
    text: 'During your opponent\'s next turn, they can\'t play any Item cards from their hand.',
  },
  {
    name: 'Poltergeist',
    cost: [P, C],
    damage: 60,
    damageCalculation: 'x',
    text: 'Your opponent reveals their hand. This attack does 60 damage for each Trainer card you find there.',
  }];

  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';
  public name: string = 'Banette ex';
  public fullName: string = 'Banette ex SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Everlasting Darkness
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_ITEM_CARDS(store, state, effect, this);
    }

    // Poltergeist
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      state = store.prompt(state, new ShowCardsPrompt(
        player.id,
        GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        opponent.hand.cards
      ), () => {
        const cardsInOpponentHand = opponent.hand.cards.filter(card => card instanceof TrainerCard).length;
        const damage = opponent.hand.cards.slice(0, cardsInOpponentHand);
        effect.damage = damage.length * 60;
      });
    }
    return state;
  }
}
