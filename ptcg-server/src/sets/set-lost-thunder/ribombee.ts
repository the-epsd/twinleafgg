import { Stage, CardType, PowerType, State, StoreLike, StateUtils, TrainerType } from '../../game';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { TrainerTargetEffect } from '../../game/store/effects/play-card-effects';

export class Ribombee extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Cutiefly';
  public cardType: CardType = Y;
  public hp: number = 60;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];

  public powers = [{
    name: 'Mysterious Buzz',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is on your Bench, whenever your opponent plays a Supporter card from their hand, prevent all effects of that card done to your [Y] Pokémon in play.'
  }];

  public attacks = [{
    name: 'Stampede',
    cost: [Y],
    damage: 20,
    text: ''
  }];

  public set: string = 'LOT';
  public name: string = 'Ribombee';
  public fullName: string = 'Ribombee LOT';
  public setNumber: string = '146';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerTargetEffect && effect.target && effect.trainerCard?.trainerType === TrainerType.SUPPORTER) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isRibombeeInPlay = false;
      opponent.bench.forEach(benchPokemon => {
        if (benchPokemon.getPokemonCard() === this) {
          isRibombeeInPlay = true;
        }
      });

      const checkPokemonType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonType);

      if (isRibombeeInPlay && checkPokemonType.cardTypes.includes(CardType.FAIRY)) {
        effect.target = undefined;
      }
    }

    return state;
  }
}