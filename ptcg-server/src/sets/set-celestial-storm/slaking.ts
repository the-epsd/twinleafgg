import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils, GameError, GameMessage, PokemonCardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Slaking extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Vigoroth';
  public cardType: CardType = C;
  public hp: number = 160;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Lazy',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is your Active Pokémon, your opponent\'s Pokémon in play have no Abilities, except for Lazy.'
  }];

  public attacks = [{
    name: 'Critical Move',
    cost: [C, C, C],
    damage: 160,
    text: 'Discard an Energy from this Pokémon. It can\'t attack during your next turn.'
  }];

  public set: string = 'CES';
  public setNumber: string = '115';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Slaking';
  public fullName: string = 'Slaking CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonPowersEffect) {
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      // Slaking is not active Pokemon
      if (owner.active.getPokemonCard() !== this) {
        return state;
      }

      // Only filter opponent's Pokemon abilities
      const targetCardList = StateUtils.findCardList(state, effect.target);
      if (!(targetCardList instanceof PokemonCardList)) {
        return state;
      }
      const targetOwner = StateUtils.findOwner(state, targetCardList);
      if (targetOwner === owner) {
        return state;
      }

      // Filter out all abilities except Lazy
      effect.powers = effect.powers.filter(power =>
        power.powerType !== PowerType.ABILITY || power.name === 'Lazy'
      );
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      // Slaking is not active Pokemon
      if (player.active.getPokemonCard() !== this && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      if (owner === player) {
        return state;
      }

      //Try reducing ability for each player  
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        if (!effect.power.exemptFromAbilityLock) {
          throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
        }
        return state;
      }

    }

    // Critical Move
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
      player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}