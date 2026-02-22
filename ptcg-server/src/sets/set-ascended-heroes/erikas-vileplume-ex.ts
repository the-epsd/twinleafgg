import { PokemonCard, Stage, CardTag, CardType, PowerType, StoreLike, State, GameError, GameMessage, PlayerType, StateUtils, SpecialCondition } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ABILITY_USED, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class ErikasVileplumeex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Erika\'s Gloom';
  public tags = [CardTag.POKEMON_ex, CardTag.ERIKAS];
  public cardType: CardType = G;
  public hp: number = 310;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C];

  public powers = [{
    name: 'Lovely Fragrance',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may use this Ability. Heal 30 damage from each of your Pokémon.'
  }];

  public attacks = [{
    name: 'Bloom Powder',
    cost: [G, G, C],
    damage: 160,
    text: 'Your opponent\'s Active Pokemon is now Poisoned and Asleep.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Erika\'s Vileplume ex';
  public fullName: string = 'Erika\'s Vileplume ex MC';

  public readonly ENVIOUS_SCENT_MARKER = 'ENVIOUS_SCENT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Envious Scent ability
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(this.ENVIOUS_SCENT_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      // Heal 30 damage from each of your Pokemon
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.damage > 0) {
          const healEffect = new HealEffect(player, cardList, 30);
          store.reduceEffect(state, healEffect);
        }
      });

      player.marker.addMarker(this.ENVIOUS_SCENT_MARKER, this);
      ABILITY_USED(player, this);
    }

    // Powder Bloom attack - apply Poisoned and Asleep
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [
        SpecialCondition.POISONED,
        SpecialCondition.ASLEEP
      ]);
      specialConditionEffect.target = opponent.active;
      return store.reduceEffect(state, specialConditionEffect);
    }

    // Reset marker at end of turn
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ENVIOUS_SCENT_MARKER, this)) {
      effect.player.marker.removeMarker(this.ENVIOUS_SCENT_MARKER, this);
    }

    return state;
  }
}