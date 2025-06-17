import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { EnergyCard, GameError, GameMessage, PlayerType, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, DISCARD_ALL_ENERGY_FROM_POKEMON, HAS_MARKER, MULTIPLE_COIN_FLIPS_PROMPT, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Charizard extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Charmeleon';
  public cardType: CardType = R;
  public hp: number = 120;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Burning Energy',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may turn all basic Energy attached to all of your Pokémon into [R] Energy for the rest of the turn. This power can\'t be used if Charizard is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Scorching Whirlwind',
    cost: [R, R, R, R],
    damage: 120,
    text: 'Flip 2 coins. If 1 of them is tails, discard 2 Energy cards attached to Charizard. If both are tails, discard all Energy cards attached to Charizard.'
  }];

  public set: string = 'EX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Charizard';
  public fullName: string = 'Charizard EX';

  public readonly BURNING_ENERGY_MARKER = 'BURNING_ENERGY_MARKER';
  public readonly BURNING_ENERGY_USED_MARKER = 'BURNING_ENERGY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (HAS_MARKER(this.BURNING_ENERGY_USED_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      ADD_MARKER(this.BURNING_ENERGY_USED_MARKER, player, this);
      ABILITY_USED(player, this);

      // Add the marker to all basic Energy cards attached to Pokémon
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        cardList.cards.forEach(c => {
          if (c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC) {
            ADD_MARKER(this.BURNING_ENERGY_MARKER, c, this);
          }
        });
      });
    }

    // Change what affected Energy cards provide
    if (effect instanceof CheckProvidedEnergyEffect) {
      effect.source.cards.forEach(c => {
        if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC && !effect.energyMap.some(e => e.card === c)) {
          if (HAS_MARKER(this.BURNING_ENERGY_MARKER, c, this)) {
            effect.energyMap.push({ card: c, provides: [CardType.FIRE] });
          }
        }
      });
      return state;
    }

    // Remove the markers at the end of the turn
    if (effect instanceof EndTurnEffect) {
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        cardList.cards.forEach(c => {
          if (HAS_MARKER(this.BURNING_ENERGY_MARKER, c, this)) {
            REMOVE_MARKER(this.BURNING_ENERGY_MARKER, c, this);
          }
        });
      });
    }
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.BURNING_ENERGY_USED_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads: number = 0;
        results.forEach(r => {
          if (r) heads++;
        });

        if (!heads) {
          DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
        }

        if (heads === 1) {
          DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
        }
      });
    }

    return state;
  }
}