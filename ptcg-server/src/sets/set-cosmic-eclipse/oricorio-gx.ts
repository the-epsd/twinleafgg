import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PowerType, SlotType, StateUtils } from '../../game';
import { AttackEffect, KnockOutEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { BLOCK_IF_GX_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class OricorioGX extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_GX];
  public cardType: CardType = CardType.PSYCHIC;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public hp: number = 170;
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Dance of Tribute',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), if any of your Pokémon were Knocked Out during your opponent\’s last turn, you may draw 3 cards. You can\’t use more than 1 Dance of Tribute Ability each turn.'
  }];

  public attacks = [{
    name: 'Razor Wing',
    cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
    damage: 80,
    text: ''
  },
  {
    name: 'Strafe GX',
    cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
    damage: 100,
    text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
      + ' (You can\'t use more than 1 GX attack in a game.) '
  }];

  public set: string = 'CEC';
  public setNumber: string = '95';
  public cardImage: string = 'assets/cardback.png';
  public name = 'Oricorio GX';
  public fullName = 'Oricorio GX CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    //Dance of Tribute
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (!player.marker.hasMarker('OPPONENT_KNOCKOUT_MARKER')) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      //Once per turn only
      if (player.usedTributeDance == true) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.deck.moveTo(player.hand, 3);
      player.usedTributeDance = true;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });
    }

    if (effect instanceof KnockOutEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner === player) {
        effect.player.marker.addMarkerToState('OPPONENT_KNOCKOUT_MARKER');
      }
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner === player) {
        effect.player.marker.removeMarker('OPPONENT_KNOCKOUT_MARKER');
      }
      player.usedTributeDance = false;
    }

    //Strafe GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      const hasBenched = player.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: true },
      ), selected => {
        if (!selected || selected.length === 0) {
          return state;
        }
        const target = selected[0];
        player.switchPokemon(target);
      });
    }

    return state;
  }
}