import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { AttachEnergyPrompt, CardTarget, ChoosePokemonPrompt, EnergyCard, GameError, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';

export class Melony extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '146';

  public regulationMark = 'E';

  public name: string = 'Melony';

  public fullName: string = 'Melony CRE';

  public text: string =
    'Attach a [W] Energy card from your discard pile to 1 of your Pokémon V. If you do, draw 3 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
  
      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
            && c.energyType === EnergyType.BASIC && c.name === 'Water Energy';});
  
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
        
      let pokemonVInPlay = false;
  
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card) => {
        if (card.tags.includes(CardTag.POKEMON_V || CardTag.POKEMON_VSTAR || CardTag.POKEMON_VMAX)) {
          pokemonVInPlay = true;
        }
      });
  
      if (!pokemonVInPlay) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
  
      const blocked2: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (!card.tags.includes(CardTag.POKEMON_V || CardTag.POKEMON_VSTAR || CardTag.POKEMON_VMAX)) {
          blocked2.push(target);
        }
      });
    
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { min: 1, max: 1, blocked: blocked2 }
      ), chosen => {
    
        chosen.forEach(target => {
    
          state = store.prompt(state, new AttachEnergyPrompt(
            player.id,
            GameMessage.ATTACH_ENERGY_CARDS,
            player.discard,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH, SlotType.ACTIVE],
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
            { allowCancel: false, min: 1, max: 1 }
          ), transfers => {
            transfers = transfers || [];
    
            if (transfers.length === 0) {
              return;
            }
    
            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              player.discard.moveCardTo(transfer.card, target);
              player.deck.moveTo(player.hand, 3);
            }
          });
        });
      });
    }
    return state;
  }
}