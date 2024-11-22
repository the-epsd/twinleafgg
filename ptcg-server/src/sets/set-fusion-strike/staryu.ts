import { ChooseCardsPrompt, EnergyCard, GameMessage, State, StateUtils, StoreLike } from '../../game';
import { CardTag, CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';


export class Staryu extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public tags = [CardTag.RAPID_STRIKE];

  public hp: number = 60;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Soak in Water',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Attach a [W] Energy card from your hand to this Pokémon.'
    },
    {
      name: 'Spinning Attack',
      cost: [CardType.WATER],
      damage: 10,
      text: ''
    }
  ];

  public regulationMark = 'E';

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '52';

  public name: string = 'Staryu';

  public fullName: string = 'Staryu FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.WATER);
      });

      if (!hasEnergyInHand) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_ATTACH,
        player.hand,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
        { min: 0, max: 1, allowCancel: false }
      ), cards => {
        cards = cards || [];
        if (cards.length > 0) {
          const cardList = StateUtils.findCardList(state, this);
          player.hand.moveCardsTo(cards, cardList);
        }
      });
    }
    return state;
  }
}
