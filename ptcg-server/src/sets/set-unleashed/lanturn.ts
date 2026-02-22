import { GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Lanturn extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Chinchou';
  public cardType: CardType = L;
  public hp: number = 110;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Underwater Dive',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may use this power. Lanturn\'s type is [W] until the end of your turn. This power can\'t be used if Lanturn is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Underwater Dive',
    cost: [L, C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'Does 40 damage plus 10 more damage for each Energy attached to all of your Pokémon.'
  }];

  public set: string = 'UL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';
  public name: string = 'Lanturn';
  public fullName: string = 'Lanturn UL';

  public readonly UNDERWATER_DIVE_MARKER = 'UNDERWATER_DIVE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.UNDERWATER_DIVE_MARKER, this);

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      if (HAS_MARKER(this.UNDERWATER_DIVE_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      ABILITY_USED(player, this);
      ADD_MARKER(this.UNDERWATER_DIVE_MARKER, player, this);
    }

    if (effect instanceof CheckPokemonTypeEffect && effect.target.getPokemonCard() === this) {
      const player = StateUtils.findOwner(state, effect.target);

      if (HAS_MARKER(this.UNDERWATER_DIVE_MARKER, player, this)) {
        effect.cardTypes = [CardType.WATER];
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let energies = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        checkProvidedEnergyEffect.energyMap.forEach(energy => {
          energies += energy.provides.length;
        });
      });

      effect.damage += energies * 10;
    }

    return state;
  }
}