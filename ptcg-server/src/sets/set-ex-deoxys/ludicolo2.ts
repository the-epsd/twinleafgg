import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, CoinFlipPrompt, GameError, PowerType, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Ludicolo2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Lombre';
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public powers = [{
    name: 'Happy Dance',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may remove 1 damage counter from each of your Pokémon. You can\'t use more than 1 Happy Dance Poké-Power each turn. This power can\'t be used if Ludicolo is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Water Punch',
    cost: [C, C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'Flip a coin for each [W] Energy attached to Ludicolo. This attack does 40 damage plus 20 more damage for each heads.'
  }];

  public set: string = 'DX';
  public setNumber: string = '19';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ludicolo';
  public fullName: string = 'Ludicolo DX2';

  public readonly HAPPY_DANCE_MARKER = 'HAPPY_DANCE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Handle Happy Dance Poké-Power
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(this.HAPPY_DANCE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      player.marker.addMarker(this.HAPPY_DANCE_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        const healEffect = new HealEffect(player, cardList, 10);
        state = store.reduceEffect(state, healEffect);
      });
    }

    // Handle Water Punch attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      // Count Water energy
      let waterEnergyCount = 0;
      checkProvidedEnergy.energyMap.forEach(energy => {
        if (energy.provides.includes(CardType.WATER) || energy.provides.includes(CardType.ANY)) {
          waterEnergyCount++;
        }
      });

      // Flip coins equal to Water energy count
      let heads = 0;
      for (let i = 0; i < waterEnergyCount; i++) {
        state = store.prompt(state, new CoinFlipPrompt(
          player.id,
          GameMessage.FLIP_COIN
        ), result => {
          if (result) {
            heads++;
          }
          if (i === waterEnergyCount - 1) {
            effect.damage = 40 + (20 * heads);
          }
          return state;
        });
      }
    }

    return state;
  }
} 