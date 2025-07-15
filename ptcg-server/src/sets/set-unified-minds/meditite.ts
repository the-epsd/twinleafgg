import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { ADD_MARKER, BLOCK_EFFECT_IF_MARKER, REMOVE_MARKER_AT_END_OF_TURN, REPLACE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Meditite extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Spirited Headbutt',
    cost: [F],
    damage: 40,
    text: 'This Pokémon can\'t use Spirited Headbutt during your next turn.'
  }];

  public set: string = 'UNM';
  public name: string = 'Meditite';
  public fullName: string = 'Meditite UNM';
  public setNumber: string = '109';
  public cardImage: string = 'assets/cardback.png';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_2_MARKER, this);
    REPLACE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_MARKER, this.ATTACK_USED_2_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      BLOCK_EFFECT_IF_MARKER(this.ATTACK_USED_2_MARKER, effect.player, this);
      ADD_MARKER(this.ATTACK_USED_MARKER, effect.player, this);
    }

    return state;
  }
}