import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils, GamePhase, CardTag, GameMessage, CoinFlipPrompt } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Ninetales extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Vulpix';
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public powers = [{
    name: 'Safeguard',
    powerType: PowerType.POKEBODY,
    text: 'Prevent all effects of attacks, including damage, done to Ninetales by your opponent\'s Pokémon-ex.'
  }];

  public attacks = [
    {
      name: 'Quick Attack',
      cost: [C, C],
      damage: 20,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 20 damage plus 20 more damage.'
    },
    {
      name: 'Will-o\'-the-wisp',
      cost: [R, C, C],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'HL';
  public setNumber: string = '22';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ninetales';
  public fullName: string = 'Ninetales HL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Prevent damage from Pokemon-ex
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      // Card is not active, or damage source is unknown
      if (pokemonCard !== this || sourceCard === undefined) {
        return state;
      }

      // Do not ignore self-damage from Pokemon-ex
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.findOwner(state, effect.source);
      if (player === opponent) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      if (sourceCard.tags.includes(CardTag.POKEMON_ex)) {
        effect.preventDefault = true;
      }
    }

    // Handle Quick Attack coin flip
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Flip a coin
      state = store.prompt(state, new CoinFlipPrompt(
        player.id,
        GameMessage.FLIP_COIN
      ), result => {
        if (result) {
          effect.damage += 20; // 20 base + 20 for heads
        }
        return state;
      });
    }

    return state;
  }
} 