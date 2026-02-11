import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, GameMessage, PlayerType, StateUtils, ConfirmPrompt, ChooseEnergyPrompt, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../game/store/prefabs/attack-effects';

export class Volcarona extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Larvesta';
  public cardType: CardType = R;
  public hp: number = 110;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Scorching Scales',
    powerType: PowerType.ABILITY,
    text: 'Put 4 damage counters instead of 2 on your opponent\'s Burned Pokémon between turns.'
  }];

  public attacks = [
    {
      name: 'Burning Wind',
      cost: [R, C, C],
      damage: 70,
      text: 'You may discard an Energy attached to this Pokémon. If you do, the Defending Pokémon is now Burned.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '22';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Volcarona';
  public fullName: string = 'Volcarona DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Scorching Scales - increase burn damage
    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Find which player owns this Volcarona
      let volcaronaOwner: typeof player | null = null;
      [player, opponent].forEach(p => {
        p.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (card === this) {
            volcaronaOwner = p;
          }
        });
      });

      if (!volcaronaOwner) {
        return state;
      }

      // Check if ability is blocked
      try {
        const stub = new PowerEffect(volcaronaOwner, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      // Apply extra burn damage to opponent's active if burned
      const volcaronaOpponent = StateUtils.getOpponent(state, volcaronaOwner);
      if (effect.player === volcaronaOpponent && volcaronaOpponent.active.specialConditions.includes(SpecialCondition.BURNED)) {
        // Default burn is 20 (2 damage counters), we want 40 (4 damage counters)
        // So add 20 more damage
        effect.burnDamage += 20;
      }
    }

    // Burning Wind
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      state = store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY
      ), wantToDiscard => {
        if (!wantToDiscard) {
          return;
        }

        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
        store.reduceEffect(state, checkProvidedEnergy);

        store.prompt(state, new ChooseEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          checkProvidedEnergy.energyMap,
          [CardType.COLORLESS],
          { allowCancel: false }
        ), energy => {
          const cards: Card[] = (energy || []).map(e => e.card);

          if (cards.length === 0) {
            return;
          }

          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);

          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
        });
      });
    }

    return state;
  }
}
