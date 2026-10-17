import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { EnergyCard, GameMessage, PowerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON, COIN_FLIP_PROMPT, CONFIRMATION_PROMPT, DAMAGE_OPPONENT_POKEMON, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Infernape extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Monferno';
  public hp: number = 120;
  public cardType: CardType[] = [F];
  public weakness = [{ type: P, value: +30 }];
  public retreat = [];

  public powers = [{
    name: 'Blaze Dance',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), when you play Infernape from your hand to evolve 1 of your Pokémon, you may flip a coin. If heads, search your deck for up to 4 Fire Energy cards and attach them to your Pokémon in any way you like. Shuffle your deck afterward.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Close Combat',
    cost: [C, C],
    damage: 60,
    text: 'During your opponent\'s next turn, any damage done to Infernape by attacks is increased by 30 (after applying Weakness and Resistance).'
  },
  {
    name: 'Spreading Fire',
    cost: [R, R, C, C],
    damage: 80,
    text: 'Discard 2 Fire Energy attached to Infernape and this attack does 20 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Infernape';
  public fullName: string = 'Infernape SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Blaze Dance
    if (JUST_EVOLVED(effect, this) && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, wantToUse => {
        if (!wantToUse) {
          return;
        }
        COIN_FLIP_PROMPT(store, state, effect.player, result => {
          if (!result) {
            return;
          }
          ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON(
            store,
            state,
            effect.player,
            4,
            4,
            { energyFilter: { energyType: EnergyType.BASIC }, validCardTypes: [CardType.FIRE] },
          );
        });
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    // Close Combat
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = -30;
    }

    // Spreading Fire
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const fireEnergy = player.active.cards.filter(c =>
        c.superType === SuperType.ENERGY
        && c.energyType === EnergyType.BASIC
        && (c as EnergyCard).provides.includes(CardType.FIRE),
      );
      const toDiscard = fireEnergy.slice(0, 2);
      if (toDiscard.length >= 2) {
        store.reduceEffect(state, new DiscardCardsEffect(effect, toDiscard));
      }
      const targets = effect.opponent.bench.filter(b => b.cards.length > 0);
      DAMAGE_OPPONENT_POKEMON(store, state, effect, 20, targets);
    }

    return state;
  }
}
