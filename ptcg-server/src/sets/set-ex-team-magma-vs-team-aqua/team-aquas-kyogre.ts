import { GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { UseAttackEffect } from '../../game/store/effects/game-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamAquasKyogre extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_AQUA];
  public cardType: CardType = W;
  public additionalCardTypes = [D];
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Power Saver',
    powerType: PowerType.POKEBODY,
    text: 'As long as the number of Pokémon in play (both yours and your opponent\'s) that has Team Aqua in its name is 3 or less, Team Aqua\'s Kyogre can\'t attack.'
  }];

  public attacks = [{
    name: 'Aqua Trip',
    cost: [W, C],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused. If tails, the Defending Pokémon is now Asleep.'
  },
  {
    name: 'Aqua Smash',
    cost: [W, W, C],
    damage: 50,
    damageCalculation: '+',
    text: 'If the Defending Pokémon is affected by a Special Condition, this attack does 50 damage plus 20 more damage.'
  }];


  public set: string = 'MA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Team Aqua\'s Kyogre';
  public fullName: string = 'Team Aqua\'s Kyogre MA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof UseAttackEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }
      // Count Team Rocket's Pokémon in play
      let teamAquaPokemonCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card?.tags.includes(CardTag.TEAM_AQUA)) {
          teamAquaPokemonCount++;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card?.tags.includes(CardTag.TEAM_AQUA)) {
          teamAquaPokemonCount++;
        }
      });

      // If less than 4 Team Rocket's Pokémon, prevent attack
      if (teamAquaPokemonCount <= 3) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
        } else {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.specialConditions.length > 0) {
        effect.damage += 20;
      }
    }

    return state;
  }
}