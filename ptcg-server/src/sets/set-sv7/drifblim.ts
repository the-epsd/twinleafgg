import { PokemonCard, Stage, CardType, StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Drifblim extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 130;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Drifloon';

  public attacks = [{
    name: 'Everyone Explode Now',
    cost: [CardType.PSYCHIC],
    damage: 50,
    damageCalculation: 'x',
    text: 'This attack does 50 damage for each of your Drifloon and Drifblim in play. This attack also does 30 damage to each of your Drifloon and Drifblim. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public name: string = 'Drifblim';
  public fullName: string = 'Drifblim SV7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let drifloonInPlay = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card.name === 'Drifloon') {
          drifloonInPlay++;
        }
      });

      let drifblimInPlay = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card.name === 'Drifblim') {
          drifblimInPlay++;
        }
      });

      const damage = drifloonInPlay + drifblimInPlay;

      effect.damage = 50 * damage;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card && card.name === 'Drifloon') {
          cardList.damage += 30;
        }
      });

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card && card.name === 'Drifblim') {
          cardList.damage += 30;
        }
      });

    }
    return state;
  }
}
