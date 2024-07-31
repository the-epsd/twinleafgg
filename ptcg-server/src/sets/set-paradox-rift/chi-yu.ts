import {
  AttachEnergyPrompt,
  EnergyCard,
  GameError,
  GameMessage,
  GamePhase,
  PlayerType,
  SlotType,
  State,
  StateUtils,
  StoreLike
} from '../../game';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class ChiYu extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 110;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Flaire Bringer',
      cost: [CardType.FIRE],
      damage: 0,
      text: 'Attach up to 2 Basic [R] Energy cards from your discard pile to 1 of your Pokémon.'
    },
    {
      name: 'Megafire of Envy',
      cost: [CardType.FIRE, CardType.FIRE],
      damage: 50,
      damageCalculation: '+',
      text: 'If any of your Pokémon were Knocked Out by damage from an attack during your opponent\'s last turn, this attack does 90 more damage.'
    }
  ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '29';

  public name: string = 'Chi-Yu';

  public fullName: string = 'Chi-Yu PAR';

  public readonly RETALIATE_MARKER = 'RETALIATE_MARKER';

  // public damageDealt = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.RETALIATE_MARKER);
    }

    // if (effect instanceof DealDamageEffect || effect instanceof PutDamageEffect) {
    //   const player = StateUtils.getOpponent(state, effect.player);
    //   const cardList = StateUtils.findCardList(state, this);
    //   const owner = StateUtils.findOwner(state, cardList);

    //   if (player !== owner) {
    //     this.damageDealt = true;
    //   }
    // }

    // if (effect instanceof EndTurnEffect && effect.player === StateUtils.getOpponent(state, effect.player)) {
    //   const cardList = StateUtils.findCardList(state, this);
    //   const owner = StateUtils.findOwner(state, cardList);

    //   if (owner === effect.player) {
    //     this.damageDealt = false;
    //   }
    // }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      // this.damageDealt = false;

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.FIRE);
      });
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { allowCancel: false, min: 1, max: 2 }
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }
      });

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.RETALIATE_MARKER)) {
        effect.damage += 90;
      }
    }

    if (effect instanceof KnockOutEffect && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner === player) {
        effect.player.marker.addMarkerToState(this.RETALIATE_MARKER);
      }
      return state;
    }

    return state;
  }
}