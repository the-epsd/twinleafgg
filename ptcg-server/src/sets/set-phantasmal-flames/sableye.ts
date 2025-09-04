import { PokemonCard, Stage, CardType, StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Sableye extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Angry Claw',
    cost: [D],
    damage: 20,
    damageCalculation: '+',
    text: 'If you have a Stage 2 [D] Pokémon in play, this attack does 70 more damage.'
  }];

  public regulationMark = 'I';
  public set: string = 'MBG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';
  public name: string = 'Sableye';
  public fullName: string = 'Sableye MBG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let hasStage2Dark = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const pokemon = cardList.getPokemonCard();
        if (pokemon && pokemon.stage === Stage.STAGE_2 && pokemon.cardType === CardType.DARK) {
          hasStage2Dark = true;
        }
      });
      if (hasStage2Dark) {
        effect.damage += 70;
      }
    }
    return state;
  }
}
