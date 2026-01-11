import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { DiscardEnergyPrompt } from '../../game/store/prompts/discard-energy-prompt';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Jolteonex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Eevee';
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public cardType: CardType = L;
  public hp: number = 260;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [{
    name: 'Flashing Spear',
    cost: [L, C],
    damage: 60,
    damageCalculation: '+',
    text: 'You may discard up to 2 Basic Energy from your Benched Pokémon. This attack does 90 more damage for each card discarded this way.'
  },
  {
    name: 'Dravite',
    cost: [R, W, L],
    damage: 280,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark = 'H';
  public set: string = 'PRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '30';
  public name: string = 'Jolteon ex';
  public fullName: string = 'Jolteon ex PRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasBenched = player.bench.some(b => b.cards.length > 0);

      if (!hasBenched) {
        return state;
      }

      state = store.prompt(state, new DiscardEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 0, max: 2, allowCancel: false }
      ), transfers => {

        if (transfers === null) {
          return state;
        }

        const baseDamage = 60;
        const additionalDamage = transfers.length * 90;
        effect.damage = baseDamage + additionalDamage;

        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = player.discard;
          source.moveCardTo(transfer.card, target);
        }

        return state;
      });
    }

    // Carnelian
    // Rampage Thunder
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }
}