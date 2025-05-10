import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Beldum extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = L;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Conductive Body',
    powerType: PowerType.POKEBODY,
    text: 'As long as Beldum is your Active Pokémon, you pay [C] less to retreat Beldum for each Beldum on your Bench.'
  }];

  public attacks = [
    {
      name: 'Take Down',
      cost: [L, C],
      damage: 30,
      text: 'Beldum does 10 damage to itself.',
    }
  ];

  public set: string = 'DS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Beldum';
  public fullName: string = 'Beldum DS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;

      let isBeldumInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isBeldumInPlay = true;
        }
      });

      if (!isBeldumInPlay) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard) {
        const BeldumCount = player.bench.reduce((count, benchCard) => {
          const benchPokemon = benchCard.getPokemonCard();
          return benchPokemon && benchPokemon.name === this.name ? count + 1 : count;
        }, 0);
        console.log('BeldumCount', BeldumCount);

        for (let i = 0; i < BeldumCount; i++) {
          const index = effect.cost.indexOf(CardType.COLORLESS);
          if (index !== -1) {
            effect.cost.splice(index, 1);
          } else {
            break;
          }
        }
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
    }
    return state;
  }
}
