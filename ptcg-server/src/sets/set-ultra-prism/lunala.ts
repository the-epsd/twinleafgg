import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType, GameMessage, AttachEnergyPrompt, SlotType, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Lunala extends PokemonCard {
  public tags = [CardTag.PRISM_STAR];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 160;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Full Moon Star',
      cost: [P],
      damage: 0,
      text: 'For each of your opponent\'s Pokémon in play, attach a [P] Energy card from your discard pile to your Pokémon in any way you like.'
    },
    {
      name: 'Psystorm',
      cost: [P, P, P, P],
      damage: 20,
      damageCalculation: 'x' as 'x',
      text: 'This attack does 20 damage times the amount of Energy attached to all Pokémon.'
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '62';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lunala \u25c7';
  public fullName: string = 'Lunala \u25c7 UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Full Moon Star
    // Ref: set-noble-victories/eelektrik.ts (Dynamotor - attach energy from discard)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Count opponent's Pokemon in play
      let opponentPokemonCount = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, () => {
        opponentPokemonCount++;
      });

      // Count available [P] Energy in discard
      const psychicEnergyCount = player.discard.cards.filter(c =>
        c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.provides.includes(CardType.PSYCHIC)
      ).length;

      const maxAttach = Math.min(opponentPokemonCount, psychicEnergyCount);

      if (maxAttach === 0) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Psychic Energy' },
        { min: 0, max: maxAttach, allowCancel: false }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }
      });
    }

    // Attack 2: Psystorm
    // Ref: set-guardians-rising/honchkrow.ts (Raven's Claw - counting across all Pokemon)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let totalEnergy = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        totalEnergy += cardList.cards.filter(c => c instanceof EnergyCard).length;
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        totalEnergy += cardList.cards.filter(c => c instanceof EnergyCard).length;
      });

      effect.damage = 20 * totalEnergy;
    }

    return state;
  }
}
