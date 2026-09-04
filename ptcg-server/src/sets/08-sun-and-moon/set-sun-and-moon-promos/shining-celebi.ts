import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COPY_ATTACK_VIA_ABILITY } from '../../../game/store/prefabs/copy-attack-prefabs';
import { WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class ShiningCelebi extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType[] = [G];

  public hp: number = 70;

  public weakness = [{ type: R }];

  public retreat = [C];

  public powers = [{
    name: 'Time Recall',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Each of your evolved Pokémon can use any attack from its previous Evolutions. (You still need the necessary Energy to use each attack.)'
  }];

  public attacks = [{ name: 'Leaf Step', cost: [G, C], damage: 30, text: '' }];

  public set: string = 'SMP';

  public setNumber = '79';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Shining Celebi';

  public fullName: string = 'Shining Celebi SMP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard === this || pokemonCard?.stage === Stage.BASIC) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const pokemons = player.active.getPokemons();
      const extraCards: PokemonCard[] = [pokemons[0]];
      if (pokemonCard?.stage === Stage.STAGE_2 && pokemons[1]?.stage !== Stage.STAGE_2) {
        extraCards.push(pokemons[1]);
      }

      return COPY_ATTACK_VIA_ABILITY(store, state, effect, {
        copycatCard: this,
        requireActiveCopycat: false,
        extraCards,
      });
    }

    return state;
  }
}
