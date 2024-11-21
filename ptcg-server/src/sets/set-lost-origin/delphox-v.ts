import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { Card, ChooseEnergyPrompt, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { LostZoneCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class DelphoxV extends PokemonCard {

  public stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_V];

  public cardType = CardType.FIRE;

  public hp = 210;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Eerie Glow',
      cost: [CardType.FIRE],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Burned and Confused.'
    },
    {
      name: 'Magical Fire',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
      damage: 120,
      text: 'Put 2 Energy attached to this Pokémon in the Lost Zone. This attack also does 120 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'LOR';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '27';

  public name: string = 'Delphox V';

  public fullName: string = 'Delphox V LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const active = opponent.active;
      active.addSpecialCondition(SpecialCondition.BURNED);
      active.addSpecialCondition(SpecialCondition.CONFUSED);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      return store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS, CardType.COLORLESS],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const lostZoneEnergy = new LostZoneCardsEffect(effect, cards);
        lostZoneEnergy.target = player.active;
        store.reduceEffect(state, lostZoneEnergy);


        const hasBenched = opponent.bench.some(b => b.cards.length > 0);
        if (!hasBenched) {
          return state;
        }

        // Prompt to choose benched pokemon
        const max = Math.min(1);
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { min: max, max, allowCancel: false }
        ), selected => {
          const targets = selected || [];
          targets.forEach(target => {
            const damageEffect = new PutDamageEffect(effect, 120);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
          });
          return state;
        });
      });
    }
    return state;
  }
}