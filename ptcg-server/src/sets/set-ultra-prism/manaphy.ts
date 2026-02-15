import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, Card } from '../../game';
import { EnergyCard } from '../../game/store/card/energy-card';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';

export class Manaphy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Deep Currents',
      cost: [W],
      damage: 0,
      text: 'Shuffle 5 [W] Energy cards from your discard pile into your deck.'
    },
    {
      name: 'Water Pulse',
      cost: [W],
      damage: 20,
      text: 'Your opponent\'s Active Pokémon is now Asleep.'
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '42';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Manaphy';
  public fullName: string = 'Manaphy UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Deep Currents
    // Ref: AGENTS-patterns.md (energy from discard to deck)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const waterEnergyInDiscard = player.discard.cards.filter(c =>
        c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.provides.includes(CardType.WATER)
      ).length;

      if (waterEnergyInDiscard === 0) {
        return state;
      }

      const maxSelect = Math.min(5, waterEnergyInDiscard);

      // Discard is public, so selection is mandatory up to the available amount
      const blocked: number[] = [];
      player.discard.cards.forEach((card, index) => {
        if (!(card instanceof EnergyCard) || card.energyType !== EnergyType.BASIC || !card.provides.includes(CardType.WATER)) {
          blocked.push(index);
        }
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DECK,
        player.discard,
        { superType: SuperType.ENERGY },
        { min: maxSelect, max: maxSelect, allowCancel: false, blocked }
      ), (selected: Card[]) => {
        const cards = selected || [];
        cards.forEach(card => {
          player.discard.moveCardTo(card, player.deck);
        });
        return SHUFFLE_DECK(store, state, player);
      });
    }

    // Attack 2: Water Pulse
    // Ref: AGENTS-patterns.md (Asleep)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    return state;
  }
}
