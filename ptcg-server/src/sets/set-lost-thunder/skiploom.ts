import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike, GameMessage, SuperType, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { ChooseCardsPrompt } from '../../game';
import { MOVE_CARDS, SHUFFLE_DECK, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

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
    if (WAS_POWER_USED(effect, 0, this)) {
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
          // replacing the card with a jumpluff from the deck
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
            player.deck,
            { superType: SuperType.POKEMON, name: 'Jumpluff' },
            { min: 0, max: 1, allowCancel: false }
          ), selected => {
            const jumpluffCards = selected || [];
            if (jumpluffCards.length === 0) {
              return state;
            }

            const jumpluff = jumpluffCards[0];

            // First: Move Jumpluff from deck to cardList
            state = MOVE_CARDS(store, state, player.deck, cardList, {
              cards: [jumpluff],
              sourceCard: this,
              sourceEffect: this.powers[0]
            });

            // Collect all cards in cardList except Jumpluff
            // This includes Skiploom, energies, and tools
            const allCards = [...cardList.cards, ...cardList.tools];
            const cardsToLostZone = allCards.filter(c => c !== jumpluff);

            // Move all cards except Jumpluff to Lost Zone
            if (cardsToLostZone.length > 0) {
              state = MOVE_CARDS(store, state, cardList, player.lostzone, {
                cards: cardsToLostZone,
                sourceCard: this,
                sourceEffect: this.powers[0]
              });
            }

            // Clear effects on cardList
            cardList.clearEffects();

            // Shuffle deck
            state = SHUFFLE_DECK(store, state, player);

            return state;
          });
        }
      });
    }

    return state;
  }
}
