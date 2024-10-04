import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, EvolveEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { GameMessage } from '../../game/game-message';
import { PowerType } from '../../game/store/card/pokemon-types';
import { DiscardCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ChooseEnergyPrompt, Card, PlayerType } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class MCharizardEX extends PokemonCard {

  public stage: Stage = Stage.MEGA;

  public tags = [CardTag.POKEMON_EX, CardTag.MEGA];

  public evolvesFrom = 'Charizard EX';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 230;

  public weakness = [{ type: CardType.FAIRY }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Wild Blaze',
      cost: [CardType.FIRE, CardType.FIRE, CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
      damage: 300,
      text: 'Discard the top 5 cards of your deck.'
    }
  ];

  public set: string = 'FLF';

  public name: string = 'M Charizard EX';

  public fullName: string = 'M Charizard EX FLF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '69';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if ((effect instanceof EvolveEffect) && effect.pokemonCard === this) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this && cardList.tool && cardList.tool.name === 'Charizard Spirit Link') {
          return state;
        } else {
          const endTurnEffect = new EndTurnEffect(player);
          store.reduceEffect(state, endTurnEffect);
          return state;
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS, CardType.COLORLESS],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
    }

    // Delta Plus
    if (effect instanceof PutDamageEffect) {
      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (effect.target.cards.includes(this)) {
        const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
        store.reduceEffect(state, checkPokemonType);
        if (checkPokemonType.cardTypes.includes(CardType.GRASS) ||
          checkPokemonType.cardTypes.includes(CardType.FIRE) ||
          checkPokemonType.cardTypes.includes(CardType.WATER) ||
          checkPokemonType.cardTypes.includes(CardType.LIGHTNING)) {
          effect.damage -= 20;
        }

      }
    }


    return state;
  }

}
