import { PokemonCard, Stage, CardType, StoreLike, State, ChooseCardsPrompt, GameMessage, ShuffleDeckPrompt, EnergyType, SuperType, SpecialCondition } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, FLIP_UNTIL_TAILS_AND_COUNT_HEADS } from '../../game/store/prefabs/prefabs';

export class Snorlax extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 160;
  public weakness = [{ type: F }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Big Eater',
    cost: [C],
    damage: 0,
    text: 'Flip a coin until you get tails. For each heads, you may search your deck for a Basic Energy and attach it to this Pokemon. Then, shuffle your deck.'
  },
  {
    name: 'Collapse',
    cost: [C, C, C, C],
    damage: 160,
    text: 'This Pokemon is now Asleep.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '62';
  public name: string = 'Snorlax';
  public fullName: string = 'Snorlax M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Big Eater - flip coins until tails, search for Basic Energy for each heads
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const stateForCallback = state;

      return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, headsCount => {
        if (headsCount === 0 || player.deck.cards.length === 0) {
          store.prompt(stateForCallback, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
          });
          return;
        }

        const basicEnergyInDeck = player.deck.cards.filter(card =>
          card.superType === SuperType.ENERGY && card.energyType === EnergyType.BASIC
        );

        if (basicEnergyInDeck.length === 0) {
          store.prompt(stateForCallback, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
          });
          return;
        }

        const maxToAttach = Math.min(headsCount, basicEnergyInDeck.length);

        store.prompt(stateForCallback, new ChooseCardsPrompt(
          player,
          GameMessage.ATTACH_ENERGY_CARDS,
          player.deck,
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { min: 0, max: maxToAttach, allowCancel: false }
        ), selected => {
          const cards = selected || [];
          if (cards.length > 0) {
            for (const card of cards) {
              player.deck.moveCardTo(card, player.active);
            }
          }
          store.prompt(stateForCallback, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
          });
        });
      });
    }

    // Collapse - Pokemon becomes Asleep
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.addSpecialCondition(SpecialCondition.ASLEEP);
    }

    return state;
  }
}
