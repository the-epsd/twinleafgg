import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Toxtricityex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Toxel';
  public cardType: CardType = F;
  public hp: number = 260;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Knocking Hammer',
      cost: [L, L],
      damage: 70,
      text: 'Discard the top card of your opponent\'s deck.'
    },
    {
      name: 'Gaia Punk',
      cost: [L, L, L],
      damage: 270,
      text: 'Discard 3 [L] Energy from your Pokémon.'
    }
  ];

  public set: string = 'PAR';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '100';
  public name: string = 'Toxtricity ex';
  public fullName: string = 'Toxtricity ex PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Knocking Hammer
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MOVE_CARDS(store, state, effect.opponent.deck, effect.opponent.discard, { count: 1, sourceCard: this, sourceEffect: this.attacks[0] });
    }

    // Gaia Punk
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 3, L);
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }
}