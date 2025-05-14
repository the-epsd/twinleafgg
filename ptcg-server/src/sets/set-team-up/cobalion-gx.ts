import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType, PlayerType, GameError, GameMessage } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { ADD_MARKER, BLOCK_IF_GX_ATTACK_USED, HAS_MARKER, IS_ABILITY_BLOCKED, REMOVE_MARKER, THIS_ATTACK_DOES_X_MORE_DAMAGE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class CobalionGX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_GX];
  public cardType: CardType = M;
  public hp: number = 170;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Metal Symbol',
    powerType: PowerType.ABILITY,
    text: 'Each of your Pokémon that has any [M] Energy attached to it can\'t be affected by any Special Conditions. (Remove any Special Conditions affecting those Pokémon.)'
  }];

  public attacks = [
    {
      name: 'Dueling Saber',
      cost: [M, M],
      damage: 50,
      damageCalculation: '+',
      text: 'If there is any Stadium card in play, this attack does 60 more damage.'
    },
    {
      name: 'Iron Rule-GX',
      cost: [C],
      damage: 0,
      text: 'During your opponent\'s next turn, their Pokémon can\'t attack. (This includes Pokémon that come into play on that turn.) (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'TEU';
  public setNumber: string = '106';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cobalion-GX';
  public fullName: string = 'Cobalion-GX TEU';

  public readonly IRON_RULE_MARKER = 'IRON_RULE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        if (player.active.specialConditions.length === 0 || IS_ABILITY_BLOCKED(store, state, player, this)) {
          return;
        }

        let hasCobalionInPlay = false;
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (card === this) {
            hasCobalionInPlay = true;
          }
        });

        if (!hasCobalionInPlay) {
          return state;
        }

        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
        store.reduceEffect(state, checkProvidedEnergyEffect);

        const energyMap = checkProvidedEnergyEffect.energyMap;
        const hasMetalEnergy = StateUtils.checkEnoughEnergy(energyMap, [CardType.METAL]);

        if (hasMetalEnergy) {
          const conditions = player.active.specialConditions.slice();
          conditions.forEach(condition => {
            player.active.removeSpecialCondition(condition);
          });
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (StateUtils.getStadiumCard(state) !== undefined) {
        THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 60);
      }
      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      ADD_MARKER(this.IRON_RULE_MARKER, opponent, this);
    }

    if (effect instanceof AttackEffect && HAS_MARKER(this.IRON_RULE_MARKER, effect.player, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.IRON_RULE_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.IRON_RULE_MARKER, effect.player, this);
    }

    return state;
  }

}
