import { BoardEffect, CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { GameError, GameMessage, PlayerType, PokemonCard, PowerType } from '../../../game';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class HisuianGoodraVSTAR extends PokemonCard {
  public stage: Stage = Stage.VSTAR;
  public evolvesFrom = 'Hisuian Goodra V';
  public tags = [CardTag.POKEMON_VSTAR];
  public cardType: CardType = N;
  public hp: number = 270;
  public retreat = [C, C, C];

  public powers = [{
    name: 'Moisture Star',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'During your turn, you may heal all damage from this Pokémon. (You can\'t use more than 1 VSTAR Power in a game.) '
  }];

  public attacks = [{
    name: 'Rolling Iron',
    cost: [W, M, C],
    damage: 200,
    text: 'During your opponent\'s next turn, this Pokémon takes 80 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public regulationMark = 'F';
  public set: string = 'LOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '136';
  public name: string = 'Hisuian Goodra VSTAR';
  public fullName: string = 'Hisuian Goodra VSTAR LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.usedVSTAR) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
      }

      player.usedVSTAR = true;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          const healEffect = new HealEffect(player, cardList, 999);
          store.reduceEffect(state, healEffect);
        }
      });

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });

    }
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 80;
    }

    return state;
  }
}
