import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PlayerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, THIS_ATTACK_DOES_X_MORE_DAMAGE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class BlainesRapidash extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Blaine\'s Ponyta';
  public tags = [CardTag.BLAINES];
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [];

  public attacks = [{
    name: 'Fire Mane',
    cost: [R],
    damage: 20,
    text: ''
  },
  {
    name: 'Stamp',
    cost: [R, C, C],
    damage: 30,
    text: 'Flip a coin. If heads, this attack does 30 damage plus 10 more damage (to the Defending Pokémon) and 10 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) If tails, this attack does 30 damage (to the Defending Pokémon).'
  }];

  public set: string = 'G2';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Blaine\'s Rapidash';
  public fullName: string = 'Blaine\'s Rapidash G2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          // If heads, do 30 damage plus 10 more damage to the Defending Pokémon
          THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 10);
          // Deal 10 damage to each of the opponent's Benched Pokémon
          const opponent = effect.opponent;

          opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
            if (cardList !== opponent.active) {
              const damageEffect = new PutDamageEffect(effect, 10);
              damageEffect.target = cardList;
              store.reduceEffect(state, damageEffect);
            }
          });
        }
      });
    }

    return state;
  }
}