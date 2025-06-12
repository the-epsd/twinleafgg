import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils, PlayerType, Card } from '../../game';
import { CheckProvidedEnergyEffect, CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Wobbuffet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Stages of Evolution',
    powerType: PowerType.POKEBODY,
    text: 'As long as Wobbuffet is an Evolved Pokémon, your opponent pays [C] more to retreat his or her Active Pokémon.'
  }];

  public attacks = [{
    name: 'Grind',
    cost: [C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Does 10 damage times the amount of Energy attached to Wobbuffet.'
  },
  {
    name: 'Shadow Tag',
    cost: [P, P, C],
    damage: 0,
    text: 'Put 7 damage counters on the Defending Pokémon at the end of your opponent\'s next turn.'
  }];

  public set: string = 'LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Wobbuffet';
  public fullName: string = 'Wobbuffet LM';

  public readonly KNOCKOUT_MARKER = 'KNOCKOUT_MARKER';
  public readonly CLEAR_KNOCKOUT_MARKER = 'CLEAR_KNOCKOUT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isWobbuffetInPlay = false;

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this && cardList.getPokemons().length > 1) {
          isWobbuffetInPlay = true;
        }
      });

      if (!isWobbuffetInPlay) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const pokemonCard = opponent.active.getPokemonCard();

      if (pokemonCard) {
        effect.cost.push(CardType.COLORLESS);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.getPokemonCard() === this) {
          const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
          store.reduceEffect(state, checkProvidedEnergy);

          const blockedCards: Card[] = [];

          checkProvidedEnergy.energyMap.forEach(em => {
            if (!em.provides.includes(CardType.ANY)) {
              blockedCards.push(em.card);
            }
          });

          const damagePerEnergy = 10;
          effect.damage = checkProvidedEnergy.energyMap.length * damagePerEnergy;
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      effect.player.marker.addMarker(this.KNOCKOUT_MARKER, this);
      opponent.active.marker.addMarker(this.CLEAR_KNOCKOUT_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.active.marker.hasMarker(this.CLEAR_KNOCKOUT_MARKER, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      effect.player.active.damage += 70;
      effect.player.active.marker.removeMarker(this.CLEAR_KNOCKOUT_MARKER, this);
      opponent.marker.removeMarker(this.KNOCKOUT_MARKER, this);
    }

    return state;
  }
}

