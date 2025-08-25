import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';

export class Nidoqueen extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Nidorina';
  public cardType: CardType = F;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public powers = [{
    name: 'Family Bonds',
    powerType: PowerType.POKEBODY,
    text: 'As long as Nidoqueen is in play, the Retreat Cost for Nidoran Female, Nidorina, Nidoran Male, Nidorino and Nidoking is 0.'
  }];

  public attacks = [
    {
      name: 'Toxic',
      cost: [G],
      damage: 0,
      text: 'The Defending Pokémon is now Poisoned. Put 2 damage counters instead of 1 on the Defending Pokémon between turns.'
    },
    {
      name: 'Power Lariat',
      cost: [F, C, C],
      damage: 40,
      damageCalculation: '+',
      text: 'Does 40 damage plus 10 more damage for each Evolved Pokémon you have in play.'
    }
  ];

  public set: string = 'RG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';
  public name: string = 'Nidoqueen';
  public fullName: string = 'Nidoqueen RG';

  public reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State {

    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      const active = effect.player.active.getPokemonCard();

      if (owner !== player || active === undefined) {
        return state;
      }

      let isNidoqueenInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isNidoqueenInPlay = true;
        }
      });

      if (!isNidoqueenInPlay) {
        return state;
      }

      if (!IS_POKEBODY_BLOCKED(store, state, player, this)
        && (active.name === 'Nidoran F'
          || active.name === 'Nidorina'
          || active.name === 'Nidoran M'
          || active.name === 'Nidorino'
          || active.name === 'Nidoking')) {
        effect.cost = [];
      }
      return state;
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this, 20);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let evolvedCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card) => {
        if (list.getPokemons().length > 1 && card.stage !== Stage.LEGEND && card.stage !== Stage.VUNION && card.stage !== Stage.LV_X) {
          evolvedCount++;
        }
      });

      effect.damage += 10 * evolvedCount;
    }

    return state;
  }
}
