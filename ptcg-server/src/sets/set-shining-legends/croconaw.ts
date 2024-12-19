import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { EnergyMap, GameError, GameMessage, PowerType, State, StoreLike } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Croconaw extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Totodile';
  public cardType: CardType = CardType.WATER;
  public hp: number = 90;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Plunge',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokémon is on your Bench, you may move all Energy from your Active Pokémon to this Pokémon. If you do, switch it with your Active Pokémon.'
  }];

  public attacks = [
    {
      name: 'Bite',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      text: ''
    }
  ];

  public set: string = 'SLG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '19';
  public name: string = 'Croconaw';
  public fullName: string = 'Croconaw SLG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const source = player.active;

      if (player.active.cards[0] == this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      state = store.reduceEffect(state, checkProvidedEnergy);

      if (checkProvidedEnergy.energyMap.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      checkProvidedEnergy.energyMap.forEach((energyMap: EnergyMap) => {
        const card = energyMap.card;
        const index = player.active.cards.indexOf(card);
        if (index !== -1) {
          player.active.cards.splice(index, 1);
        }
      });
      source.cards.push(...checkProvidedEnergy.energyMap.map(energyMap => energyMap.card));
      const benchIndex = player.bench.indexOf(source);
      [player.active, player.bench[benchIndex]] = [player.bench[benchIndex], player.active];

    }
    return state;
  }
}