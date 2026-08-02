import { PokemonCard, Stage, CardTag, CardType, PowerType, StoreLike, State, GameError, GameMessage, SuperType, EnergyType } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_POWER_USED, HAS_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, ADD_MARKER, ABILITY_USED, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED, THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN } from "../../../game/store/prefabs/prefabs";

export class Aerodactyl extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Mysterious Fossil';
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public powers = [{
    name: 'Primal Light',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may search your deck for a basic Energy card, show it to your opponent, and put it into your hand. Shuffle your deck afterward. This power can\'t be used if Aerodactyl is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Granite Head',
    cost: [R, C],
    damage: 30,
    text: 'During your opponent\'s next turn, any damage done to Aerodactyl by attacks is reduced by 10 (after applying Weakness and Resistance).'
  }];

  public set: string = 'HP';
  public setNumber: string = '35';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Aerodactyl';
  public fullName: string = 'Aerodactyl HP';

  public readonly PRIMAL_LIGHT_MARKER = 'PRIMAL_LIGHT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (HAS_MARKER(this.PRIMAL_LIGHT_MARKER, effect.player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      ADD_MARKER(this.PRIMAL_LIGHT_MARKER, effect.player, this);
      ABILITY_USED(player, this);

      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, { superType: SuperType.ENERGY, energyType: EnergyType.BASIC }, { min: 0, max: 1, allowCancel: false }, this.powers[0]);
    }


    if (WAS_ATTACK_USED(effect, 0, this)) {
      return THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, 10);
    }

    return state;
  }
} 