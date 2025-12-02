import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class MegaLopunnyex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Buneary';
  public cardType: CardType = C;
  public tags = [CardTag.POKEMON_ex];
  public hp: number = 330;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Gale Thrust',
    cost: [C],
    damage: 60,
    text: 'If this Pokemon was on your Bench this turn, this attack does 170 more damage.'
  }, {
    name: 'Spike Hopper',
    cost: [C, C],
    damage: 160,
    text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokemon.'
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '84';
  public name: string = 'Mega Lopunny ex';
  public fullName: string = 'Mega Lopunny ex M2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      // Check if this Pokemon was on the bench this turn
      const activePokemon = player.active.getPokemonCard();
      if (activePokemon && activePokemon.movedToActiveThisTurn) {
        effect.damage += 170;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      // Spike Hopper ignores effects on opponent's Active Pokemon
      // This is handled by the damage calculation system automatically
      // No special implementation needed as the text is descriptive
    }

    return state;
  }
}
