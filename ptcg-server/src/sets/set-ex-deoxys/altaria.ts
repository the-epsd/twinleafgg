import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils, PlayerType, CardTag } from '../../game';
import { PutDamageEffect, AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';


export class Altaria extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Swablu';
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 70;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [];
  public powers = [
    {
      name: 'Safeguard',
      powerType: PowerType.POKEBODY,
      text: 'Prevent all effects of attacks, including damage, done to Altaria by your opponent\'s Pokémon-ex.'
    }
  ];
  public attacks = [
    {
      name: 'Double Wing Attack',
      cost: [CardType.LIGHTNING],
      damage: 0,
      text: 'Does 20 damage to each Defending Pokémon.'
    },
    {
      name: 'Dive',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 50,
      text: ''
    }
  ];
  public set: string = 'EX Deoxys';
  public setNumber: string = '1';
  public name: string = 'Altaria';
  public fullName: string = 'Altaria';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Handle 'Double Wing Attack' effect
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const damageEffect = new PutDamageEffect(effect, 20);
        store.reduceEffect(state, damageEffect);
      });
    }
    // Prevent damage from Pokemon-EX
    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      // pokemon is evolved
      if (pokemonCard !== this) {
        return state;
      }

      if (sourceCard && sourceCard.tags.includes(CardTag.POKEMON_ex)) {

        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const player = StateUtils.findOwner(state, effect.target);
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }

        effect.preventDefault = true;
      }
    }

    return state;
  }

}
