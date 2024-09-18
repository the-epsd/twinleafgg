import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, EnergyCard, GameError, GameMessage, ChooseEnergyPrompt, Card, GameLog } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Bouffalant extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 130;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Lost Headbutt',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 50,
      text: 'Put an Energy attached to your opponent\'s Active Pokémon in the Lost Zone.'
    },
    {
      name: 'Superpowered Horns',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 120,
      text: ''
    }
  ];

  public set: string = 'LOR';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '148';

  public name: string = 'Bouffalant';

  public fullName: string = 'Bouffalant LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS],
        { allowCancel: false }
      ), (energy) => {
        const cards: Card[] = (energy || []).map(e => e.card);

        cards.forEach(card => {
          const cardList = StateUtils.findCardList(state, card);
          if (cardList) {
            cardList.moveCardTo(card, opponent.lostzone);
            store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_LOST_ZONE, {
              player: opponent.name,
              card: card.name
            });
          }
        });
      });
    }
    return state;
  }
}