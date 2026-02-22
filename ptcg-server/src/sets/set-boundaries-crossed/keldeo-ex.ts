import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, SlotType, PokemonCardList, GameError, GameMessage } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class KeldeoEx extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_EX];
  public cardType: CardType = W;
  public hp: number = 170;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public powers = [{
    name: 'Rush In',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokémon is on your Bench, you may switch this Pokémon with your Active Pokémon.'
  }];

  public attacks = [
    {
      name: 'Secret Sword',
      cost: [C, C, C],
      damage: 50,
      damageCalculation: '+',
      text: 'Does 20 more damage for each [W] Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'BCR';
  public setNumber: string = '49';
  public name: string = 'Keldeo-EX';
  public fullName: string = 'Keldeo EX BCR';
  public cardImage: string = 'assets/cardback.png';

  public readonly RUSH_IN_MARKER = 'RUSH_IN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.RUSH_IN_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      let bench: PokemonCardList | undefined;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card === this && target.slot === SlotType.BENCH) {
          bench = cardList;
        }
      });

      if (bench === undefined) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.RUSH_IN_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      player.marker.addMarker(this.RUSH_IN_MARKER, this);
      player.switchPokemon(bench);
      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.WATER || cardType === CardType.ANY;
        }).length;
      });
      effect.damage += energyCount * 20;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.RUSH_IN_MARKER, this)) {
      effect.player.marker.removeMarker(this.RUSH_IN_MARKER, this);
    }

    return state;
  }

}
