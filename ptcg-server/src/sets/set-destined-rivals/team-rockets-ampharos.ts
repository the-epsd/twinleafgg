import { PokemonCard, Stage, CardType, CardTag, StoreLike, State, PowerType, StateUtils, PlayerType, GameLog } from '../../game';
import { Effect, EvolveEffect } from '../../game/store/effects/game-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class TeamRocketsAmpharos extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Team Rocket\'s Flaaffy';
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = L;
  public hp: number = 140;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Darkest Impulse',
    powerType: PowerType.ABILITY,
    text: 'When your opponent plays a Pokémon from their hand to evolve 1 of their Pokémon during their turn, put 4 damage counters on that Pokémon. The effect of Darkest Impulse doesn\'t stack.'
  }];

  public attacks = [{
    name: 'Head Bolt',
    cost: [L, C, C],
    damage: 140,
    text: ''
  }];

  public set: string = 'DRI';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Team Rocket\'s Ampharos';
  public fullName: string = 'Team Rocket\'s Ampharos DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Darkest Impulse
    if (effect instanceof EvolveEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      //const sourcePlayer = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, opponent, this)) {
        return state;
      }

      if (effect.darkestImpulseSV) {
        return state;
      }

      // checking if this is on the opponent's side
      let isAmphyOnOppsSide = false;
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          isAmphyOnOppsSide = true;
        }
      });
      if (!isAmphyOnOppsSide) {
        return state;
      }

      store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: this.powers[0].name });

      effect.target.damage += 40;
      effect.darkestImpulseSV = true;
    }

    return state;
  }
}
