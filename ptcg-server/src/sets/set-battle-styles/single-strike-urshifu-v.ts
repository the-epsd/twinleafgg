import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChooseCardsPrompt, PlayerType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class SingleStrikeUrshifuV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public tags = [ CardTag.POKEMON_V, CardTag.SINGLE_STRIKE ];

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

  WITHDRAW_MARKER = 'WITHDRAW_MARKER';
  CLEAR_WITHDRAW_MARKER = 'CLEAR_WITHDRAW_MARKER';

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

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      player.active.marker.addMarker(this.WITHDRAW_MARKER, this);

      if (effect instanceof AttackEffect 
        && player.active.marker.hasMarker(this.WITHDRAW_MARKER)) {
        effect.preventDefault = true;
        return state;
      }
      if (effect instanceof EndTurnEffect 
        && effect.player.marker.hasMarker(this.CLEAR_WITHDRAW_MARKER, this)) {
        effect.player.marker.removeMarker(this.CLEAR_WITHDRAW_MARKER, this);
        effect.player.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.WITHDRAW_MARKER, this);
        });
      }
    }

    return state;
  }

  

}
