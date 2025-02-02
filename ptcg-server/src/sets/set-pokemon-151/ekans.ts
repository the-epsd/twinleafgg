import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, EnergyCard, CoinFlipPrompt, Card, ChooseCardsPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Ekans extends PokemonCard {
  public regulationMark = 'G';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DARK;
  public hp: number = 70;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Acid Spray',
    cost: [CardType.DARK, CardType.DARK],
    damage: 30,
    text: ' Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
  }];

  public set: string = 'MEW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Ekans';
  public fullName: string = 'Ekans MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Opponent Active Pokemon has no energy cards attached
      if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
        return state;
      }

      return store.prompt(state, new CoinFlipPrompt(
        player.id, GameMessage.COIN_FLIP
      ), result => {
        if (result) {
          let cards: Card[] = [];
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.active,
            { superType: SuperType.ENERGY },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            cards = selected || [];
            const discardEnergy = new DiscardCardsEffect(effect, cards);
            discardEnergy.target = opponent.active;
            return store.reduceEffect(state, discardEnergy);
          });
        } else {
          return state;
        }
      });
    }

    return state;
  }
}