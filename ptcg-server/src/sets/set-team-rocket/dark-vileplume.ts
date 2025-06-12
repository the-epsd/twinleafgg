import { PokemonCard, Stage, StoreLike, State, StateUtils, CardTag, PlayerType, GameError, GameMessage } from '../../game';
import { PowerType } from '../../game';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, IS_POKEMON_POWER_BLOCKED, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AttachPokemonToolEffect, PlayItemEffect, PlayStadiumEffect, PlaySupporterEffect } from '../../game/store/effects/play-card-effects';

export class DarkVileplume extends PokemonCard {
  public stage = Stage.STAGE_2;
  public evolvesFrom = 'Dark Gloom';
  public tags = [CardTag.DARK];
  public cardType = G;
  public hp = 60;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Hay Fever',
    powerType: PowerType.POKEMON_POWER,
    text: 'No Trainer cards can be played. This power stops working while Dark Vileplume is Asleep, Confused, or Paralyzed.'
  }];

  public attacks: Attack[] = [
    {
      name: 'Petal Whirlwind',
      cost: [G, G, G],
      damage: 10,
      text: 'Flip 3 coins. This attack does 30 damage times the number of heads. If you get 2 or more heads, Dark Vileplume is now Confused (after doing damage).'
    },
  ];

  public set = 'TR';
  public setNumber: string = '13';
  public cardImage: string = 'assets/cardback.png';
  public name = 'Dark Vileplume';
  public fullName = 'Dark Vileplume TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayItemEffect ||
      effect instanceof PlaySupporterEffect ||
      effect instanceof PlayStadiumEffect ||
      effect instanceof AttachPokemonToolEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      let vileplumeInPlay = false;

      // Checking to see if ability is being blocked
      if (IS_POKEMON_POWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Checks for Vileplume in play on Player's Turn
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER && PlayerType.TOP_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          vileplumeInPlay = true;
        }

        if (!vileplumeInPlay) {
          return state;
        }

        if (vileplumeInPlay) {
          throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
        }
      });

      // Checks for Vileplume in play on Opponent's Turn (opponent of the owner of this card)
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER && PlayerType.TOP_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          vileplumeInPlay = true;
        }

        if (!vileplumeInPlay) {
          return state;
        }

        if (vileplumeInPlay) {
          throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
        }
      });

    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        let heads: number = 0;
        results.forEach(r => {
          if (r) heads++;
        });
        effect.damage = 30 * heads;

        if (heads >= 2) {
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, player, this);
        }
      });
    }

    return state;
  }

}
