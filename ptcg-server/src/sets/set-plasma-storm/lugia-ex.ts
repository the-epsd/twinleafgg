import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { GameMessage, ChooseCardsPrompt } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class LugiaEx extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_EX, CardTag.TEAM_PLASMA];
  public cardType: CardType = C;
  public hp: number = 180;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Overflow',
    powerType: PowerType.ABILITY,
    text: 'If your opponent\'s Pokemon is Knocked Out by damage from an ' +
      'attack of this Pokemon, take 1 more Prize card.'
  }];

  public attacks = [{
    name: 'Plasma Gale',
    cost: [C, C, C, C],
    damage: 120,
    text: 'Discard a Plasma Energy attached to this Pokémon. If you can\'t discard a Plasma Energy, this attack does nothing.'
  }];

  public set: string = 'PLS';

  public name: string = 'Lugia-EX';

  public fullName: string = 'Lugia EX PLS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '108';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const pokemon = player.active;

      const checkEnergy = new CheckProvidedEnergyEffect(player, pokemon);
      store.reduceEffect(state, checkEnergy);

      // Check if there's at least one Plasma Energy attached
      const hasPlasmaEnergy = checkEnergy.energyMap.some(em =>
        em.card.superType === SuperType.ENERGY && em.card.name === 'Plasma Energy'
      );

      // If no Plasma Energy is attached, the attack does nothing
      if (!hasPlasmaEnergy) {
        effect.damage = 0;
        return state;
      }

      // Prompt to discard a Plasma Energy
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.active,
        { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL, name: 'Plasma Energy' },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        if (cards.length === 0) {
          // If no card was selected, the attack does nothing
          effect.damage = 0;
          return;
        }
        // Move the selected Plasma Energy to discard
        player.active.moveCardsTo(cards, player.discard);
      });
    }

    // Overflow
    if (effect instanceof KnockOutEffect && effect.target === effect.player.active) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      // Lugia wasn't attacking
      const pokemonCard = opponent.active.getPokemonCard();
      if (pokemonCard !== this) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }
      if (effect.prizeCount > 0) {
        effect.prizeCount += 1;
        return state;
      }
    }
    return state;
  }
}