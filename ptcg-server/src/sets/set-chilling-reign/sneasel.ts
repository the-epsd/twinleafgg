import { PokemonCard, Stage, CardTag, CardType, Card, ChooseCardsPrompt, CoinFlipPrompt, EnergyCard, GameMessage, State, StateUtils, StoreLike, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Sneasel extends PokemonCard {

  public stage = Stage.BASIC; 

  public tags = [ CardTag.RAPID_STRIKE ];

  public cardType = CardType.WATER;

  public hp = 70;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Cut Down',
    cost: [ CardType.COLORLESS ],
    damage: 0,
    text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
  }];

  public set: string = 'CRE';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '30';

  public name: string = 'Sneasel';

  public fullName: string = 'Sneasel CRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {

          // Defending Pokemon has no energy cards attached
          if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
            return state;
          }

          let card: Card;
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.active,
            { superType: SuperType.ENERGY },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            card = selected[0];

            opponent.active.moveCardTo(card, opponent.discard);
            return state;
          });
        }});
      return state;
    }
    return state;
  }
}