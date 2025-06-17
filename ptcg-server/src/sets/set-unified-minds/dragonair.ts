import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard, GameMessage, StateUtils, Card, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Dragonair extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Dratini';
  public cardType: CardType = N;
  public hp: number = 100;
  public weakness = [{ type: Y }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Tail Whip',
    cost: [C],
    damage: 20,
    text: ''
  }, {
    name: 'Destructive Whirlpool',
    cost: [W, L, C, C],
    damage: 70,
    text: 'Discard an Energy from your opponent\'s Active Pokémon.'
  }];

  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '150';
  public name: string = 'Dragonair';
  public fullName: string = 'Dragonair UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Defending Pokemon has no energy cards attached
      if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
        return state;
      }

      let cards: Card[] = [];
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.active,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        cards = selected || [];
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        return store.reduceEffect(state, discardEnergy);
      });
    }
    return state;
  }
}
