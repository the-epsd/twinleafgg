import { CardTag, CardType, ChooseCardsPrompt, GameMessage, PokemonCard, Stage, State, StateUtils, StoreLike, SuperType, TrainerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class GalarianMrRimeV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.POKEMON_V, CardTag.FUSION_STRIKE];
  public hp: number = 210;
  public cardType: CardType[] = [W];
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Surprising Hand',
    cost: [W],
    damage: 0,
    text: 'Search your deck for up to 3 Item cards, reveal them, and put them into your hand. Then, shuffle your deck.',
  },
  {
    name: 'Customized Cane',
    cost: [W, W, C],
    damage: 90,
    damageCalculation: '+',
    text: 'If this Pokémon has a Pokémon Tool attached, this attack does 90 more damage.',
  }];

  public regulationMark: string = 'E';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Galarian Mr. Rime V';
  public fullName: string = 'Galarian Mr. Rime V ASR 49';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Surprising Hand
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.deck,
          { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
          { min: 0, max: 3, allowCancel: false },
        ),
        (selected) => {
          const cards = selected || [];

          if (cards.length === 0) {
            SHUFFLE_DECK(store, state, player);
            return;
          }

          MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: this });
          SHOW_CARDS_TO_PLAYER(store, state, StateUtils.getOpponent(state, player), cards);
          SHUFFLE_DECK(store, state, player);
        },
      );
    }

    // Customized Cane
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.player.active.tools.length > 0) {
        effect.damage += 90;
      }
    }

    return state;
  }
}
