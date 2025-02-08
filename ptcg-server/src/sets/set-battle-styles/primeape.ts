import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, PlayerType, GameMessage } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';


export class Primeape extends PokemonCard {
  public evolvesFrom = 'Mankey';
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = F;
  public hp: number = 120;
  public weakness = [{ type: P }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: ' Field Crush',
      cost: [C],
      damage: 20,
      text: 'If your opponent has a Stadium in play, discard it.'
    },
    {
      name: 'Steamin\' Mad Strike',
      cost: [F, F],
      damage: 50,
      damageCalculation: 'x',
      text: 'This attack does 50 damage for each of your Benched Pokémon that has any damage counters on it.'
    }
  ];

  public set: string = 'BST';
  public name: string = 'Primeape';
  public fullName: string = 'Primeape BST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public regulationMark = 'E';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (!stadiumCard) {
        return state;
      }

      const stadiumCardList = StateUtils.findCardList(state, stadiumCard);
      const owner = StateUtils.findOwner(state, stadiumCardList);

      if (stadiumCard !== undefined && owner !== effect.player) {
        const cardList = StateUtils.findCardList(state, stadiumCard);
        const player = StateUtils.findOwner(state, cardList);
        cardList.moveTo(player.discard);
        return state;
      }

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player
      const hasBenched = player.bench.some(b => b.cards.length > 0);

      if (!hasBenched) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      let benchPokemonWithDamage = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList === player.active) {
          return;
        }
        if (cardList.damage !== 0) {
          benchPokemonWithDamage++;
        }
      });
      effect.damage = benchPokemonWithDamage * 50;
      return state;
    }
    return state;
  }
}