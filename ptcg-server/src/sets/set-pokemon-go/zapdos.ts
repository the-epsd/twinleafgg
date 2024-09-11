import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class Zapdos extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 120;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Lightning Symbol',
    powerType: PowerType.ABILITY,
    text: 'Your Basic [L] Pokémon\'s attacks, except any Zapdos, do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Electric Ball',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 110,
      text: ''
    }
  ];

  public regulationMark = 'F';

  public set: string = 'PGO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '29';

  public name: string = 'Zapdos';

  public fullName: string = 'Zapdos PGO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    /*if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const legendaryBird = player.active.getPokemonCard();

      if (legendaryBird && legendaryBird.stage == Stage.BASIC && legendaryBird.cardType == CardType.LIGHTNING) {
        if (effect instanceof DealDamageEffect) {
          if (effect.card.name !== 'Zapdos') {
            // exclude Zapdos
            effect.damage += 10;
          }
        }
      }
    }*/

    if (effect instanceof DealDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

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

      const hasZapdosInPlay = player.bench.some(b => b.cards.includes(this)) || player.active.cards.includes(this);
      let numberOfZapdosInPlay = 0;

      if (hasZapdosInPlay) {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
          if (cardList.cards.includes(this)) {
            numberOfZapdosInPlay++;
          }
        });
      }

      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if (checkPokemonTypeEffect.cardTypes.includes(CardType.LIGHTNING) && effect.target === opponent.active) {
        if (effect.player.active.getPokemonCard()?.name !== 'Zapdos' && effect.player.active.getPokemonCard()?.stage === Stage.BASIC) {
          effect.damage += 10 * numberOfZapdosInPlay;
        }
      }


    }

    return state;
  }
}