import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';


export class Luxray extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Luxio';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 150;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Swelling Flash',
    powerType: PowerType.ABILITY,
    useFromHand: true,
    text: 'Once during your turn, if this Pokémon is in your hand and you have more Prize cards remaining than your opponent, you may put this Pokémon onto your Bench.'
  }];

  public attacks = [{

    name: 'Wild Charge',
    cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
    damage: 180,
    text: 'This Pokémon also does 20 damage to itself.'
  }];

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '71';

  public name: string = 'Luxray';

  public fullName: string = 'Luxray PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect
      && effect.power.powerType === PowerType.ABILITY
      && effect.power.name !== 'Swelling Flash') {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.getPrizeLeft() < opponent.getPrizeLeft()) {

        const canPlayLuxray = player.hand.cards.some(c => {
          return c instanceof PokemonCard && c.cards.filter(this);
        });

        if (canPlayLuxray) {
          this.stage = Stage.BASIC;
        }
        return state;
      }
      return state;
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      this.stage = Stage.STAGE_2;
    }

    return state;
  }
}