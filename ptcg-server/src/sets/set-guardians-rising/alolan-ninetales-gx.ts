import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { ChooseEnergyPrompt } from '../../game';
import { StoreLike, State, GameMessage, PlayerType, SlotType, ChoosePokemonPrompt, Card } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';

import { BLOCK_IF_GX_ATTACK_USED, DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

// GRI Alolan Ninetales-GX 22 (https://limitlesstcg.com/cards/GRI/22)
export class AlolanNinetalesGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Alolan Vulpix';
  public cardType: CardType = CardType.WATER;
  public hp: number = 210;
  public weakness = [{ type: CardType.METAL }];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    {
      name: 'Ice Blade',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 50 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },

    {
      name: 'Blizzard Edge',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 160,
      text: 'Discard 2 Energy from this Pokémon.'
    },

    {
      name: 'Ice Path-GX',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'Move all damage counters from this Pokémon to your opponent\'s Active Pokémon. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];
  public set: string = 'GRI';
  public name: string = 'Alolan Ninetales-GX';
  public fullName: string = 'Alolan Ninetales-GX GRI';
  public setNumber = '22';
  public cardImage = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ice Blade
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 50, targets);
      });
    }

    // Blizzard Edge
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      if (!player.active.cards.some(c => c.superType === SuperType.ENERGY)) {
        return state;
      }

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

    // Ice Path-GX
    if (WAS_ATTACK_USED(effect, 2, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if player has used GX attack
      BLOCK_IF_GX_ATTACK_USED(player);
      // set GX attack as used for game
      player.usedGX = true;

      opponent.active.damage += player.active.damage;
      player.active.damage = 0;
    }
    return state;
  }
} 