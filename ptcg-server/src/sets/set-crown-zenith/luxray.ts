import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { ChooseCardsPrompt, GameMessage, PowerType, ShowCardsPrompt, ShuffleDeckPrompt, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';


export class Luxray extends PokemonCard {

  public regulationMark = 'F';

  public stage: Stage = Stage.STAGE_2;

  public tags = [CardTag.PLAY_DURING_SETUP];

  public evolvesFrom = 'Luxio';

  public cardType: CardType = L;

  public hp: number = 160;

  public weakness = [{ type: F }];

  public retreat = [];

  public powers = [{
    name: 'Explosiveness',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in your hand when you are setting up to play, you may put it face down as your Active Pokémon.'
  }];

  public attacks = [{

    name: 'Seeking Fang',
    cost: [C],
    damage: 50,
    text: 'Search your deck for up to 2 Trainer cards, reveal them, and put them into your hand. Then, shuffle your deck.'
  }];

  public set: string = 'CRZ';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '44';

  public name: string = 'Luxray';

  public fullName: string = 'Luxray CRZ';



  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        return state;
      }

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.TRAINER },
        { min: 0, max: 2, allowCancel: false }
      ), selected => {
        const cards = selected || [];

        store.prompt(state, [new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          cards
        )], () => {
          player.deck.moveCardsTo(cards, player.hand);
        });
        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }
    return state;
  }
}