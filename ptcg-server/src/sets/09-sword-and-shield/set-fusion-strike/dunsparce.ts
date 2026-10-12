import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { CheckPokemonStatsEffect } from '../../../game/store/effects/check-effects';
import { Player, PlayerType, pokemonHasCardType } from '../../../game';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';


export class Dunsparce extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType[] = [CardType.COLORLESS];

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Mysterious Nest',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: '[C] Pokémon in play (both yours and your opponent\'s) have no Weakness.'
  }];

  public attacks = [
    {
      name: 'Rollout',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: ''
    }];

  public regulationMark = 'E';

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '207';

  public name: string = 'Dunsparce';

  public fullName: string = 'Dunsparce FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckPokemonStatsEffect) {
      let abilityOwner: Player | null = null;

      state.players.forEach(p => {
        p.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
          if (cardList.getPokemonCard() === this) {
            abilityOwner = p;
          }
        });
      });

      if (!abilityOwner) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      const pokemon = effect.target.getPokemonCard();
      if (!pokemon || !pokemonHasCardType(pokemon, CardType.COLORLESS)) {
        return state;
      }

      if (!CAN_APPLY_ABILITY_TO_TARGET(
        store,
        state,
        abilityOwner,
        this.powers[0],
        this,
        effect.target,
      )) {
        return state;
      }

      effect.weakness = [];
    }
    return state;
  }
}
