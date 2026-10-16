import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { AttachEnergyPrompt, CardTarget, GameMessage, PlayerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { MOVE_CARDS, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Hippowdon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Hippopotas';
  public hp: number = 100;
  public cardType: CardType[] = [F];
  public weakness = [{ type: W, value: +20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Vacuum Sand',
    cost: [],
    damage: 20,
    text: 'Search your discard pile for a Fighting Energy card and attach it to Hippowdon.'
  },
  {
    name: 'Sand Impact',
    cost: [F, C, C],
    damage: 50,
    damageCalculation: '+',
    text: 'Flip a coin for each Fighting Energy attached to Hippowdon. This attack does 50 damage plus 20 more damage for each heads.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name: string = 'Hippowdon';
  public fullName: string = 'Hippowdon MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Vacuum Sand
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasFightingEnergy = player.discard.cards.some(
        c => c.superType === SuperType.ENERGY && c.name === 'Fighting Energy',
      );
      if (!hasFightingEnergy) {
        return state;
      }

      const hippowdonSlot = StateUtils.findPokemonSlot(state, this);
      if (!hippowdonSlot) {
        return state;
      }

      let hippowdonTarget: CardTarget | undefined;
      const blockedTo: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (list === hippowdonSlot && card === this) {
          hippowdonTarget = target;
        } else {
          blockedTo.push(target);
        }
      });

      if (!hippowdonTarget) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [hippowdonTarget.slot],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fighting Energy' },
        { min: 0, max: 1, allowCancel: false, sameTarget: true, blockedTo },
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.discard, target, { cards: [transfer.card], sourceCard: this });
        }
      });
    }

    // Sand Impact
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergy);
      const fightingCount = checkProvidedEnergy.energyMap.filter(
        e => e.provides.includes(CardType.FIGHTING) || e.provides.includes(CardType.ANY),
      ).length;

      if (fightingCount === 0) {
        return state;
      }

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, fightingCount, results => {
        effect.damage += 20 * results.filter(r => r).length;
      });
    }

    return state;
  }
}
