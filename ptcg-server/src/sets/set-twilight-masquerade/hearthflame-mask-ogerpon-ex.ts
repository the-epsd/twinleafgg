import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DiscardCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class HearthflameMaskOgerponex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 210;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Wrathful Hearth',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      damageCalculation: 'x',
      text: 'This attack does 20 damage for each damage counter on this Pokémon.'
    },
    {
      name: 'Dynamic Blaze',
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE],
      damage: 140,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon is an Evolution Pokémon, this attack does 140 more damage, and discard all Energy from this Pokémon.'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '40';

  public name: string = 'Hearthflame Mask Ogerpon ex';

  public fullName: string = 'Hearthflame Mask Ogerpon ex TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage = effect.player.active.damage * 20;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!opponent.active.isBasic()) {
        effect.damage += 140;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const cards: Card[] = checkProvidedEnergy.energyMap.map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);

    }

    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      // Target is this Pokemon
      if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
        effect.preventDefault = true;
      }
    }
    return state;
  }
}