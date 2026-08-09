import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from '../../game/store/prefabs/effect-of-attack-prefabs';

export class BlainesPonyta extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.BLAINES];
  public cardType: CardType = R;
  public hp: number = 40;
  public weakness = [{ type: W }];
  public retreat = [];

  public attacks = [{
    name: 'Agility',
    cost: [R, C],
    damage: 20,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all effects of attacks, including damage, done to Blaine\'s Ponyta.'
  }];

  public set: string = 'G1';
  public setNumber: string = '63';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Blaine\'s Ponyta';
  public fullName: string = 'Blaine\'s Ponyta G1';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
