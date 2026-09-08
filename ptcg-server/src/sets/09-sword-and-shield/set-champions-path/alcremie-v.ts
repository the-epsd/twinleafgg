import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealTargetEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_CANNOT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class AlcremieV extends PokemonCard {
  protected _tags = [CardTag.POKEMON_V];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 170;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Sugary Sprinkles',
    cost: [P],
    damage: 0,
    text: 'Heal 30 damage from each of your Benched Pokémon.'
  }, {
    name: 'Sweet Splash',
    cost: [P, C, C],
    damage: 100,
    text: 'If the Defending Pokémon is a Basic Pokémon, it can\'t attack during your opponent\'s next turn.'
  }];

  public regulationMark: string = 'D';
  public set: string = 'CPA';
  public setNumber: string = '22';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Alcremie V';
  public fullName: string = 'Alcremie V CPA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sugary Sprinkles
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.bench.forEach(benched => {
        if (benched.cards.length > 0 && benched.damage > 0) {
          const healEffect = new HealTargetEffect(effect, 30);
          healEffect.target = benched;
          store.reduceEffect(state, healEffect);
        }
      });
    }

    // Sweet Splash
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.getPokemonCard()?.stage === Stage.BASIC) {
        return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
      }
    }

    return state;
  }
}
