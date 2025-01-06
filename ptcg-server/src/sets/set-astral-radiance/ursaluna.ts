import {
  Card,
  ChooseCardsPrompt,
  ChooseEnergyPrompt,
  GameLog,
  GameMessage,
  ShowCardsPrompt,
  State,
  StateUtils,
  StoreLike
} from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Ursaluna extends PokemonCard {

  public regulationMark = 'F';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Ursaring';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 180;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Peat Hunt',
      damage: 0,
      cost: [CardType.COLORLESS],
      text: 'Put up to 2 cards from your discard pile into your hand.'
    },
    {
      name: 'Bulky Bump',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 200,
      text: 'Discard 2 Energy from this Pokémon.'
    }
  ];

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '124';

  public name: string = 'Ursaluna';

  public fullName: string = 'Ursaluna ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const cardsInDiscardPile = player.discard.cards.length;

      if (cardsInDiscardPile === 0) {
        return state;
      }

      const max = Math.min(cardsInDiscardPile, 2);

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        {},
        { min: max, max: max, allowCancel: false }
      ), selected => {
        const cards = selected || [];

        store.prompt(state, [new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          cards
        )], () => {
          player.discard.moveCardsTo(cards, player.hand);
        });

        cards.forEach(card => {
          store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
        });

        return state;
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS, CardType.COLORLESS],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
    }

    return state;
  }
}