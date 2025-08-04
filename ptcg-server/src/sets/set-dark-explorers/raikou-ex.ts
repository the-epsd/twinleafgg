import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, Card, CoinFlipPrompt, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import {
  DiscardCardsEffect, AddSpecialConditionsEffect
} from '../../game/store/effects/attack-effects';
import { GameMessage } from '../../game/game-message';
import { DAMAGE_OPPONENT_POKEMON } from '../../game/store/prefabs/prefabs';


export class RaikouEx extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_EX];
  public cardType: CardType = L;
  public hp: number = 170;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Thunder Fang',
      cost: [L, C],
      damage: 30,
      text: 'Flip a coin. If heads, the Defending Pokemon is now Paralyzed.'
    }, {
      name: 'Volt Bolt',
      cost: [L, L, C],
      damage: 0,
      text: 'Discard all [L] Energy attached to this Pokémon. This attack does 100 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
  ];

  public set: string = 'DEX';
  public setNumber: string = '38';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Raikou EX';
  public fullName: string = 'Raikou EX DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialCondition);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const cards: Card[] = [];
      checkProvidedEnergy.energyMap.forEach(em => {
        if (em.provides.includes(CardType.LIGHTNING) || em.provides.includes(CardType.ANY)) {
          cards.push(em.card);
        }
      });

      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 30, targets);
      });
    }

    return state;
  }

}
