import { PokemonCard, Stage, CardTag, CardType, StoreLike, State } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MegaEmboarex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Pignite';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = R;
  public hp: number = 380;
  public weakness = [{ type: W }];
  public resistance = [];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Crimson Blast',
    cost: [R, R, C],
    damage: 320,
    text: 'This Pokémon also does 60 damage to itself.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';
  public name: string = 'Mega Emboar ex';
  public fullName: string = 'Mega Emboar ex MC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const dealDamage = new DealDamageEffect(effect, 60);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    return state;
  }
}