import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { AttachEnergyPrompt, EnergyCard, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../../game/store/effects/play-card-effects';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { COIN_FLIP_PROMPT, MOVE_CARDS, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Manaphy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Aqua Skin',
    powerType: PowerType.POKEBODY,
    text: 'When you attach a Water Energy card from your hand to Manaphy, remove 2 damage counters from Manaphy.'
  }];

  public attacks = [{
    name: 'Chase Up',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, search your deck for any 1 card and put it into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Fountain',
    cost: [W, W],
    damage: 30,
    text: 'You may attach up to 2 basic Water Energy cards from your hand to your Benched Pokémon in any way you like.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';
  public name: string = 'Manaphy';
  public fullName: string = 'Manaphy MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Aqua Skin
    if (effect instanceof AttachEnergyEffect && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      if (!player.hand.cards.includes(effect.energyCard)) {
        return state;
      }
      if (
        effect.energyCard.energyType === EnergyType.BASIC &&
        effect.energyCard.provides.includes(CardType.WATER)
      ) {
        const healEffect = new HealEffect(player, effect.target, 20);
        store.reduceEffect(state, healEffect);
      }
    }

    // Chase Up
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, {}, { min: 0, max: 1, allowCancel: true });
        }
      });
    }

    // Fountain
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const hasBasicWater = player.hand.cards.some(
        c => c instanceof EnergyCard &&
          c.energyType === EnergyType.BASIC &&
          c.provides.includes(CardType.WATER),
      );
      if (!hasBasicWater) {
        return state;
      }
      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
        { allowCancel: true, min: 0, max: 2 },
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.hand, target, { cards: [transfer.card], sourceCard: this });
        }
      });
    }

    return state;
  }
}
