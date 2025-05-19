import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, CardList, ChooseCardsPrompt, GameMessage, Card, TrainerCard, OrderCardsPrompt, GameError } from '../../game';
import { ABILITY_USED, ADD_CONFUSION_TO_PLAYER_ACTIVE, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, COIN_FLIP_PROMPT, HAS_MARKER, MOVE_CARD_TO, SHOW_CARDS_TO_PLAYER, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class PorygonZ extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Porygon2';
  public cardType: CardType = C;
  public hp: number = 110;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Dimensional Transfer',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may flip a coin. If heads, search your discard pile for a Trainer card, show it to your opponent, and put it on top of your deck. This power can\'t be used if Porygon-Z is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Suspicious Beam Beta',
    cost: [C, C, C],
    damage: 80,
    text: 'If Porygon-Z has no Rainbow Energy attached to it, Porygon-Z does 20 damage to itself and Porygon-Z is now Confused.'
  }];

  public set: string = 'TM';
  public setNumber: string = '7';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Porygon-Z';
  public fullName: string = 'Porygon-Z TM';

  public readonly DIMENASIONAL_TRANSFER_MARKER = 'DIMENASIONAL_TRANSFER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      if (!(player.discard.cards.some(card => card instanceof TrainerCard
        && card.trainerType === TrainerType.ITEM))) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (HAS_MARKER(this.DIMENASIONAL_TRANSFER_MARKER, player, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          const deckTop = new CardList();
          let cards: Card[] = [];
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK,
            player.discard,
            { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            cards = selected || [];

            if (cards.length > 0) {
              cards.forEach(card => {
                MOVE_CARD_TO(state, card, deckTop);
              });

              return store.prompt(state, new OrderCardsPrompt(
                player.id,
                GameMessage.CHOOSE_CARDS_ORDER,
                deckTop,
                { allowCancel: false },
              ), order => {
                if (order === null) {
                  return state;
                }

                deckTop.applyOrder(order);
                deckTop.moveToTopOfDestination(player.deck);

                SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
              });
            }

            return state;
          });
        }
      });

      ABILITY_USED(player, this);
      ADD_MARKER(this.DIMENASIONAL_TRANSFER_MARKER, player, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasRainbowEnergy = player.active.cards.some(card => card.name === 'Rainbow Energy');

      if (hasRainbowEnergy) {
        return state;
      } else {
        THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 20);
        ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, player, this);
      }
    }

    return state;
  }

}
