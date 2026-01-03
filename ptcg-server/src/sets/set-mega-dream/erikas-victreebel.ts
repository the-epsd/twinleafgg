import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class ErikasVictreebel extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Erika\'s Weepinbell';
  public tags = [CardTag.ERIKAS];
  public cardType: CardType = G;
  public hp: number = 150;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Mysterious Rondo',
    cost: [G, C],
    damage: 40,
    damageCalculation: 'x',
    text: 'This attack does 40 damage for each Erika\'s Pokemon you have in play.'
  },
  {
    name: 'Solarbeam',
    cost: [G, G, C],
    damage: 130,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'M2a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Erika\'s Victreebel';
  public fullName: string = 'Erika\'s Victreebel M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let erikasPokemonCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard) => {
        if (pokemonCard && pokemonCard.tags.includes(CardTag.ERIKAS)) {
          erikasPokemonCount++;
        }
      });

      effect.damage = 40 * erikasPokemonCount;
    }
    return state;
  }
}