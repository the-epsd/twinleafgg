import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { GameMessage, GamePhase, PlayerType, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { KnockOutEffect } from '../../../game/store/effects/game-effects';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, ADD_MARKER, CONFIRMATION_PROMPT, HAS_MARKER, IS_POKEPOWER_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';

export class Shedinja extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Nincada';
  public hp: number = 60;
  public cardType: CardType[] = [G];
  public weakness = [];
  public retreat = [];

  public powers = [{
    name: 'Resent',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your opponent\'s turn, if Shedinja would be Knocked Out by damage from an attack, you may put 4 damage counters on the Attacking Pokémon and each of the opponent\'s Pokémon that has the same name as the Attacking Pokémon.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Curse and Deceive',
    cost: [C],
    damage: 0,
    text: 'Put 3 damage counters on the Defending Pokémon. If Shedinja has any damage counters on it, the Defending Pokémon is now Confused.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Shedinja';
  public fullName: string = 'Shedinja LA';

  public readonly RESENT_USED_MARKER = 'RESENT_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.RESENT_USED_MARKER, this);

    // Resent
    if (effect instanceof KnockOutEffect && effect.target.getPokemonCard() === this
      && state.phase === GamePhase.ATTACK
      && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)
      && !HAS_MARKER(this.RESENT_USED_MARKER, effect.player, this)) {
      const owner = effect.player;
      const attacker = StateUtils.getOpponent(state, owner);
      if (IS_POKEPOWER_BLOCKED(store, state, owner, this)) {
        return state;
      }
      CONFIRMATION_PROMPT(store, state, owner, wantToUse => {
        if (!wantToUse) {
          return;
        }
        ADD_MARKER(this.RESENT_USED_MARKER, owner, this);
        const attackerCard = attacker.active.getPokemonCard();
        const attackerName = attackerCard?.name;
        attacker.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
          if (cardList === attacker.active || (attackerName && card.name === attackerName)) {
            store.reduceEffect(
              state,
              new PlaceDamageCountersEffect(owner, cardList, 40, this, this.powers[0]),
            );
          }
        });
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    // Curse and Deceive
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(3, store, state, effect);
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      if (cardList.damage > 0) {
        ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
      }
    }

    return state;
  }
}
