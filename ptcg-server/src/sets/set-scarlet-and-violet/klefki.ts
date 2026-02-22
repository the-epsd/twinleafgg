import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { GameError, GameMessage, PokemonCardList, StateUtils } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

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
    abilityLock: true,
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

    if (effect instanceof CheckPokemonPowersEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Klefki is not active Pokemon
      if (player.active.getPokemonCard() !== this
        && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      // Get the target Pokemon card
      const targetPokemon = effect.target;
      if (!targetPokemon) {
        return state;
      }

      // only remove abilities from Pokemon in play
      const targetCardList = StateUtils.findCardList(state, targetPokemon);
      if (!(targetCardList instanceof PokemonCardList)) {
        return state;
      }

      // We are not removing abilities from Non-Basic Pokemon
      if (targetPokemon.stage !== Stage.BASIC) {
        return state;
      }

      // Filter out abilities (except Mischievous Lock) from Basic Pokemon
      effect.powers = effect.powers.filter(power =>
        power.powerType !== PowerType.ABILITY || power.name === 'Mischievous Lock'
      );
    }

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY && effect.power.name !== 'Mischievous Lock') {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Klefki is not active Pokemon
      if (player.active.getPokemonCard() !== this
        && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      // We are not blocking the Abilities from Non-Basic Pokemon
      if (effect.card.stage !== Stage.BASIC) {
        return state;
      }

      // Try reducing ability for each player  
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }
      if (!effect.power.exemptFromAbilityLock) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Discard active Pokemon's tool first
      const activePokemon = opponent.active;
      if (activePokemon.tools.length > 0) {
        activePokemon.moveCardsTo([...activePokemon.tools], opponent.discard);
      }

      // Then deal damage
      effect.damage = 10;

      return state;

    }

    return state;
  }
}