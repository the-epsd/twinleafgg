import { Attack, ChooseAttackPrompt, GameError, GameLog, GameMessage, PokemonCardList, StateUtils } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Shuppet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: C, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Disable',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If heads, choose 1 of the Defending Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s next turn.'
  },
  {
    name: 'Haunt',
    cost: [P],
    damage: 0,
    text: 'Put 1 damage counter on the Defending Pokémon.'
  }];

  public set: string = 'TM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';
  public name: string = 'Shuppet';
  public fullName: string = 'Shuppet TM';

  public MEMORY_SKIPPED_ATTACK: Attack | undefined;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          return state;
        }

        const opponent = StateUtils.getOpponent(state, player);
        const pokemonCard = opponent.active.getPokemonCard();

        if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
          return state;
        }

        store.prompt(state, new ChooseAttackPrompt(
          player.id,
          GameMessage.CHOOSE_ATTACK_TO_DISABLE,
          [pokemonCard],
          { allowCancel: false }
        ), result => {
          result;

          if (!result) {
            return state;
          }

          this.MEMORY_SKIPPED_ATTACK = result;

          store.log(state, GameLog.LOG_PLAYER_DISABLES_ATTACK, {
            name: player.name,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            attack: this.MEMORY_SKIPPED_ATTACK!.name
          });

          opponent.active.marker.addMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);

          return state;
        });
      });

      return state;
    }

    if (effect instanceof AttackEffect && effect.player.active.marker.hasMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
      if (effect.attack === this.MEMORY_SKIPPED_ATTACK) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.active.marker.hasMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
      effect.player.marker.removeMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
      this.MEMORY_SKIPPED_ATTACK = undefined;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(1, store, state, effect);
    }

    return state;
  }
}
