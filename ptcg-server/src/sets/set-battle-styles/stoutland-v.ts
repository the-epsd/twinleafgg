import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GamePhase } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class StoutlandV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_V];

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 210;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Double Dip Fangs',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 40,
      text: 'If your opponent\'s Basic Pokémon is Knocked Out by damage from this attack, take 1 more Prize card.'
    },
    {
      name: 'Wild Tackle',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 200,
      text: 'This Pokémon also does 30 damage to itself.'
    }
  ];

  public set: string = 'BST';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '117';

  public name: string = 'Stoutland V';

  public fullName: string = 'Stoutland V BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof KnockOutEffect && effect.target === effect.player.active) {

      const attack = effect.player.active.getPokemonCard()?.attacks[0];
      if (attack) {
        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);

        // Do not activate between turns, or when it's not opponents turn.
        if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
          return state;
        }

        // Iron Hands wasn't attacking
        const pokemonCard = opponent.active.getPokemonCard();
        if (pokemonCard !== this) {
          return state;
        }

        const activePokemon = opponent.active.getPokemonCard();
        if (activePokemon && activePokemon.stage === Stage.BASIC) {
          if (effect.prizeCount > 0) {
            effect.prizeCount += 1;
            return state;
          }
        }

        return state;
      }

      if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
        const player = effect.player;

        const dealDamage = new DealDamageEffect(effect, 30);
        dealDamage.target = player.active;
        return store.reduceEffect(state, dealDamage);
      }


      return state;

    }
    return state;
  }

}


