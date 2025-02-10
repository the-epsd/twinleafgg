import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChooseCardsPrompt, ShuffleDeckPrompt } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';

export class Pignite extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Tepig';
  public cardType: CardType = R;
  public hp: number = 100;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Flame Charge',
      cost: [C],
      damage: 0,
      text: 'Search your deck for a [R] Energy card and attach it to this Pokémon. Shuffle your deck afterward.'
    },
    {
      name: 'Heat Crash',
      cost: [R, R, C],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'BLW';
  public name: string = 'Pignite';
  public fullName: string = 'Pignite BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const cardList = StateUtils.findCardList(state, this);
      if (cardList === undefined) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_ATTACH,
        player.deck,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { min: 1, max: 1, allowCancel: true }
      ), cards => {
        cards = cards || [];
        if (cards.length > 0) {
          player.deck.moveCardsTo(cards, cardList);
        }
        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }

    return state;
  }

}
