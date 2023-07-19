import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChooseCardsPrompt } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';

export class SingleStrikeUrshifuV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardTag: CardTag[ ] = [ CardTag.SINGLE_STRIKE, CardTag.POKEMON_V ];

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 220;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Laser Focus',
      cost: [ CardType.COLORLESS ],
      damage: 0,
      text: 'Search your deck for up to 2 F Energy cards and attach ' +
        'them to this Pokémon. Then, shuffle your deck.'
    },
    {
      name: 'Impact Blow',
      cost: [ CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS ],
      damage: 180,
      text: 'During your next turn, this Pokémon can\'t use ' +
      'Impact Blow.'
    }
  ];

  public set: string = 'BST';

  public name: string = 'Single Strike Urshifu V';

  public fullName: string = 'Single Strike Urshifu V BST 085';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const cardList = StateUtils.findCardList(state, this);
      if (cardList === undefined) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_ATTACH,
        player.deck,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fighting Energy' },
        { min: 0, max: 2, allowCancel: true }
      ), cards => {
        cards = cards || [];
        if (cards.length > 0) {
          player.deck.moveCardsTo(cards, cardList);
        }
      });
    }

    return state;
  }

  

}
