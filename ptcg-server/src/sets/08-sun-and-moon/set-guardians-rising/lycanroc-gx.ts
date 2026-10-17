import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import {
  PowerType,
  StoreLike,
  State,
  StateUtils,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { BLOCK_IF_GX_ATTACK_USED, CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, JUST_EVOLVED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

// GRI Lycanroc-GX 74 (https://limitlesstcg.com/cards/GRI/74)
export class LycanrocGX extends PokemonCard {
  protected _tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Rockruff';

  public cardType: CardType[] = [CardType.FIGHTING];

  public hp: number = 200;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Bloodthirsty Eyes',
      useWhenInPlay: false,
      powerType: PowerType.ABILITY,
      text: "When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may switch 1 of your opponent's Benched Pokémon with their Active Pokémon.",
    },
  ];

  public attacks = [
    {
      name: 'Claw Slash',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 110,
      text: '',
    },

    {
      name: 'Dangerous Rogue-GX',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: 50,
      gxAttack: true,
      text: "This attack does 50 damage for each of your opponent's Benched Pokémon. (You can't use more than 1 GX attack in a game.)",
    },
  ];

  public set: string = 'GRI';

  public name: string = 'Lycanroc-GX';

  public fullName: string = 'Lycanroc-GX GRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '74';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bloodthirsty Eyes
    if (JUST_EVOLVED(effect, this) && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!opponent.bench.some(b => b.cards.length > 0)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, (result) => {
        if (result) {
          GUST_OPPONENT_BENCHED_POKEMON_FROM_ABILITY(
            store,
            state,
            player,
            this.powers[0],
            this,
          );
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      // Check if player has used GX attack
      BLOCK_IF_GX_ATTACK_USED(player);
      // set GX attack as used for game
      player.usedGX = true;

      const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      effect.damage = 50 * benched;
    }
    return state;
  }
}
