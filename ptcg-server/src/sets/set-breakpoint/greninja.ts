import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, PlayerType, GameError, StateUtils, ConfirmPrompt, ChooseEnergyPrompt, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class GreninjaBKP extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Frogadier';

  public cardType: CardType = CardType.WATER;

  public hp: number = 130;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [];

  public attacks = [
    {
      name: 'Shadow Stitching',
      cost: [CardType.COLORLESS],
      damage: 40,
      text: 'Until the end of your opponent\'s next turn, each Pokémon your opponent has in play, in his or her hand, and in his or her discard pile has no Abilities. (This includes cards that come into play on that turn.)'
    },
    {
      name: 'Moonlight Slash',
      cost: [CardType.WATER],
      damage: 60,
      text: ' You may return a [W] Energy from this Pokémon to your hand. If you do, this attack does 20 more damage.'
    },
  ];

  public set: string = 'BKP';

  public setNumber = '40';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Greninja';

  public fullName: string = 'Greninja BKP';

  // ability locking gaming
  public readonly SHADOW_STITCHING_MARKER = 'SHADOW_STITCHING_MARKER';
  public readonly CLEAR_SHADOW_STITCHING_MARKER = 'CLEAR_SHADOW_STITCHING_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.SHADOW_STITCHING_MARKER, this);
    }

    // Shadow Stitching
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.active.marker.addMarker(this.SHADOW_STITCHING_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_SHADOW_STITCHING_MARKER, this);
    }

    // Mist Slash
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
          state = store.reduceEffect(state, checkProvidedEnergy);


          state = store.prompt(state, new ChooseEnergyPrompt(
            player.id,
            GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
            checkProvidedEnergy.energyMap,
            [CardType.WATER],
            { allowCancel: false }
          ), energy => {
            const cards: Card[] = (energy || []).map(e => e.card);
            player.active.moveCardsTo(cards, player.hand);
            effect.damage += 20;
          });

        }
      });
    }

    // the shadow ability blocking
    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY) {
      const player = effect.player;

      if (!player.marker.hasMarker(this.CLEAR_SHADOW_STITCHING_MARKER, this)) {
        return state;
      }

      // checking if the effect is one you own
      let doesPlayerOwn = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          doesPlayerOwn = true;
        }
      });
      if (doesPlayerOwn) {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }

    // wow ability locking off an attack is actually pretty difficult
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_SHADOW_STITCHING_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_SHADOW_STITCHING_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.SHADOW_STITCHING_MARKER, this);
      });
    }

    return state;
  }
}