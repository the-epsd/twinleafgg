import { PokemonCard, Stage, CardType, StoreLike, State, PowerType, GameError, BoardEffect } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

function* useNightGate(next: Function, store: StoreLike, state: State,
  effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const playerHasBench = player.bench.some(b => b.cards.length > 0);
  const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);

  if (playerHasBench === false) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  if (opponentHasBench === false) {
    return state;
  }

  if (playerHasBench && opponentHasBench) {
    // First, opponent switches
    return store.prompt(state, new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_SWITCH,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.BENCH],
      { allowCancel: false }
    ), results => {
      if (results && results.length > 0) {
        player.active.clearEffects();
        player.switchPokemon(results[0]);

        // Then player switches
        return store.prompt(state, new ChoosePokemonPrompt(
          opponent.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ), playerResults => {
          if (playerResults && playerResults.length > 0) {
            opponent.active.clearEffects();
            opponent.switchPokemon(playerResults[0]);
          }
          return state;
        });
      }
      return state;
    });
  }
}


export class Samurott extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Dewott';
  public cardType: CardType = W;
  public hp: number = 160;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public powers = [{
    name: 'Strong Currents',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may switch your Active Pokémon with 1 of your Benched Pokemon. If you do, your opponent switches their Active Pokemon with 1 of their Benched Pokemon.'
  }];

  public attacks = [{
    name: 'Energy Slash',
    cost: [W],
    damage: 30,
    damageCalculation: '+',
    text: 'This attack does 50 more damage for each Energy attached to this Pokemon.'
  }];

  public regulationMark = 'I';
  public set: string = 'WHT';
  public setNumber: string = '23';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Samurott';
  public fullName: string = 'Samurott SV11W';

  public readonly STRONG_CURRENTS_MARKER = 'STRONG_CURRENTS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Remove marker on end turn
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.STRONG_CURRENTS_MARKER, this)) {
      effect.player.marker.removeMarker(this.STRONG_CURRENTS_MARKER, this);
    }

    // Strong Currents ability
    if (WAS_POWER_USED(effect, 0, this)) {
      const generator = useNightGate(() => generator.next(), store, state, effect);
      const player = effect.player;
      if (player.marker.hasMarker(this.STRONG_CURRENTS_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      effect.player.marker.addMarker(this.STRONG_CURRENTS_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });
      return generator.next().value;
    }

    // Energy Slash attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = player.active;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
      store.reduceEffect(state, checkProvidedEnergy);

      const energyCount = checkProvidedEnergy.energyMap.length;
      effect.damage = 30 + (50 * energyCount);
    }
    return state;
  }
}
