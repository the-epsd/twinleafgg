import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { COIN_FLIP_PROMPT, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../../game/store/prefabs/attack-effects';

export class Unown extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: '!',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Unown ! from your hand onto your Bench, you may flip a coin. If heads, put 2 damage counters on 1 of your opponent\'s Pokémon. If tails, put 2 damage counters on 1 of your Pokémon.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Hidden Power',
    cost: [P],
    damage: 10,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 10 damage plus 10 more damage. If tails, Unown ! does 10 damage to itself, and this attack\'s damage isn\'t affected by Weakness or Resistance.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Unown [!]';
  public fullName: string = 'Unown [!] LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // !
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, wantToUse => {
        if (!wantToUse) {
          return;
        }

        COIN_FLIP_PROMPT(store, state, player, result => {
          const targetPlayer = result ? opponent : player;
          store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
            targetPlayer === player ? PlayerType.BOTTOM_PLAYER : PlayerType.TOP_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            { allowCancel: false, min: 1, max: 1 },
          ), targets => {
            if (!targets || targets.length === 0) {
              return;
            }
            store.reduceEffect(
              state,
              new PlaceDamageCountersEffect(player, targets[0], 20, this, this.powers[0]),
            );
          });
        });
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    // Hidden Power
    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 10);
    }

    return state;
  }
}
