import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage, StateUtils } from '../../../game';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { Effect } from '../../../game/store/effects/effect';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import {
  WAS_ATTACK_USED,
  IS_ABILITY_BLOCKED,
  HEAL_X_DAMAGE_FROM_THIS_POKEMON,
  MOVE_CARDS,
  ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT,
} from '../../../game/store/prefabs/prefabs';

export class Jellicent extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Frillish';
  public cardType: CardType[] = [W];
  public hp: number = 110;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Cursed Body',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is your Active Pokémon and is damaged by an opponent\'s attack (even if this Pokémon is Knocked Out), discard an Energy attached to the Attacking Pokémon.'
  }];

  public attacks = [{
    name: 'Absorb Life',
    cost: [W, W, C],
    damage: 50,
    text: 'Heal 20 damage from this Pokémon.'
  }];

  public set: string = 'NVI';
  public setNumber: string = '31';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Jellicent';
  public fullName: string = 'Jellicent NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Cursed Body - discard energy when damaged
    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })) {
      const abilityOwner = StateUtils.findOwner(state, effect.target);
      const attackingPokemon = effect.source;

      if (IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      if (!attackingPokemon.energies.cards.some(c => c.superType === SuperType.ENERGY)) {
        return state;
      }

      if (!CAN_APPLY_ABILITY_TO_TARGET(
        store,
        state,
        abilityOwner,
        this.powers[0],
        this,
        attackingPokemon,
      )) {
        return state;
      }

      const attackerOwner = StateUtils.findOwner(state, attackingPokemon);
      return store.prompt(state, new ChooseCardsPrompt(
        abilityOwner,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        attackingPokemon,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false },
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          MOVE_CARDS(store, state, attackingPokemon, attackerOwner.discard, {
            cards,
            sourceCard: this,
            sourceEffect: this.powers[0],
          });
        }
      });
    }

    // Absorb Life - heal 20
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
    }

    return state;
  }
}
