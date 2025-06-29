import { PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PowerType, StoreLike, State, GameMessage, StateUtils, GameError, GameLog } from '../../game';
import { ADD_MARKER, CONFIRMATION_PROMPT, HAS_MARKER, IS_POKEPOWER_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Mesprit extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: CardType.PSYCHIC, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Psychic Bind',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Mesprit from your hand onto your Bench, you may use this power. Your opponent can\'t use any Poké-Powers on his or her Pokémon during your opponent\'s next turn.'
  }];

  public attacks = [{
    name: 'Extrasensory',
    cost: [P, P],
    damage: 20,
    damageCalculation: '+',
    text: 'If you have the same number of cards in your hand as your opponent, this attack does 20 damage plus 50 more damage.'
  }];

  public set: string = 'LA';
  public name: string = 'Mesprit';
  public fullName: string = 'Mesprit LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';

  public readonly PSYCHIC_BIND_MARKER = 'PSYCHIC_BIND_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          const opponent = StateUtils.getOpponent(state, player);
          ADD_MARKER(this.PSYCHIC_BIND_MARKER, opponent, this);

          // Log the ability usage
          store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: this.name, ability: this.powers[0].name });
        }
      });
    }

    if (effect instanceof PowerEffect && HAS_MARKER(this.PSYCHIC_BIND_MARKER, effect.player, this)
      && (effect.power.powerType === PowerType.POKEPOWER)) {

      throw new GameError(GameMessage.CANNOT_USE_POWER);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.PSYCHIC_BIND_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.player.hand.cards.length === effect.opponent.hand.cards.length) {
        effect.damage += 50;
      }
    }

    return state;
  }

}
