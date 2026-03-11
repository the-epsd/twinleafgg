import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Omanyte extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Mysterious Fossil';
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Ancient Tentacles',
    powerType: PowerType.POKEBODY,
    text: 'Damage done to your opponent\'s Pokémon by your Omanyte, Omastar, Kabuto, Kabutops, or Kabutops ex isn\'t affected by Resistance.',
  }];

  public attacks = [{
    name: 'Rising Lunge',
    cost: [W, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 20 damage plus 20 more damage.'
  }];

  public set: string = 'LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '60';
  public name: string = 'Omanyte';
  public fullName: string = 'Omanyte LM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && !IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;

      let isOmanyteInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isOmanyteInPlay = true;
        }
      });

      if (!isOmanyteInPlay) {
        return state;
      }

      if (effect.source.getPokemonCard()?.name === 'Omanyte' ||
        effect.source.getPokemonCard()?.name === 'Omastar' ||
        effect.source.getPokemonCard()?.name === 'Kabuto' ||
        effect.source.getPokemonCard()?.name === 'Kabutops' ||
        effect.source.getPokemonCard()?.name === 'Kabutops ex') {
        effect.ignoreResistance = true;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }

    return state;
  }
}
