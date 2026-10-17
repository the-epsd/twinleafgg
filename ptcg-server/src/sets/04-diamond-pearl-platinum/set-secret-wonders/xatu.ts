import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PokemonCardList, PowerType, SelectPrompt, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { ABILITY_USED, DAMAGE_OPPONENT_POKEMON, IS_POKEPOWER_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Xatu extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Natu';
  public hp: number = 80;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Psychic Shift',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, if Xatu is on your Bench, you may choose 1 Special Condition from 1 of your Active Pokémon and remove that Special Condition. Then, 1 of the Defending Pokémon is now affected by that Special Condition that you chose.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Energy Singe',
    cost: [P, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage plus 10 more damage for each Energy attached to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Xatu';
  public fullName: string = 'Xatu SW';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Psychic Shift
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      if (cardList === player.active) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.active.specialConditions.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      const specialConditions = [...player.active.specialConditions];
      const applyShift = (condition: SpecialCondition) => {
        player.active.removeSpecialCondition(condition);
        opponent.active.addSpecialCondition(condition);
      };

      if (specialConditions.length === 1) {
        applyShift(specialConditions[0]);
        return state;
      }

      const options = specialConditions.map(sc => SpecialCondition[sc]);
      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_SPECIAL_CONDITION,
        options,
        { allowCancel: false }
      ), choice => {
        if (choice !== null && choice >= 0 && choice < specialConditions.length) {
          applyShift(specialConditions[choice]);
        }
      });
    }

    // Energy Singe
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        if (targets.length === 0) {
          return;
        }

        const checkProvidedEnergy = new CheckProvidedEnergyEffect(opponent, targets[0]);
        store.reduceEffect(state, checkProvidedEnergy);
        const energyCount = checkProvidedEnergy.energyMap.reduce(
          (sum, em) => sum + em.provides.length,
          0,
        );
        const damage = 20 + (10 * energyCount);
        DAMAGE_OPPONENT_POKEMON(store, state, effect, damage, targets);
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
