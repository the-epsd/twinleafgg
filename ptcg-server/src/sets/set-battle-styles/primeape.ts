import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, PlayerType, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_A_STADIUM_CARD_IN_PLAY, THIS_ATTACK_DOES_X_MORE_DAMAGE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

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
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (!stadiumCard) {
        return state;
      }

      //Discard only the opponent's stadium.
      const stadiumCardList = StateUtils.findCardList(state, stadiumCard);
      const owner = StateUtils.findOwner(state, stadiumCardList);
      if (owner !== effect.player) {
        DISCARD_A_STADIUM_CARD_IN_PLAY(state);
        return state;
      }
      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      //I check how many Pokémon are on the bench to know how much damage the attack will cause.
      const player = effect.player;
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
      //The attack needs to be reset; otherwise, it will always cause 50 damage, even without any Pokémon with damage on the bench.
      effect.damage = 0;
      THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 50 * benchPokemonWithDamage);
    }
    return state;
  }
}