import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_A_STADIUM_CARD_IN_PLAY } from '../../game/store/prefabs/attack-effects';
import { ABILITY_USED, ADD_MARKER, CONFIRMATION_PROMPT, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { CardList } from '../../game/store/state/card-list';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { StateUtils } from '../../game/store/state-utils';

export class Magcargo extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Slugma';
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Smooth Over',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may search your deck for a card. Shuffle your deck, then put that card on top of your deck. This power can\'t be used if Magcargo is affected by a Special Condition.'
  }];

  public attacks = [
    {
    name: 'Knock Over',
    cost: [C],
    damage: 10,
    text: 'You may discard any Stadium card in play.'
    },
    {
    name: 'Combustion',
    cost: [R, C, C],
    damage: 50,
    text: ''
    }
  ];

  public set: string = 'DX';
  public name: string = 'Magcargo';
  public fullName: string = 'Magcargo DX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';

  public readonly SMOOTH_OVER_MARKER: string = 'SMOOTH_OVER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (HAS_MARKER(this.SMOOTH_OVER_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.active.cards[0] === this && player.active.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const deckTop = new CardList();

      store.prompt(state, new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK,
      player.deck,
      {},
      { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];

        player.deck.moveCardsTo(cards, deckTop);
        
          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
              deckTop.applyOrder(order);
              deckTop.moveToTopOfDestination(player.deck);
          });
      });

      ADD_MARKER(this.SMOOTH_OVER_MARKER, player, this)
      ABILITY_USED(player, this);

      return state;
    }
    
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SMOOTH_OVER_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard) {
          if (CONFIRMATION_PROMPT(store, state, effect.player, result => {
          if (result) {
            DISCARD_A_STADIUM_CARD_IN_PLAY(state);
          }
        })) {
        }
      }
    }
    
    return state;
  }

}