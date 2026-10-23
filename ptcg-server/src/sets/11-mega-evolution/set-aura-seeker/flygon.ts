import { CardType, ChooseCardsPrompt, GameMessage, PokemonCard, Stage, State, SuperType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { StoreLike } from '../../../game/store/store-like';

export class Flygon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Vibrava';
  public hp: number = 150;
  public cardType: CardType[] = [N];
  public weakness = [];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Desert Wind',
    cost: [G, F],
    damage: 90,
    text: 'You may choose 2 Energy attached to your opponent\'s Active Pokémon and shuffle them into your opponent\'s deck.'
  },
  {
    name: 'Speed Dive',
    cost: [G, F, C],
    damage: 150,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'Flygon';
  public fullName: string = 'Flygon FLO';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Desert Wind
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      const energyCount = opponent.active.energies.cards.length;

      if (energyCount === 0) {
        return state;
      }

      return CONFIRMATION_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }

        const max = Math.min(2, opponent.active.energies.cards.length);
        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          opponent.active,
          { superType: SuperType.ENERGY },
          { min: 0, max, allowCancel: true }
        ), selected => {
          const cards = selected || [];
          if (cards.length === 0) {
            return;
          }
          MOVE_CARDS(store, state, opponent.active, opponent.deck, { cards, sourceCard: this });
          SHUFFLE_DECK(store, state, opponent);
        });
      });
    }

    return state;
  }
}
