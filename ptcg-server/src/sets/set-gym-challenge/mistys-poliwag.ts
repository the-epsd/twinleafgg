import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, Attack, StateUtils, ChooseAttackPrompt, GameMessage, GameLog, PokemonCardList, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_MARKER, BLOCK_EFFECT_IF_MARKER, COIN_FLIP_PROMPT, REMOVE_MARKER_AT_END_OF_TURN, REPLACE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MistysPoliwag extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.MISTYS];
  public cardType: CardType = W;
  public hp: number = 50;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Bubbles',
    cost: [W],
    damage: 20,
    text: 'Flip a coin. If tails, you can\'t use this attack during your next turn.'
  },
  {
    name: 'Amnesia',
    cost: [W, W],
    damage: 0,
    text: 'Choose 1 of the Defending Pokémon\'s attacks.That Pokémon can\'t use that attack during your opponent\'s next turn.'
  }];

  public set: string = 'G2';
  public name: string = 'Misty\'s Poliwag';
  public fullName: string = 'Misty\'s Poliwag G2';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';

  public DISABLED_ATTACK: Attack | undefined;
  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      BLOCK_EFFECT_IF_MARKER(this.ATTACK_USED_2_MARKER, effect.player, this);

      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          ADD_MARKER(this.ATTACK_USED_MARKER, effect.player, this);
        }
      })
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_2_MARKER, this);
    REPLACE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_MARKER, this.ATTACK_USED_2_MARKER, this);

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = opponent.active.getPokemonCard();

      if (pokemonCard === undefined || pokemonCard.attacks.length === 0 || pokemonCard.stage !== Stage.BASIC) {
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

        this.DISABLED_ATTACK = result;

        store.log(state, GameLog.LOG_PLAYER_DISABLES_ATTACK, {
          name: player.name,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          attack: this.DISABLED_ATTACK!.name
        });

        opponent.active.marker.addMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
      });
    }

    if (effect instanceof AttackEffect && effect.player.active.marker.hasMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
      if (effect.attack === this.DISABLED_ATTACK) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.active.marker.hasMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
      effect.player.marker.removeMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
      this.DISABLED_ATTACK = undefined;
    }

    return state;
  }
}