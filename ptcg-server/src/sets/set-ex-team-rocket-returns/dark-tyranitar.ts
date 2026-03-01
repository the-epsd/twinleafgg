import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';

export class DarkTyranitar extends PokemonCard {
  public tags = [CardTag.DARK];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Dark Pupitar';
  public cardType: CardType = F;
  public additionalCardTypes = [D];
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Sand Damage',
    powerType: PowerType.POKEBODY,
    text: 'As long as Dark Tyranitar is your Active Pokémon, put 1 damage counter on each of your opponent\'s Benched Basic Pokémon between turns. You can\'t use more than 1 Sand Damage Poké-Body between turns.'
  }];

  public attacks = [
    {
      name: 'Second Strike',
      cost: [F, C, C],
      damage: 50,
      damageCalculation: '+',
      text: 'If the Defending Pokémon already has at least 2 damage counters on it, this attack does 50 damage plus 20 more damage.'
    }
  ];

  public set: string = 'TRR';
  public setNumber: string = '20';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dark Tyranitar';
  public fullName: string = 'Dark Tyranitar TRR 20';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Sand Damage
    if (effect instanceof BetweenTurnsEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList === opponent.active) {
          return;
        }

        // ex era ruling is that this should mean unevolved
        if (!cardList.isEvolved()) {
          cardList.damage += (10);
        }
      });
    }

    // Second Strike
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.opponent.active.damage >= 20) {
        effect.damage += 20;
      }
    }

    return state;
  }
} 