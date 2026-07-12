import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GamePhase } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { KnockOutEffect } from '../../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

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
  private usedDoubleDipFangs = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedDoubleDipFangs = true;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      this.usedDoubleDipFangs = false;
      const player = effect.player;
      const dealDamage = new DealDamageEffect(effect, 30);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    if (effect instanceof KnockOutEffect && effect.target === effect.player.active) {
      const knockedOutOwner = effect.player;
      const attacker = StateUtils.getOpponent(state, knockedOutOwner);

      if (!this.usedDoubleDipFangs) {
        return state;
      }

      // Do not activate between turns, or when it's not attacker's turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== attacker) {
        return state;
      }

      // Stoutland V wasn't attacking.
      if (attacker.active.getPokemonCard() !== this) {
        return state;
      }

      const knockedOutPokemon = knockedOutOwner.active.getPokemonCard();
      if (knockedOutPokemon?.stage === Stage.BASIC && effect.prizeCount > 0) {
        effect.prizeCount += 1;
      }

      this.usedDoubleDipFangs = false;
      return state;
    }
    return state;
  }

}


