import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike, GameMessage, SuperType, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { ChooseCardsPrompt } from '../../game';

export class Skiploom extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Hoppip';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 60;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [];

  public powers = [{
    name: 'Floral Path to the Sky',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may search your deck for Jumpluff, put this Pokémon and all cards attached to it in the Lost Zone, and put that Jumpluff in its place. Then, shuffle your deck.'
  }];

  public attacks = [
    {
      name: 'Tackle',
      cost: [CardType.GRASS],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'LOT';

  public setNumber = '13';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Skiploom';

  public fullName: string = 'Skiploom LOT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      // checking if this pokemon is in play
      let isThisInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });
      if (!isThisInPlay) {
        return state;
      }

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.getPokemonCard() === this) {
          // putting this card into the lost zone
          cardList.moveTo(player.lostzone);
          cardList.clearEffects();
          // replacing the card with a jumpluff from the deck
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
            player.deck,
            { superType: SuperType.POKEMON, name: 'Jumpluff' },
            { min: 0, max: 1, allowCancel: false }
          ), selected => {
            const cards = selected || [];
            player.deck.moveCardsTo(cards, cardList);
          });
        }
      });
    }

    return state;
  }
}
