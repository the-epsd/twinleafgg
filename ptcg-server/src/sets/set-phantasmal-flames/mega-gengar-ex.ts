import { AttachEnergyPrompt, CardTag, CardType, GameMessage, GamePhase, PlayerType, PokemonCard, PowerType, SlotType, Stage, State, StateUtils, StoreLike, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_MARKER, HAS_MARKER, IS_ABILITY_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class MegaGengarex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Haunter';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = D;
  public hp: number = 350;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Shadow Hiding',
    powerType: PowerType.ABILITY,
    text: 'Whenever 1 of your [D] Pokemon is Knocked Out by damage from an attack from your opponent\'s Pokemon ex, your opponent takes 1 less Prize card.This effect does not stack.'
  }];

  public attacks = [{
    name: 'Void Gale',
    cost: [D, D],
    damage: 230,
    text: 'Move an Energy from this Pokemon to 1 of your Benched Pokemon.',
  }];

  public regulationMark: string = 'I';
  public set: string = 'MBG';
  public setNumber: string = '3';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Gengar ex';
  public fullName: string = 'Mega Gengar ex MBG';

  private readonly VOID_GALE_MARKER = 'VOID_GALE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof KnockOutEffect) {
      const player = effect.player; // owner of the Pokémon that was Knocked Out
      const opponent = StateUtils.getOpponent(state, player);

      // Only during opponent's attack step
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      // Ability must be in play on player's side and not blocked
      let hasThisInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          hasThisInPlay = true;
        }
      });
      if (!hasThisInPlay || IS_ABILITY_BLOCKED(store, state, opponent, this)) {
        return state;
      }

      // Target must be a Darkness Pokémon
      const checkType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkType);
      const isDarkPokemon = checkType.cardTypes.includes(D);
      if (!isDarkPokemon) {
        return state;
      }

      // Attacking Pokémon must be a Pokémon ex
      const attackingPokemon = opponent.active.getPokemonCard();
      const attackerIsEx = attackingPokemon?.tags.includes(CardTag.POKEMON_ex) === true;
      if (!attackerIsEx) {
        return state;
      }

      // Prevent stacking if multiple copies are in play (mark the KO target for this resolution)
      const NON_STACK_MARKER = 'MEGA_GENGAR_SHADOW_HIDING_APPLIED';
      if (effect.target.marker.hasMarker(NON_STACK_MARKER, this)) {
        return state;
      }
      effect.target.marker.addMarker(NON_STACK_MARKER, this);

      if (effect.prizeCount > 0) {
        effect.prizeCount -= 1;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_MARKER(this.VOID_GALE_MARKER, effect.player, this);
      return state;
    }

    if (effect instanceof AfterAttackEffect && HAS_MARKER(this.VOID_GALE_MARKER, effect.player, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      // Then prompt for energy movement
      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.active,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 1, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.active.moveCardTo(transfer.card, target);
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.VOID_GALE_MARKER, this);

    return state;
  }
}
