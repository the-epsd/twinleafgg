import { GameError, GameMessage, Power, PowerType, State, StoreLike } from '../../game';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ABILITY_USED, ADD_MARKER, HAS_MARKER, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Ribombee extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Cutiefly';
  public cardType: CardType = Y;
  public hp: number = 70;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C];

  public powers: Power[] = [{
    name: 'Honey Gather',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may search your deck for up to 2 basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.',
  }];

  public attacks = [{
    name: 'Pollen Shot',
    cost: [C],
    damage: 20,
    text: ''
  },];

  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public name: string = 'Ribombee';
  public fullName: string = 'Ribombee BUS';

  public readonly HONEY_GATHER_MARKER = 'HONEY_GATHER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Honey Gather
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (HAS_MARKER(this.HONEY_GATHER_MARKER, effect.player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, { superType: SuperType.ENERGY, energyType: EnergyType.BASIC }, { min: 0, max: 2 });
      ADD_MARKER(this.HONEY_GATHER_MARKER, effect.player, this);
      ABILITY_USED(player, this);
    }
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.HONEY_GATHER_MARKER, this);
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this && HAS_MARKER(this.HONEY_GATHER_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.HONEY_GATHER_MARKER, effect.player, this);
    }

    return state;
  }
}
