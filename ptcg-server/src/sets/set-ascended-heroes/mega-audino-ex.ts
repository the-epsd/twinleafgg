import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, CoinFlipPrompt, GameMessage, AttachEnergyPrompt, PlayerType, SlotType, SuperType, EnergyType, StateUtils } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { WAS_ATTACK_USED, SHUFFLE_DECK } from "../../game/store/prefabs/prefabs";

export class MegaAudinoex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = C;
  public hp: number = 270;
  public weakness = [{ type: F }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Kaleidowaltz',
    cost: [C],
    damage: 0,
    text: 'Flip 3 coins. For each heads, search your deck for 2 Basic Energy cards and attach them to your Pokemon in any way you like. Then, shuffle your deck.'
  },
  {
    name: 'Ear Force',
    cost: [C, C, C],
    damage: 20,
    damageCalculation: '+',
    text: 'This attack does 80 more damage for each Energy attached to your opponent\'s Active Pokemon.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '172';
  public name: string = 'Mega Audino ex';
  public fullName: string = 'Mega Audino ex MC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Kaleidowaltz attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const coinFlips: CoinFlipPrompt[] = [
        new CoinFlipPrompt(player.id, GameMessage.FLIP_COIN),
        new CoinFlipPrompt(player.id, GameMessage.FLIP_COIN),
        new CoinFlipPrompt(player.id, GameMessage.FLIP_COIN)
      ];

      return store.prompt(state, coinFlips, results => {
        const headsCount = Array.isArray(results) ? results.filter(r => r === true).length : (results === true ? 1 : 0);
        const energyToAttach = headsCount * 2;

        if (energyToAttach > 0) {
          return store.prompt(state, new AttachEnergyPrompt(
            player.id,
            GameMessage.ATTACH_ENERGY_CARDS,
            player.deck,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
            { allowCancel: false, min: 0, max: energyToAttach }
          ), transfers => {
            transfers = transfers || [];
            if (transfers.length > 0) {
              for (const transfer of transfers) {
                const target = StateUtils.getTarget(state, player, transfer.to);
                player.deck.moveCardTo(transfer.card, target);
              }
            }
            SHUFFLE_DECK(store, state, player);
          });
        } else {
          SHUFFLE_DECK(store, state, player);
        }
      });
    }

    // Ear Force attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const energyCount = opponent.active.energies.cards.filter(card =>
        card.superType === SuperType.ENERGY
      ).length;

      effect.damage = 20 + (80 * energyCount);
    }

    return state;
  }
}