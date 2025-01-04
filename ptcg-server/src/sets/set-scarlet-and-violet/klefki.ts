import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { GameError, GameMessage, PokemonCardList, StateUtils } from '../../game';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class Klefki extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Mischievous Lock',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, Basic ' +
      'Pokémon in play (both yours and your opponent\'s) have no ' +
      'Abilities, except for Mischievous Lock.'
  }];

  public attacks = [{
    name: 'Joust',
    cost: [CardType.COLORLESS],
    damage: 10,
    text: 'Before doing damage, discard all Pokémon Tools from your opponent\'s Active Pokémon.'
  }];

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '96';

  public name: string = 'Klefki';

  public fullName: string = 'Klefki SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Klefki is not active Pokemon
      if (player.active.getPokemonCard() !== this
        && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, effect.card);
      if (cardList instanceof PokemonCardList) {
        const checkPokemonType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkPokemonType);
      }

      // We are not blocking the Abilities from Non-Basic Pokemon
      if (effect.card.stage !== Stage.BASIC) {
        return state;
      }

      // const pokemonCard = effect.card;

      // Try reducing ability for each player  
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        if (!effect.power.exemptFromAbilityLock) {
          throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
        }
        return state;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Discard active Pokemon's tool first
      const activePokemon = opponent.active;
      if (activePokemon.tool) {
        activePokemon.moveCardTo(activePokemon.tool, opponent.discard);
        activePokemon.tool = undefined;
      }

      // Then deal damage
      effect.damage = 10;

      return state;

    }

    return state;
  }
}