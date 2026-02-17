import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition, CardTag } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';

export class ErikasDratini extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public tags = [CardTag.ERIKAS];
  public hp: number = 40;
  public weakness = [];
  public resistance = [{ type: P, value: -30 }];
  public retreat = [C];

  public powers = [{
    powerType: PowerType.POKEMON_POWER,
    name: 'Strange Barrier',
    text: 'Whenever an attack by a Basic Pokémon (including your own) does 20 or more damage to Erika\'s Dratini (after applying Weakness and Resistance), reduce that damage to 10. (Any other effects of attacks still happen.) This power stops working while Erika\'s Dratini is Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [{
    name: 'Tail Strike',
    cost: [C, C],
    damage: 10,
    text: 'Flip a coin. If heads, this attack does 10 damage plus 20 more damage; if tails, this attack does 10 damage.'
  }];

  public set: string = 'G1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Erika\'s Dratini';
  public fullName: string = 'Erika\'s Dratini G1';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      // Check if this is Erika's Dratini being targeted
      const targetPokemon = effect.target.getPokemonCard();
      if (targetPokemon === this) {
        // Check if the source is a Basic Pokémon
        const sourcePokemon = effect.source.getPokemonCard();
        if (sourcePokemon && sourcePokemon.stage === Stage.BASIC) {
          // Check if Erika's Dratini has no special conditions that would disable the ability
          const hasDisablingCondition = effect.target.specialConditions.includes(SpecialCondition.ASLEEP) ||
            effect.target.specialConditions.includes(SpecialCondition.CONFUSED) ||
            effect.target.specialConditions.includes(SpecialCondition.PARALYZED);

          if (!hasDisablingCondition && effect.damage >= 20) {
            // Reduce damage to 10
            effect.damage = 10;
          }
        }
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const damage = effect.damage;

      const coinFlipEffect = new CoinFlipEffect(player, (result: boolean) => {
        if (result) {
          // Heads: 10 + 20 = 30 damage
          effect.damage = damage + 20;
        } else {
          // Tails: 10 damage
          effect.damage = damage;
        }
      });
      store.reduceEffect(state, coinFlipEffect);
    }
    return state;
  }
}
