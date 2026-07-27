import { GameMessage } from '../../../game/game-message';
import { CardType, Stage, CardTag } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { Effect } from '../../../game/store/effects/effect';
import { StateUtils } from '../../../game/store/state-utils';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE } from '../../../game/store/prefabs/attack-effects';
import {
  CAN_APPLY_LOCK_TO_TARGET,
  CAN_APPLY_LOCKER_ABILITY,
  HANDLE_ABILITY_BLOCK,
  IS_ABILITY_LOCKER_ACTIVE,
  POKEPOWER_TYPES,
} from '../../../game/store/prefabs/ability-lock';

export class Medichamex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  protected _tags = [CardTag.POKEMON_ex];
  public cardType: CardType = F;
  public hp: number = 110;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [
    {
      name: 'Wise Aura',
      powerType: PowerType.ABILITY,
      text: "As long as Medicham ex is your Active Pokémon, each Pokémon (excluding Pokémon-ex) (both yours and your opponent's) can't use any Poké-Powers.",
    },
  ];

  public attacks = [
    {
      name: 'Pure Power',
      cost: [C, C],
      damage: 0,
      text: "Put 3 damage counters on your opponent's Pokémon in any way you like.",
    },
    {
      name: 'Sky Kick',
      cost: [F, C, C],
      damage: 60,
      damageCalculation: '+',
      text: 'If the Defending Pokémon has Fighting Resistance, this attack does 60 damage plus 40 more damage.',
    },
  ];

  public set: string = 'EM';
  public setNumber: string = '95';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Medicham ex';
  public fullName: string = 'Medicham ex EM';
  public evolvesFrom: string = 'Meditite';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    HANDLE_ABILITY_BLOCK(
      effect,
      ({ player, card }) => {
        if (!IS_ABILITY_LOCKER_ACTIVE(state, player, this)) {
          return false;
        }
        if (card.hasTag(CardTag.POKEMON_ex)) {
          return false;
        }

        const opponent = StateUtils.getOpponent(state, player);
        const lockerOwner = player.active.getPokemonCard() === this ? player : opponent;
        if (!CAN_APPLY_LOCKER_ABILITY(store, state, lockerOwner, this, this.powers[0])) {
          return false;
        }
        return CAN_APPLY_LOCK_TO_TARGET(store, state, lockerOwner, this, this.powers[0], card);
      },
      {
        powerTypes: POKEPOWER_TYPES,
        error: GameMessage.BLOCKED_BY_ABILITY,
      },
    );

    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(3, store, state, effect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      const defendingPokemon = opponent.active.getPokemonCard();

      if (defendingPokemon && defendingPokemon.resistance) {
        const fightingResistance = defendingPokemon.resistance.find(
          (r) => r.type === CardType.FIGHTING,
        );
        if (fightingResistance) {
          effect.damage += 40;
        }
      }
    }
    return state;
  }
}
