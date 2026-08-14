import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from '../../game/store/prefabs/effect-of-attack-prefabs';

export class AurasLucario extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.AURAS];
  public cardType: CardType = M;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Iron Defense',
    cost: [M],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to Aura\'s Lucario during your opponent\'s next turn.'
  }, {
    name: 'Low Kick',
    cost: [F, C, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'PCGP';
  public setNumber: string = '75';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Aura\'s Lucario';
  public fullName: string = 'Aura\'s Lucario PCGP 75';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
