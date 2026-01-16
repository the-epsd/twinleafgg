import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, AttachEnergyPrompt, PlayerType, SlotType, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { EnergyCard } from '../../game/store/card/energy-card';
import { WAS_ATTACK_USED, ADD_PARALYZED_TO_PLAYER_ACTIVE } from '../../game/store/prefabs/prefabs';
import { SuperType } from '../../game/store/card/card-types';

export class Dedenne extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Tail Generation',
    cost: [L],
    damage: 0,
    text: 'For each Energy attached to all of your opponent\'s Pokemon, you may attach a Basic [L] Energy from your discard pile to your [L] Pokemon in any way you like.'
  },
  {
    name: 'Thunder Shock',
    cost: [L, C],
    damage: 30,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokemon is now Paralyzed.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Dedenne';
  public fullName: string = 'Dedenne M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tail Generation - attach Basic Lightning Energy from discard for each energy on opponent's Pokemon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Count total energies on opponent's Pokemon
      let totalEnergies = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        totalEnergies += cardList.energies.cards.length;
      });

      if (totalEnergies === 0) {
        return state;
      }

      // Count Basic Lightning Energy in discard
      const lightningEnergyInDiscard = player.discard.cards.filter(c =>
        c instanceof EnergyCard &&
        c.energyType === EnergyType.BASIC &&
        c.provides.includes(CardType.LIGHTNING)
      );

      if (lightningEnergyInDiscard.length === 0) {
        return state;
      }

      const maxToAttach = Math.min(totalEnergies, lightningEnergyInDiscard.length);

      // Find Lightning Pokemon to attach to
      const lightningPokemon: any[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        const pokemonCard = cardList.getPokemonCard();
        if (pokemonCard && pokemonCard.cardType === CardType.LIGHTNING) {
          lightningPokemon.push(cardList);
        }
      });

      if (lightningPokemon.length === 0) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, provides: [CardType.LIGHTNING] },
        { allowCancel: false, min: 0, max: maxToAttach }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }
      });
    }

    // Thunder Shock - coin flip for paralysis
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const coinFlipEffect = new CoinFlipEffect(player, (result: boolean) => {
        if (result === true) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, opponent, this);
        }
      });

      return store.reduceEffect(state, coinFlipEffect);
    }

    return state;
  }
}
