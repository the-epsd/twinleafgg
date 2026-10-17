import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { GameError, GameMessage, PlayerType, PowerType, StateUtils, StoreLike, State } from '../../../game';
import { GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import {
  ABILITY_USED,
  COIN_FLIP_PROMPT,
  IS_ABILITY_BLOCKED,
  REMOVE_MARKER_AT_END_OF_TURN,
  USE_ABILITY_ONCE_PER_TURN,
  WAS_ATTACK_USED,
  WAS_POWER_USED,
} from '../../../game/store/prefabs/prefabs';

export class Ludicolo extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Lombre';
  public hp: number = 130;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Captivating Rhythm',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may flip a coin. If heads, switch 1 of your opponent\'s Benched Pokémon with his or her Active Pokémon.'
  }];

  public attacks = [{
    name: 'Solar Ray',
    cost: [G, C, C],
    damage: 80,
    text: 'Heal 20 damage from each of your Pokémon.'
  }];

  public set: string = 'PRC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Ludicolo';
  public fullName: string = 'Ludicolo PRC';

  public readonly CAPTIVATING_RHYTHM_MARKER = 'LUDICOLO_CAPTIVATING_RHYTHM_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Captivating Rhythm
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (!opponent.bench.some(b => b.cards.length > 0)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.CAPTIVATING_RHYTHM_MARKER, this);
      ABILITY_USED(player, this);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY(
            store,
            state,
            player,
            this.powers[0],
            this,
            { allowCancel: false },
          );
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.CAPTIVATING_RHYTHM_MARKER, this);

    // Solar Ray
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.damage > 0) {
          const healEffect = new HealEffect(player, cardList, 20);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    return state;
  }
}
