import { PokemonCard, Stage, CardType, StoreLike, State, AttachEnergyPrompt, GameMessage, ShuffleDeckPrompt, StateUtils, PlayerType, SlotType, SuperType } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Shaymin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [];

  public attacks = [{
    name: 'Flower Delivery',
    cost: [G],
    damage: 0,
    text: 'Search your deck for an Energy and attach it to 1 of your Benched [G] Pokemon. Then, shuffle your deck.'
  },
  {
    name: 'Leaf Step',
    cost: [G],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Shaymin';
  public fullName: string = 'Shaymin M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Flower Delivery - search deck for Energy, attach to benched Grass Pokemon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Check if there are any benched Grass Pokemon
      const hasGrassBench = player.bench.some(bench => {
        const pokemonCard = bench.getPokemonCard();
        return pokemonCard && pokemonCard.cardType === CardType.GRASS;
      });

      if (!hasGrassBench) {
        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0, max: 1, differentTargets: false }
      ), transfers => {
        transfers = transfers || [];

        // Filter to only allow attaching to Grass Pokemon
        const validTransfers = transfers.filter(transfer => {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const pokemonCard = target.getPokemonCard();
          return pokemonCard && pokemonCard.cardType === CardType.GRASS;
        });

        if (validTransfers.length > 0) {
          for (const transfer of validTransfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            player.deck.moveCardTo(transfer.card, target);
          }
        }

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }

    return state;
  }
}
