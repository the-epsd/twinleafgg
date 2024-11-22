import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Card, ChooseCardsPrompt, EnergyCard, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';


export class GyaradosVMAX extends PokemonCard {

  public regulationMark = 'E';

  public tags = [ CardTag.POKEMON_VMAX ];

  public stage: Stage = Stage.VMAX;

  public evolvesFrom = 'Gyarados V';

  public cardType: CardType = CardType.WATER;

  public hp: number = 330;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [{
    name: 'Hyper Beam',
    cost: [ CardType.WATER, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 120,
    text: 'Discard an Energy from your opponent\'s Active Pokémon.'
  }, {
    name: 'Max Tyrant',
    cost: [ CardType.WATER, CardType.WATER, CardType.WATER, CardType.COLORLESS ],
    damage: 240,
    text: ''
  }];

  public set: string = 'EVS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '29';

  public name: string = 'Gyarados VMAX';

  public fullName: string = 'Gyarados VMAX EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

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
    }
    return state;
  }
}