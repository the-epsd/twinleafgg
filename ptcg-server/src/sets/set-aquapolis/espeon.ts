import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { Card, CardTarget, ChooseEnergyPrompt, ChoosePokemonPrompt, GameError, GameLog, GameMessage, PlayerType, PowerType, SlotType } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Espeon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [];

  public powers = [{
    name: 'Energy Return',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'As often as you like during your turn (before your attack), choose an Energy card attached to 1 of your Pokémon and return it to your hand. This power can\'t be used if Espeon is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Damage Blast',
    cost: [P, C, C],
    damage: 30,
    damageCalculation: '+',
    text: 'Flip a number of coins equal to the number of damage counters on the Defending Pokémon. This attack does 30 damage plus 10 more damage for each heads.'
  }];

  public set: string = 'AQ';
  public name: string = 'Espeon';
  public fullName: string = 'Espeon AQ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      let isEnergyOnBench = false;
      let isEnergyOnActive = false;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      state = store.reduceEffect(state, checkProvidedEnergy);
      const activeEnergyCount = checkProvidedEnergy.energyMap.length;

      if (activeEnergyCount > 0) { isEnergyOnActive = true; }

      const blockedTo: CardTarget[] = [];
      if (!isEnergyOnActive) {
        const target: CardTarget = {
          player: PlayerType.BOTTOM_PLAYER,
          slot: SlotType.ACTIVE,
          index: 0
        };
        blockedTo.push(target);
      }

      player.bench.forEach((bench, index) => {
        if (bench.cards.length === 0) {
          return;
        }

        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, bench);
        state = store.reduceEffect(state, checkProvidedEnergy);
        const energyCount = checkProvidedEnergy.energyMap.length;

        if (energyCount > 0) {
          isEnergyOnBench = true;
        } else {
          const target: CardTarget = {
            player: PlayerType.BOTTOM_PLAYER,
            slot: SlotType.BENCH,
            index
          };
          blockedTo.push(target);
        }
      });

      if (!isEnergyOnActive && !isEnergyOnBench) { throw new GameError(GameMessage.CANNOT_USE_POWER); }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false, blocked: blockedTo }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }

        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, targets[0]);
        state = store.reduceEffect(state, checkProvidedEnergy);

        return store.prompt(state, new ChooseEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_HAND,
          checkProvidedEnergy.energyMap,
          [CardType.COLORLESS],
          { allowCancel: false }
        ), energy => {
          const cards: Card[] = (energy || []).map(e => e.card);
          store.log(state, GameLog.LOG_PLAYER_CHOOSES, { name: player.name, string: '' + cards[0].name });
          targets[0].moveCardsTo(cards, player.hand);
        });
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Count only energies that provide [W]
      const counterCount = effect.opponent.active.damage / 10;

      for (let i = 0; i < counterCount; i++) {
        COIN_FLIP_PROMPT(store, state, player, result => {
          if (result) {
            effect.damage += 10;
          }
        });
      }
    }

    return state;
  }

}
