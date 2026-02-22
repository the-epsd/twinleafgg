import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PowerType, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, DRAW_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Swampert extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Marshtomp';
  public cardType: CardType = F;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public powers = [{
    name: 'Echo Draw',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may draw a card. This power can\'t be used if Swampert is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Rock Hurl',
    cost: [F, C, C],
    damage: 60,
    text: 'This attack\'s damage isn\'t affected by Resistance.'
  }];

  public set: string = 'CG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Swampert';
  public fullName: string = 'Swampert CG';

  public readonly ECHO_DRAW_MARKER = 'ECHO_DRAW_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      if (player.marker.hasMarker(this.ECHO_DRAW_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      DRAW_CARDS(player, 1);

      ABILITY_USED(player, this);
      ADD_MARKER(this.ECHO_DRAW_MARKER, player, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.ignoreResistance = true;
    }

    return state;
  }
}
