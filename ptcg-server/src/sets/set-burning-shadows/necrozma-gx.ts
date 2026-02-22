import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, PlayerType, GamePhase, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DiscardCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { BLOCK_IF_GX_ATTACK_USED, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

// BUS Necrozma-GX 63 (https://limitlesstcg.com/cards/BUS/63)
export class NecrozmaGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 180;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Light\'s End',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to this Pokémon by attacks from [C] Pokémon.'
  }];

  public attacks = [
    {
      name: 'Prismatic Burst',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 10,
      text: 'Discard all basic [P] Energy from this Pokémon. This attack does 60 more damage for each card you discarded in this way.'
    },

    {
      name: 'Black Ray-GX',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      gxAttack: true,
      text: 'This attack does 100 damage to each of your opponent\'s Pokémon-GX and Pokémon-EX. This damage isn\'t affected by Weakness or Resistance. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'BUS';

  public name: string = 'Necrozma-GX';

  public fullName: string = 'Necrozma-GX BUS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '63';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Light's End
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();

      // It's not this pokemon card
      if (pokemonCard !== this) {
        return state;
      }

      // It's not an attack or a Pokemon that isn't colorless attacks
      if (state.phase !== GamePhase.ATTACK || pokemonCard.cardType !== CardType.COLORLESS) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      effect.preventDefault = true;
    }

    // Prismatic Burst
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const psychicEnergy = player.active.cards.filter(card =>
        card instanceof EnergyCard && card.name === 'Psychic Energy'
      );

      const discardEnergy = new DiscardCardsEffect(effect, psychicEnergy);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);

      effect.damage += psychicEnergy.length * 60;
    }

    // Black Ray-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if player has used GX attack
      BLOCK_IF_GX_ATTACK_USED(player);
      // set GX attack as used for game
      player.usedGX = true;

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card.tags.includes(CardTag.POKEMON_GX) || card.tags.includes(CardTag.POKEMON_EX)) {
          if (cardList === opponent.active) {
            return;
          }
          const damageEffect = new PutDamageEffect(effect, 100);
          damageEffect.target = cardList;
          store.reduceEffect(state, damageEffect);
        }
      });
    }
    return state;
  }
}