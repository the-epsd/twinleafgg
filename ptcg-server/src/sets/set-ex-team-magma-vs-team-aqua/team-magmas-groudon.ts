import { GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { UseAttackEffect } from '../../game/store/effects/game-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamMagmasGroudon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_MAGMA];
  public cardType: CardType = F;
  public additionalCardTypes = [D];
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Power Saver',
    powerType: PowerType.POKEBODY,
    text: 'As long as the number of Pokémon in play (both yours and your opponent\'s) that has Team Magma in its name is 3 or less, Team Magma\'s Groudon can\'t attack.'
  }];

  public attacks = [{
    name: 'Linear Attack',
    cost: [F, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Pulverize',
    cost: [F, F, C],
    damage: 50,
    damageCalculation: '+',
    text: 'If the Defending Pokémon already has at least 2 damage counters on it, this attack does 50 damage plus 20 more damage.'
  }];


  public set: string = 'MA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';
  public name: string = 'Team Magma\'s Groudon';
  public fullName: string = 'Team Magma\'s Groudon MA';

  public wantsToSwitch: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof UseAttackEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }
      // Count Team Rocket's Pokémon in play
      let teamMagmaPokemonCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card?.tags.includes(CardTag.TEAM_MAGMA)) {
          teamMagmaPokemonCount++;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card?.tags.includes(CardTag.TEAM_MAGMA)) {
          teamMagmaPokemonCount++;
        }
      });

      // If less than 4 Team Rocket's Pokémon, prevent attack
      if (teamMagmaPokemonCount <= 3) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(20, effect, store, state);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.active.damage >= 20) {
        effect.damage += 20;
      }
    }

    return state;
  }
}