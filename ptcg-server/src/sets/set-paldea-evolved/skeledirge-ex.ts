import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {StoreLike,State, PlayerType} from '../../game';
import {Effect} from '../../game/store/effects/effect';
import {AttackEffect} from '../../game/store/effects/game-effects';
import {HealTargetEffect} from '../../game/store/effects/attack-effects';

export class Skeledirgeex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Crocalor';
  public cardType: CardType = R;
  public hp: number = 340;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Vitality Song',
      cost: [R],
      damage: 50,
      text: 'Heal 30 damage from each of your Pokémon.'
    },
    {
      name: 'Burning Voice',
      cost: [R, R],
      damage: 270,
      damageCalculation: '-',
      text: 'This attack does 10 less damage for each damage counter on this Pokémon.'
    },
  ];

  public set: string = 'PAL';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Skeledirge ex';
  public fullName: string = 'Skeledirge ex PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Vitality Song
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        const healing = new HealTargetEffect(effect, 30);
        healing.target = cardList;
        store.reduceEffect(state, healing);
      });
    }

    // Burning Voice
    if (effect instanceof AttackEffect && effect.attack ===  this.attacks[1]){
      effect.damage -= effect.player.active.damage;
    }

    return state;
  }
}
