import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {
  WAS_ATTACK_USED, HEAL_X_DAMAGE_FROM_THIS_POKEMON
} from '../../game/store/prefabs/prefabs';
import { FLIP_UNTIL_TAILS_AND_COUNT_HEADS } from '../../game/store/prefabs/prefabs';

export class Muk extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Grimer';
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Poison Suction',
      cost: [P, C, C],
      damage: 60,
      text: 'If the Defending Pokémon is Poisoned, heal 60 damage from this Pokémon.'
    },
    {
      name: 'Sludge Crash',
      cost: [P, P, C, C],
      damage: 80,
      text: 'Flip a coin until you get tails. For each heads, discard an Energy attached to the Defending Pokémon.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '46';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Muk';
  public fullName: string = 'Muk PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Poison Suction
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
        HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 60);
      }
    }

    // Attack 2: Sludge Crash
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, headsCount => {
        // Discard up to headsCount energy from defending
        const energyCount = opponent.active.cards.filter(c => c.superType === SuperType.ENERGY).length;
        const toDiscard = Math.min(headsCount, energyCount);

        if (toDiscard <= 0) {
          return;
        }

        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          opponent.active,
          { superType: SuperType.ENERGY },
          { min: toDiscard, max: toDiscard, allowCancel: false }
        ), selected => {
          if (selected && selected.length > 0) {
            selected.forEach(card => {
              opponent.active.moveCardTo(card, opponent.discard);
            });
          }
        });
      });
    }

    return state;
  }
}
