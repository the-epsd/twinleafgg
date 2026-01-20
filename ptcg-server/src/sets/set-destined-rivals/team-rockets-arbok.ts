import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, GameError, GameMessage, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DAMAGE_OPPONENT_POKEMON, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';

export class TeamRocketsArbok extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Team Rocket\'s Ekans';
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = D;
  public hp: number = 130;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Intimidating Glare',
    powerType: PowerType.ABILITY,
    text: 'If this Pokemon is your Active Pokemon, your opponent can\'t play any Pokemon cards with Abilities from their hand (excluding Rocket\'s Pokemon).'
  }];

  public attacks = [
    {
      name: 'Spinning Tail',
      cost: [D, D, D],
      damage: 0,
      text: 'This attack does 30 damage to each of your opponent\'s Pokemon (Don\'t apply Weakness and Resistance for Benched Pokemon).'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber: string = '113';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Arbok';
  public fullName: string = 'Team Rocket\'s Arbok DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Intimidating Glare
    if (effect instanceof PlayPokemonEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = effect.pokemonCard;

      if (opponent.active.getPokemonCard() !== this) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, opponent, this)) { return state; }

      const powersEffect = new CheckPokemonPowersEffect(player, effect.pokemonCard);
      state = store.reduceEffect(state, powersEffect);

      if (powersEffect.powers.some(power => power.powerType === PowerType.ABILITY) && !pokemonCard.tags.includes(CardTag.TEAM_ROCKET)) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    // Spinning Tail
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 30, [cardList]);
      });
    }

    return state;
  }
}
