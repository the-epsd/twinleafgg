import { PlayerType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Solrock extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 110;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Cosmo Beam',
    cost: [F],
    damage: 70,
    text: 'If you don\'t have Lunatone on your Bench, this attack does nothing. This attack\'s damage isn\'t affected by Weakness or Resistance.'
  }];

  public set: string = 'M1L';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Solrock';
  public fullName: string = 'Solrock M1L';
  public regulationMark = 'I';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;

      let isLunatoneInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Lunatone') {
          isLunatoneInPlay = true;
        }
      });

      if (!isLunatoneInPlay) {
        effect.damage = 0;
      }
    }

    return state;
  }
}