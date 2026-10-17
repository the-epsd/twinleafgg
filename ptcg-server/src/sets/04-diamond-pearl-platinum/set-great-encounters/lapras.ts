import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, TrainerType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, EnergyCard, GameMessage, State, StateUtils, StoreLike, TrainerCard } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Lapras extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Carry In',
    cost: [W],
    damage: 0,
    text: 'Search your deck for a Pokémon Tool Card, a Supporter card, and a basic Energy card, show them to your opponent, and put them into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Wave Splash',
    cost: [W, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name: string = 'Lapras';
  public fullName: string = 'Lapras GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Carry In
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.deck.cards.length === 0) {
        return state;
      }

      let tools = 0;
      let supporters = 0;
      let basicEnergies = 0;
      const blocked: number[] = [];
      player.deck.cards.forEach((c, index) => {
        if (c instanceof TrainerCard && c.trainerType === TrainerType.TOOL) {
          tools++;
        } else if (c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER) {
          supporters++;
        } else if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC) {
          basicEnergies++;
        } else {
          blocked.push(index);
        }
      });

      const maxTools = Math.min(tools, 1);
      const maxSupporters = Math.min(supporters, 1);
      const maxEnergies = Math.min(basicEnergies, 1);
      const max = maxTools + maxSupporters + maxEnergies;
      if (max === 0) {
        return SHUFFLE_DECK(store, state, player);
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        {
          min: 0,
          max,
          allowCancel: true,
          blocked,
          maxTools,
          maxSupporters,
          maxEnergies,
          maxBasicEnergies: maxEnergies,
        }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
          MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: this });
        }
        SHUFFLE_DECK(store, state, player);
      });
    }

    return state;
  }
}
