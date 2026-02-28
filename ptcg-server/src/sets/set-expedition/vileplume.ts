import { GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ABILITY_USED, ADD_CONFUSION_TO_PLAYER_ACTIVE, ADD_POISON_TO_PLAYER_ACTIVE, BLOCK_IF_HAS_SPECIAL_CONDITION, COIN_FLIP_PROMPT, HAS_MARKER, MULTIPLE_COIN_FLIPS_PROMPT, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Vileplume extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Gloom';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Poison Pollen',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may flip a coin. If heads, the Defending Pokémon is now Poisoned. This power can\'t be used if Vileplume is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Petal Dance',
    cost: [G, C],
    damage: 30,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 30 damage times the number of heads. Vileplume is now Confused.'
  }];

  public set: string = 'EX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Vileplume';
  public fullName: string = 'Vileplume EX';

  public readonly POISON_POLLEN_MARKER = 'POISON_POLLEN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (HAS_MARKER(this.POISON_POLLEN_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      player.marker.addMarker(this.POISON_POLLEN_MARKER, this);
      ABILITY_USED(player, this);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          const opponent = StateUtils.getOpponent(state, player);
          ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.POISON_POLLEN_MARKER, this);
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.POISON_POLLEN_MARKER, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 30 * heads;
        ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.player, this);
      });
    }

    return state;
  }
}