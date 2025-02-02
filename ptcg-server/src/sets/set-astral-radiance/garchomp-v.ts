import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, Card, State, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DiscardCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { GameMessage } from '../../game/game-message';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ChooseEnergyPrompt } from '../../game/store/prompts/choose-energy-prompt';

export class GarchompV extends PokemonCard {

  public tags = [CardTag.POKEMON_V];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 200;

  public weakness = [];

  public retreat = [];

  public attacks = [
    {
      name: 'Dragon Claw',
      cost: [CardType.WATER, CardType.FIGHTING, CardType.COLORLESS],
      damage: 120,
      text: ''
    },
    {
      name: 'Sonic Strike',
      cost: [CardType.WATER, CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: 0,
      text: 'Discard 3 Energy from this Pokémon. This attack does 220 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '117';

  public name: string = 'Garchomp V';

  public fullName: string = 'Garchomp V ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
      const max = Math.min(1);
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: max, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 220);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
        return state;
      });
    }
    return state;
  }
}

