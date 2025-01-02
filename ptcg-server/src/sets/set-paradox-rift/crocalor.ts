import { Card, CardType, ChooseCardsPrompt, GameMessage, PokemonCard, Stage, State, StoreLike, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Crocalor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Fuecoco';
  public cardType: CardType = CardType.FIRE;
  public hp: number = 100;
  public weakness = [{ type: CardType.WATER }];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Rolling Fireball',
    cost: [CardType.FIRE, CardType.FIRE],
    damage: 90,
    text: 'Put an Energy attached to this Pokémon into your hand.'
  }];

  public regulationMark = 'H';
  public set: string = 'PAR';
  public setNumber: string = '24';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Crocalor';
  public fullName: string = 'Crocalor PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let card: Card;

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.active,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        card = selected[0];
  
        player.active.moveCardTo(card, player.hand);
        return state;
      });
    }

    return state;
  }

}
