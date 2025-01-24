import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class DonphanVIV extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Phanpy';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 150;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    { 
      name: 'Earthquake', 
      cost: [CardType.FIGHTING], 
      damage: 120,
      text: 'This attack also does 20 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)' },
    { 
      name: 'Heavy Impact', 
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS], 
      damage: 90, 
      text: '' }
  ];

  public set: string = 'VIV';

  public name: string = 'Donphan';

  public fullName: string = 'Donphan VIV';

  public regulationMark = 'D';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '87';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Earthquake
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;
  
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList !== player.active){
          const damageEffect = new PutDamageEffect(effect, 20);
          damageEffect.target = cardList;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    return state;
  }
}