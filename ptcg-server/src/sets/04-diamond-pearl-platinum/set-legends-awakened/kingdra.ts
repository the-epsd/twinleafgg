import { PokemonCard, Stage, CardType, StoreLike, State, ChooseCardsPrompt, GameMessage, SuperType, EnergyType, StateUtils } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from "../../../game/store/prefabs/attack-effects";
import { WAS_ATTACK_USED, MOVE_CARDS, CONFIRMATION_PROMPT, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK } from "../../../game/store/prefabs/prefabs";

export class Kingdra extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Seadra';
  public hp: number = 130;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: 30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Aqua Stream',
    cost: [],
    damage: 10,
    damageCalculation: 'x',
    text: 'Search your discard pile for as many [W] Energy cards as you like, show them to your opponent, and this attack does 10 damage for each Water Energy card you chose. Put those cards on top of your deck. Shuffle your deck afterward.'
  },
  {
    name: 'Dragon Pump',
    cost: [W],
    damage: 40,
    damageCalculation: '+',
    text: 'You may discard 2 cards from your hand. If you do, this attack does 40 damage plus 20 more damage and does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Kingdra';
  public fullName: string = 'Kingdra LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Aqua Stream
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const waterEnergyInDiscard = player.discard.cards.filter(
        (c) => c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC && c.name === 'Water Energy',
      );

      if (waterEnergyInDiscard.length === 0) {
        return state;
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DECK,
          player.discard,
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
          { allowCancel: false, min: 0, max: waterEnergyInDiscard.length },
        ),
        (cards) => {
          cards = cards || [];
          effect.damage = cards.length * 10;
          if (cards.length === 0) {
            return;
          }
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
          MOVE_CARDS(store, state, player.discard, player.deck, { cards, sourceCard: this, sourceEffect: this.attacks[0] });
          SHUFFLE_DECK(store, state, player);
        },
      );
    }

    // Dragon Pump
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (player.hand.cards.length < 2) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, (result) => {
        if (!result) {
          return;
        }
        state = store.prompt(
          state,
          new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            player.hand,
            {},
            { allowCancel: true, min: 2, max: 2 },
          ),
          (cards) => {
            cards = cards || [];
            if (cards.length !== 2) {
              return;
            }
            MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: this, sourceEffect: this.attacks[1] });
            effect.damage += 20;
            THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
          },
        );
      },
        GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK,
      );
      return state;
    }

    return state;
  }
}
