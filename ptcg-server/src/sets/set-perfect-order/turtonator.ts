import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils, ChooseCardsPrompt, GameMessage, SuperType, GamePhase } from "../../game";
import { PutDamageEffect, DiscardCardsEffect } from "../../game/store/effects/attack-effects";
import { Effect } from "../../game/store/effects/effect";
import { PowerEffect, AttackEffect } from "../../game/store/effects/game-effects";
import { CoinFlipEffect } from "../../game/store/effects/play-card-effects";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Turtonator extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 120;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public powers = [{
    name: 'Thorny Shell',
    powerType: PowerType.ABILITY,
    text: 'When this Pokemon takes damage from an attack from your opponent\'s Pokemon while it is in the Active Spot, discard an Energy from the attacking Pokemon.'
  }];

  public attacks = [{
    name: 'Heat Breath',
    cost: [R, R, C],
    damage: 80,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 80 more damage.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';
  public name: string = 'Turtonator';
  public fullName: string = 'Turtonator M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Thorny Shell ability - discard energy from attacking Pokemon when this takes damage
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source?.getPokemonCard();

      if (pokemonCard !== this) {
        return state;
      }

      // Check if this Pokemon is in Active Spot
      const player = StateUtils.findOwner(state, effect.target);
      if (player.active !== effect.target) {
        return state;
      }

      // Check if damage was dealt from opponent's attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const sourceOwner = effect.source ? StateUtils.findOwner(state, effect.source) : null;
      const opponent = StateUtils.getOpponent(state, player);

      // Only trigger from opponent's attacks
      if (sourceOwner !== opponent) {
        return state;
      }

      // Check if player has DAMAGE_DEALT_MARKER (damage was actually dealt)
      if (!player.marker.hasMarker(player.DAMAGE_DEALT_MARKER)) {
        return state;
      }

      if (sourceCard && effect.source && effect.source.energies.cards.length > 0) {
        // Try to reduce PowerEffect to check if ability is blocked
        try {
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }

        // Discard one energy from attacking Pokemon
        return store.prompt(state, new ChooseCardsPrompt(
          opponent,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          effect.source,
          { superType: SuperType.ENERGY },
          { min: 1, max: 1, allowCancel: false }
        ), selected => {
          const cards = selected || [];
          if (cards.length > 0) {
            const discardEffect = new DiscardCardsEffect(effect as any, cards);
            discardEffect.target = effect.source;
            store.reduceEffect(state, discardEffect);
          }
        });
      }
    }

    // Heat Breath - coin flip for +80 damage
    if (WAS_ATTACK_USED(effect, 0, this) && effect instanceof AttackEffect) {
      const player = effect.player;

      const coinFlipEffect = new CoinFlipEffect(player, (result: boolean) => {
        if (result === true) {
          effect.damage += 80;
        }
      });

      return store.reduceEffect(state, coinFlipEffect);
    }

    return state;
  }
}
