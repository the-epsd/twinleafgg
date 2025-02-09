import { CardType, PlayerType, PokemonCard, Stage, State, StoreLike } from "../../game";
import { PutDamageEffect } from "../../game/store/effects/attack-effects";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";

export class Steelix extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Onix';
  public cardType: CardType = F;
  public hp: number = 190;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Powerful Rage',
      cost: [C, C],
      damage: 20,
      damageCalculation: 'x',
      text: 'This attack does 20 damage for each damage counter on this Pokémon.'
    },
    {
      name: 'Earthquake',
      cost: [F, F, C],
      damage: 180,
      text: 'This attack also does 30 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public regulationMark: string = 'E';
  public set: string = 'FST';
  public setNumber: string = '139';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Steelix';
  public fullName: string = 'Steelix FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage = 2 * effect.player.active.damage;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList !== player.active) {
          const damageEffect = new PutDamageEffect(effect, 30);
          damageEffect.target = cardList;
          store.reduceEffect(state, damageEffect);
        }
      });
    }
    return state;
  }
}