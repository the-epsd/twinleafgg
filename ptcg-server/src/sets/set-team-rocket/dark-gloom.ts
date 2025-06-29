import { PokemonCard, Stage, StoreLike, State, StateUtils, CardTag, GameError, GameMessage } from '../../game';
import { PowerType } from '../../game';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, ADD_CONFUSION_TO_PLAYER_ACTIVE, ADD_MARKER, BLOCK_IF_ASLEEP_CONFUSED_PARALYZED, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../game/store/prefabs/attack-effects';

export class DarkGloom extends PokemonCard {
  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Oddish';
  public tags = [CardTag.DARK];
  public cardType = G;
  public hp = 50;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Pollen Stench',
    powerType: PowerType.POKEMON_POWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may flip a coin. If heads, the Defending Pokémon is now Confused; if tails, your Active Pokémon is now Confused. This power can\'t be used if Dark Gloom is Asleep, Confused, or Paralyzed.'
  }];

  public attacks: Attack[] = [
    {
      name: 'Poisonpowder',
      cost: [G, G],
      damage: 10,
      text: 'The Defending Pokémon is now Poisoned.'
    },
  ];

  public set = 'TR';
  public setNumber: string = '36';
  public cardImage: string = 'assets/cardback.png';
  public name = 'Dark Gloom';
  public fullName = 'Dark Gloom TR';

  public readonly POLLEN_STENCH_MARKER = 'POLLEN_STENCH_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (HAS_MARKER(this.POLLEN_STENCH_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_ASLEEP_CONFUSED_PARALYZED(player, this);
      ADD_MARKER(this.POLLEN_STENCH_MARKER, player, this);
      ABILITY_USED(player, this);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, opponent, this);
        } else {
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, player, this);
        }
      });
    }
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.POLLEN_STENCH_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }
    return state;
  }

}
