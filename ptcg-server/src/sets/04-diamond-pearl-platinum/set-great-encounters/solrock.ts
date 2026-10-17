import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { AttachEnergyPrompt, EnergyCard, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { IS_POKEBODY_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Solrock extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Sunlight',
    powerType: PowerType.POKEBODY,
    text: 'If you have Lunatone in play, damage done to your opponent\'s Pokémon by your Psychic or Fighting Pokémon isn\'t affected by resistance.'
  }];

  public attacks = [{
    name: 'Sol Charge',
    cost: [F],
    damage: 20,
    text: 'Search your discard pile for a basic Energy card and attach it to 1 of your Benched Pokémon.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public name: string = 'Solrock';
  public fullName: string = 'Solrock GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sunlight
    if (effect instanceof AttackEffect) {
      const player = effect.player;
      let hasSolrock = false;
      let hasLunatone = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_list, card) => {
        if (card === this) {
          hasSolrock = true;
        }
        if (card.name === 'Lunatone') {
          hasLunatone = true;
        }
      });
      if (!hasSolrock || !hasLunatone) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }
      const checkType = new CheckPokemonTypeEffect(effect.source);
      store.reduceEffect(state, checkType);
      if (
        checkType.cardTypes.includes(CardType.PSYCHIC) ||
        checkType.cardTypes.includes(CardType.FIGHTING)
      ) {
        effect.ignoreResistance = true;
      }
    }

    // Sol Charge
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);
      const hasEnergy = player.discard.cards.some(
        c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC
      );
      if (!hasBench || !hasEnergy) {
        return state;
      }
      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: true, min: 0, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.discard, target, {
            cards: [transfer.card],
            sourceCard: this,
            sourceEffect: this.attacks[0],
          });
        }
      });
    }

    return state;
  }
}
