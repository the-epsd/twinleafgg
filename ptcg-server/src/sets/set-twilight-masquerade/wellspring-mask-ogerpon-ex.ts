import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { Card, ChooseEnergyPrompt, ChoosePokemonPrompt, ConfirmPrompt, GameMessage, PlayerType, PokemonCard, ShuffleDeckPrompt, SlotType, StateUtils } from '../../game';

import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { WAS_ATTACK_USED, BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';

export class WellspringMaskOgerponex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public regulationMark = 'H';

  public cardType: CardType = CardType.WATER;

  public weakness = [{ type: CardType.LIGHTNING }];

  public hp: number = 210;

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Sob',
      cost: [CardType.COLORLESS],
      damage: 20,
      text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
    },
    {
      name: 'Torrential Pump',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 100,
      text: 'You may shuffle 3 Energy attached to this Pokémon into your Deck. If you do, this attack also does 120 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '64';

  public name: string = 'Wellspring Mask Ogerpon ex';

  public fullName: string = 'Wellspring Mask Ogerpon ex TWM';

  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          state = store.prompt(state, new ChooseEnergyPrompt(
            player.id,
            GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
            checkProvidedEnergy.energyMap,
            [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
            { allowCancel: false }
          ), energy => {
            const cards: Card[] = (energy || []).map(e => e.card);
            cards.forEach((card) => {
              player.active.moveCardTo(card, player.deck);
              return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
              });
            });

            const max = Math.min(1);
            return store.prompt(state, new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
              PlayerType.TOP_PLAYER,
              [SlotType.BENCH],
              { min: 1, max: max, allowCancel: false }
            ), selected => {
              const targets = selected || [];
              targets.forEach(target => {
                const damageEffect = new PutDamageEffect(effect, 120);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
              });
            });
          });
        }
        else {
          effect.damage = 100;
        }
        return state;
      });
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }
}