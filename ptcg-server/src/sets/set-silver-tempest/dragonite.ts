import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType } from '../../game/store/card/card-types';
import {
  StoreLike, State,
  PlayerType, SlotType, GameMessage, ShuffleDeckPrompt, AttachEnergyPrompt, StateUtils
} from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';


export class Dragonite extends PokemonCard {

  public regulationMark = 'F';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Dragonair';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 160;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Dragon Claw',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 80,
      text: ''
    },
    {
      name: 'Energy Hurricane',
      cost: [CardType.WATER, CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 180,
      text: 'Search your deck for up to 3 basic Energy cards and attach them to your Pokémon in any way you like. Then, shuffle your deck.'
    }
  ];

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '131';

  public name: string = 'Dragonite';

  public fullName: string = 'Dragonite SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: true, min: 0, max: 3 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.deck.moveCardTo(transfer.card, target);
        }
      });

      return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);

      });
    }
    return state;
  }
}