import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, Card, ChooseCardsPrompt, EnergyCard, PlayerType, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';

export class Ducklett extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = W;

  public hp: number = 70;

  public weakness = [{ type: L }];

  public resistance = [{ type: F, value: -30 }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Firefighting',
      cost: [C],
      damage: 0,
      text: 'Discard a [W] Energy from your opponent\'s Active Pokémon.'
    },
    {
      name: 'Wing Attack',
      cost: [C, C],
      damage: 20,
      text: ''
    }
  ];

  public regulationMark = 'I';

  public set: string = 'WHT';

  public name: string = 'Ducklett';

  public fullName: string = 'Ducklett SV11W';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '25';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let hasPokemonWithEnergy = false;
      const blocked: number[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.cards.some(c => c instanceof EnergyCard && (c.provides.includes(CardType.FIRE) || c.provides.includes(CardType.ANY)))) {
          hasPokemonWithEnergy = true;
        } else {
          blocked.push();
        }
      });

      if (!hasPokemonWithEnergy) {
        return state;
      }
      const target = opponent.active;
      let cards: Card[] = [];
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        target,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false, blocked: blocked }
      ), selected => {
        cards = selected || [];
      });

      if (cards.length > 0) {
        // Discard selected special energy card
        target.moveCardsTo(cards, opponent.discard);
        return state;
      }
    }
    return state;
  }
}