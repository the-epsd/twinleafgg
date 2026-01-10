import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, TrainerCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class OriginFormePalkiaV extends PokemonCard {
  public tags = [CardTag.POKEMON_V];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 220;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Rule the Region',
    cost: [W],
    damage: 0,
    text: 'Search your deck for a Stadium card, reveal it, and put it into your hand. Then, shuffle your deck.'
  },
  {
    name: 'Hydro Break',
    cost: [W, W, C],
    damage: 200,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Origin Forme Palkia V';
  public fullName: string = 'Origin Forme Palkia V ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;

      const blocked: number[] = [];
      player.deck.cards.forEach((c, index) => {
        if (!(c instanceof TrainerCard && c.trainerType === TrainerType.STADIUM)) {
          blocked.push(index);
        }
      });

      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, { superType: SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false, blocked }, this.attacks[0]);
    }

    // Hydro Break
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}