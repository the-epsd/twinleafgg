import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, Card, TrainerCard, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { MarkerConstants } from '../../game/store/markers/marker-constants';

export class Cofagrigus extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Yamask';
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness = [{ type: D }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Chuck',
      cost: [C, C],
      damage: 40,
      damageCalculation: 'x',
      text: 'Discard as many Pokémon Tool cards as you like from your hand. This attack does 40 damage times the number of cards you discarded.'
    },
    {
      name: 'Lock Up',
      cost: [P, P],
      damage: 40,
      text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '52';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cofagrigus';
  public fullName: string = 'Cofagrigus DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Chuck - discard Tool cards from hand for damage
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Find Tool cards in hand
      const toolCards = player.hand.cards.filter(card =>
        card instanceof TrainerCard && card.trainerType === TrainerType.TOOL
      );

      // If no Tool cards, do 0 damage
      if (toolCards.length === 0) {
        effect.damage = 0;
        return state;
      }

      // Let player choose how many Tool cards to discard
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.TRAINER, trainerType: TrainerType.TOOL },
        { min: 0, max: toolCards.length, allowCancel: false }
      ), (selected: Card[]) => {
        const cards = selected || [];

        // Discard the selected cards
        cards.forEach(card => {
          player.hand.moveCardTo(card, player.discard);
        });

        // Calculate damage: 40 x number of cards discarded
        effect.damage = 40 * cards.length;
      });
    }

    // Lock Up - prevent retreat
    if (WAS_ATTACK_USED(effect, 1, this)) {
      BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    return state;
  }
}
