import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, StateUtils, ChooseEnergyPrompt, GameMessage, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';

export class Flygon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Vibrava';
  public cardType: CardType = N;
  public hp: number = 140;
  public weakness = [{ type: N }];
  public retreat = [C];

  public powers = [{
    name: 'Sand Slammer',
    powerType: PowerType.ABILITY,
    text: 'At any time between turns, if this Pokémon is your Active Pokémon, put 1 damage counter on each of your opponent\'s Pokémon.'
  }];

  public attacks = [{
    name: 'Flying Beatdown',
    cost: [G, F, C, C],
    damage: 80,
    text: 'You may discard a [G] Energy and a [F] Energy attached to this Pokémon. If you do, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'BCR';
  public setNumber: string = '99';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Flygon';
  public fullName: string = 'Flygon BCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Sand Damage
    if (effect instanceof BetweenTurnsEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const damageEffect = new EffectOfAbilityEffect(player, this.powers[0], this, cardList);
        store.reduceEffect(state, damageEffect);
        if (damageEffect.target) {
          damageEffect.target.damage += 10;
        }
      });
    }

    // Flying Beatdown
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
          state = store.reduceEffect(state, checkProvidedEnergy);

          state = store.prompt(state, new ChooseEnergyPrompt(
            player.id,
            GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
            checkProvidedEnergy.energyMap,
            [CardType.GRASS, CardType.FIGHTING],
            { allowCancel: false }
          ), energy => {
            const cards: Card[] = (energy || []).map(e => e.card);
            const discardEnergy = new DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
          });

          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      }, GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
    }

    return state;
  }
} 