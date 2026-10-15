import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ConfirmPrompt, EnergyCard, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardCardsEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { PlaySupporterEffect } from '../../../game/store/effects/play-card-effects';
import { ADD_MARKER, HAS_MARKER, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Ampharos extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Flaaffy';
  public hp: number = 130;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F, value: +30 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Jamming',
    powerType: PowerType.POKEBODY,
    text: 'After your opponent plays a Supporter card from his or her hand, put 1 damage counter on each of your opponent\'s Pokémon. You can\'t use more than 1 Jamming Poké-Body each turn.'
  }];

  public attacks = [{
    name: 'Cluster Bolt',
    cost: [L, C, C],
    damage: 70,
    text: 'You may discard all Lightning Energy attached to Ampharos. If you do, this attack does 20 damage to each of your opponent\'s Benched Pokémon that has any Energy cards attached to it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Ampharos';
  public fullName: string = 'Ampharos SW';

  public readonly JAMMING_MARKER = 'JAMMING_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Jamming
    if (effect instanceof PlaySupporterEffect) {
      const supporterPlayer = effect.player;
      const ampharosOwner = StateUtils.getOpponent(state, supporterPlayer);

      if (HAS_MARKER(this.JAMMING_MARKER, ampharosOwner)) {
        return state;
      }

      let jammingAmpharos: Ampharos | undefined;
      ampharosOwner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card instanceof Ampharos && cardList.getPokemonCard() === card) {
          jammingAmpharos = card;
        }
      });

      if (!jammingAmpharos) {
        return state;
      }

      const sourceAmpharos = jammingAmpharos;
      if (IS_POKEBODY_BLOCKED(store, state, ampharosOwner, sourceAmpharos)) {
        return state;
      }

      ADD_MARKER(this.JAMMING_MARKER, ampharosOwner, sourceAmpharos);

      supporterPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        store.reduceEffect(
          state,
          new PlaceDamageCountersEffect(ampharosOwner, cardList, 10, sourceAmpharos, sourceAmpharos.powers[0]),
        );
      });
    }

    if (effect instanceof EndTurnEffect) {
      state.players.forEach(player => {
        player.marker.removeMarker(this.JAMMING_MARKER);
      });
    }

    // Cluster Bolt
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      const lightningCards = player.active.cards.filter(c =>
        c instanceof EnergyCard && c.provides.includes(CardType.LIGHTNING)
      );

      if (lightningCards.length === 0) {
        return state;
      }

      return store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK,
      ), wantToDiscard => {
        if (!wantToDiscard) {
          return;
        }

        const discardEnergy = new DiscardCardsEffect(effect, lightningCards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);

        opponent.bench.forEach(benchSlot => {
          if (benchSlot.cards.length === 0) {
            return;
          }
          const hasEnergy = benchSlot.cards.some(c => c instanceof EnergyCard)
            || benchSlot.energies.cards.length > 0;
          if (hasEnergy) {
            const damageEffect = new PutDamageEffect(effect, 20);
            damageEffect.target = benchSlot;
            store.reduceEffect(state, damageEffect);
          }
        });
      });
    }

    return state;
  }
}
