import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { GameError, GameMessage, GamePhase, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class MegaSableyeTyranitarGX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TAG_TEAM];
  public cardType: CardType = D;
  public hp: number = 280;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Greedy Crush',
      cost: [D, D, D, D, C],
      damage: 210,
      text: 'If your opponent\'s Pokémon-GX or Pokémon-EX is Knocked Out by damage from this attack, take 1 more Prize card.'
    },
    {
      name: 'Gigafall-GX',
      cost: [D, D, D, D, C],
      damage: 250,
      text: 'If this Pokémon has at least 5 extra Energy attached to it (in addition to this attack\'s cost), discard the top 15 cards of your opponent\'s deck. (You can\'t use more than 1 GX attack in a game.)'
    },
  ];

  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '126';
  public name: string = 'Mega Sableye & Tyranitar-GX';
  public fullName: string = 'Mega Sableye & Tyranitar-GX UNM';

  private usedGreedyCrush = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Greedy Crush (thank god for iron hands)
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      this.usedGreedyCrush = true;
    }

    // Gigafall-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      this.usedGreedyCrush = false;

      if (player.usedGX) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      player.usedGX = true;

      // Check for the extra energy cost.
      const extraEffectCost: CardType[] = [D, D, D, D, C, C, C, C, C, C];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (!meetsExtraEffectCost) { return state; }  // If we don't have the extra energy, we just deal damage.
      // activate the millworks
      opponent.deck.moveTo(opponent.discard, 15);
    }

    // the prize taking effect
    if (effect instanceof KnockOutEffect && effect.target === effect.player.active) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!this.usedGreedyCrush) {
        return state;
      }

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      // this isn't attacking
      const pokemonCard = opponent.active.getPokemonCard();
      if (pokemonCard !== this) {
        return state;
      }

      // Check if the attack that caused the KnockOutEffect is "Greedy Crush"
      if (this.usedGreedyCrush === true
        && (effect.player.active.getPokemonCard()?.tags.includes(CardTag.POKEMON_GX) || effect.player.active.getPokemonCard()?.tags.includes(CardTag.POKEMON_EX))) {
        if (effect.prizeCount > 0) {
          effect.prizeCount += 1;
          this.usedGreedyCrush = false;
        }
      }

      return state;
    }

    return state;
  }
}
