import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, PlayerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { PowerEffect } from '../../../game/store/effects/game-effects';
import {
  COPY_ATTACK_FROM_POKEMON_LIST,
  buildAttackListWithEnergyBlocking,
} from '../../../game/store/prefabs/copy-attack-prefabs';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Kecleon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Color Change',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is your Active Pokémon, this Pokémon is the same type as the your opponent\'s Active Pokémon.'
  }];

  public attacks = [
    {
      name: 'Imittack',
      cost: [C],
      damage: 0,
      copycatAttack: true,
      text: 'Choose 1 of the Defending Pokémon\'s attacks. If this Pokémon has the necessary Energy to use that attack, use it as this attack.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '94';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Kecleon';
  public fullName: string = 'Kecleon PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckPokemonTypeEffect && effect.target.getPokemonCard() === this) {
      let owner: any = null;
      state.players.forEach(p => {
        p.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
          if (cardList === effect.target) {
            owner = p;
          }
        });
      });

      if (!owner) { return state; }

      if (owner.active !== effect.target) { return state; }

      try {
        const stub = new PowerEffect(owner, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, owner);
      const opponentCard = opponent.active.getPokemonCard();
      if (opponentCard) {
        const opponentTypeCheck = new CheckPokemonTypeEffect(opponent.active);
        store.reduceEffect(state, opponentTypeCheck);

        effect.cardTypes = [...opponentTypeCheck.cardTypes];
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentCard = opponent.active.getPokemonCard();

      if (!opponentCard || opponentCard.attacks.length === 0) {
        return state;
      }

      const { pokemonCards, blocked } = buildAttackListWithEnergyBlocking(state, store, player, {
        extraCards: [opponentCard],
      });

      if (pokemonCards.length === 0) {
        return state;
      }

      const allBlocked = opponentCard.attacks.every(attack =>
        blocked.some(b => b.index === 0 && b.attack === attack.name)
      );

      if (allBlocked) {
        return state;
      }

      return COPY_ATTACK_FROM_POKEMON_LIST(store, state, effect, pokemonCards, {
        allowCancel: false,
        blocked,
      });
    }

    return state;
  }
}
