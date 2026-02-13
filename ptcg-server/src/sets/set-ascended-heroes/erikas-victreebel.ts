import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
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
    name: 'Flower Garden Rondo',
    cost: [G, C],
    damage: 40,
    damageCalculation: 'x',
    text: 'This attack does 40 damage for each of your Erika\'s Pokémon in play.'
  },
  {
    name: 'Solar Beam',
    cost: [G, G, C],
    damage: 130,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';
  public name: string = 'Erika\'s Victreebel';
  public fullName: string = 'Erika\'s Victreebel MC';

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