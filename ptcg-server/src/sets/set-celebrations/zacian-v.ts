import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, AttachEnergyPrompt, GameMessage, PlayerType, ShuffleDeckPrompt, SlotType, StateUtils } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class ZacianV extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_V];
  public cardType: CardType = P;
  public hp: number = 220;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public powers = [{
    name: 'Roar of the Sword',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may search your deck for a [P] Energy card and attach it to 1 of your Pokémon. Then, shuffle your deck. If you use this Ability, your turn ends.'
  }];

  public attacks = [
    {
      name: 'Storm Slash',
      cost: [C, C, C],
      damage: 60,
      text: 'This attack does 30 more damage for each [P] Energy attached to this Pokémon.'
    }
  ];

  public regulationMark = 'E';
  public set: string = 'CEL';
  public setNumber: string = '16';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zacian V';
  public fullName: string = 'Zacian V CEL';

  public readonly RUSH_IN_MARKER = 'RUSH_IN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Psychic Energy' },
        { allowCancel: true, min: 0, max: 1 },
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          SHUFFLE_DECK(store, state, player);
          return state;
        }
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.deck, target, { cards: [transfer.card], sourceCard: this, sourceEffect: this.powers[0] });
        }
        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });

      const endTurnEffect = new EndTurnEffect(player);
      store.reduceEffect(state, endTurnEffect);
      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.PSYCHIC;
        }).length;
      });
      effect.damage += energyCount * 30;
    }
    return state;
  }

}
