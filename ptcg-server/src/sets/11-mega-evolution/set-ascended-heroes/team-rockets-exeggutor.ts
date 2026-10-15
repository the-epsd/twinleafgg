import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class TeamRocketsExeggutor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Team Rocket\'s Exeggcute';
  public hp: number = 140;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Tri Kinesis',
    cost: [C, C],
    damage: 0,
    text: 'Flip 3 coins. If all of them are heads, Knock Out 1 of your opponent\'s Pokémon.'
  },
{
    name: 'Double-Edge',
    cost: [P, C, C],
    damage: 150,
    text: 'This Pokémon also does 30 damage to itself.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '78';
  public name: string = 'Team Rocket\'s Exeggutor';
  public fullName: string = 'Team Rocket\'s Exeggutor ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tri Kinesis
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.player, this);
      // TODO unmatched: "If all of them are heads, Knock Out 1 of your opponent's Pokemon."
    }

    // Double-Edge
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
    }

    return state;
  }
}
