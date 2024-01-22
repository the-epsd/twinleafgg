import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { PokemonCard, AttachEnergyPrompt, PlayerType, SlotType } from '../../game';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';

export class MagmaBasin extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public regulationMark = 'F';

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '144';

  public name: string = 'Magma Basin';

  public fullName: string = 'Magma Basin BRS';

  public text: string =
    'Once during each player\'s turn, that player may attach a [R] Energy card from their discard pile to 1 of their Benched [R] Pokémon. If a player attached Energy to a Pokémon in this way, put 2 damage counters on that Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {

      const player = effect.player;

      const blocked: number[] = [];
      player.bench.forEach((card, index) => {
        if (card instanceof PokemonCard && card.cardType === CardType.FIRE) {
          blocked.push(index);
        }
      });

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH ],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Basic Fire Energy' },
        { allowCancel: false, min: 1, max: 1 },
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return state;
        }
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const pokemonCard = target.cards[0] as PokemonCard;
          if (pokemonCard.cardType !== CardType.PSYCHIC) {
            throw new GameError(GameMessage.INVALID_TARGET);
          }
          player.discard.moveCardTo(transfer.card, target);
          target.damage += 20;
        }

        return state;
      });
      return state;
    }
    return state;
  }
}