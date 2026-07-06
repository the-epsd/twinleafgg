import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MistysPoliwag extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.MISTYS];
  public cardType: CardType = W;
  public hp: number = 50;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Bubbles',
    cost: [W],
    damage: 20,
    text: 'Flip a coin. If tails, you can\'t use this attack during your next turn.'
  },
  {
    name: 'Amnesia',
    cost: [W, W],
    damage: 0,
    text: 'Choose 1 of the Defending Pokémon\'s attacks.That Pokémon can\'t use that attack during your opponent\'s next turn.'
  }];

  public set: string = 'G2';
  public name: string = 'Misty\'s Poliwag';
  public fullName: string = 'Misty\'s Poliwag G2';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          const player = effect.player;
          if (!player.active.cannotUseAttacksNextTurnPending.includes('Bubbles')) {
            player.active.cannotUseAttacksNextTurnPending.push('Bubbles');
          }
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const pokemonCard = effect.opponent.active.getPokemonCard();

      if (pokemonCard === undefined || pokemonCard.attacks.length === 0 || pokemonCard.stage !== Stage.BASIC) {
        return state;
      }

      return OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
