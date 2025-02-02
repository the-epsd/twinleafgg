import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {StoreLike,State, PlayerType} from '../../game';
import {Effect} from '../../game/store/effects/effect';
import {AttackEffect} from '../../game/store/effects/game-effects';
import {PutDamageEffect} from '../../game/store/effects/attack-effects';

export class Centiskorch extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Sizzlipede';
  public cardType: CardType = R;
  public hp: number = 130;
  public weakness = [{ type: W }];
  public retreat = [ C, C ];

  public attacks = [
    { name: 'Billowing Heat Wave', cost: [R], damage: 130, text: 'This attack also does 30 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)' },
    { name: 'Heat Blast', cost: [C, C, C], damage: 80, text: '' },
  ];

  public set: string = 'SSP';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';

  public name: string = 'Centiskorch';
  public fullName: string = 'Centiskorch SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Billowing Heat Wave
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList !== player.active){
          const damageEffect = new PutDamageEffect(effect, 30);
          damageEffect.target = cardList;
          store.reduceEffect(state, damageEffect);
        }
      });
    }
    return state;
  }
  
}