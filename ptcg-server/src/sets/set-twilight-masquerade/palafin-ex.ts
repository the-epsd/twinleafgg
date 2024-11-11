import { PokemonCard, Stage, CardType, CardTag, PowerType, StoreLike, State, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, EvolveEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Palafinex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Finizen';
  public cardType: CardType = W;
  public hp: number = 340;
  public weakness = [{ type: L }];
  public retreat = [C, C];
  public tags = [CardTag.POKEMON_EX];

  public powers = [{
    name: 'Hero\'s Spirit',
    powerType: PowerType.ABILITY,
    text: 'Put this Pokémon into play only with the effect of Palafin\'s Zero to Hero Ability.'
  }];

  public attacks = [{
    name: 'Giga Impact',
    cost: [W],
    damage: 250,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public set: string = 'TWM';
  public setNumber: string = '61';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public fullName: string = 'Palafin ex TWM';
  public name: string = 'Palafin ex';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EvolveEffect && effect.pokemonCard === this) {
      throw new GameError(GameMessage.CANNOT_EVOLVE);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.player.attackMarker.addMarker(this.ATTACK_USED_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_MARKER, this);
    }

    return state;
  }

  private readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
}
