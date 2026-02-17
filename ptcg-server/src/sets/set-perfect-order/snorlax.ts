import { PokemonCard, Stage, CardType, StoreLike, State, ChooseCardsPrompt, GameMessage, ShuffleDeckPrompt, EnergyType, SuperType, SpecialCondition } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

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
      let headsCount = 0;
      let gotTails = false;

      const flipUntilTails = (s: State): State => {
        if (gotTails) {
          // Got tails, now search for Basic Energy
          if (headsCount === 0 || player.deck.cards.length === 0) {
            return store.prompt(s, new ShuffleDeckPrompt(player.id), order => {
              player.deck.applyOrder(order);
            });
          }

          const basicEnergyInDeck = player.deck.cards.filter(card =>
            card.superType === SuperType.ENERGY && card.energyType === EnergyType.BASIC
          );

          if (basicEnergyInDeck.length === 0) {
            return store.prompt(s, new ShuffleDeckPrompt(player.id), order => {
              player.deck.applyOrder(order);
            });
          }

          const maxToAttach = Math.min(headsCount, basicEnergyInDeck.length);

          return store.prompt(s, new ChooseCardsPrompt(
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
            return store.prompt(s, new ShuffleDeckPrompt(player.id), order => {
              player.deck.applyOrder(order);
            });
          });
        }

        const coinFlipEffect = new CoinFlipEffect(player, (result: boolean) => {
          if (result === true) {
            // Heads - increment count and flip again
            headsCount++;
            flipUntilTails(s);
          } else {
            // Tails - proceed to search
            gotTails = true;
            flipUntilTails(s);
          }
        });

        return store.reduceEffect(s, coinFlipEffect);
      };

      return flipUntilTails(state);
    }

    // Collapse - Pokemon becomes Asleep
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.addSpecialCondition(SpecialCondition.ASLEEP);
    }

    return state;
  }
}
