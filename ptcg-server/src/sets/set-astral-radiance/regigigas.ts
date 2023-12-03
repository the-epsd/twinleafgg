import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, EnergyCard, AttachEnergyPrompt, GameError, GameMessage, SlotType, StateUtils, ChoosePokemonPrompt } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Regigigas extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 150;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Ancient Wisdom',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if you have Regirock, Regice, Registeel, Regieleki, and Regidrago in play, you may attach up to 3 Energy cards from your discard pile to 1 of your Pokémon.'
  }];

  public attacks = [{
    name: 'Gigaton Break',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 150,
    text: 'If your opponent\'s Active Pokémon is a Pokémon VMAX, this attack does 150 more damage.'
  }];

  public regulationMark = 'F';

  public set: string = 'ASR';

  public set2: string = 'astralradiance';

  public setNumber: string = '130';

  public name: string = 'Regigigas';

  public fullName: string = 'Regigigas ASR';

  public readonly ANCIENT_WISDOM_MARKER = 'ANCIENT_WISDOM_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.ANCIENT_WISDOM_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      // Check if player has Regirock, Regice, Registeel, Regieleki, and Regidrago in play
      const player = effect.player;
      let hasRegirock = false;
      let hasRegice = false;
      let hasRegisteel = false;
      let hasRegieleki = false;
      let hasRegidrago = false;
      let hasRegis = false;

      if (!hasRegis) {
        GameMessage.CANNOT_USE_POWER;
        return state;
      }

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Regirock') {
          hasRegirock = true;
        }
        if (card.name === 'Regice') {
          hasRegice = true;
        }
        if (card.name === 'Registeel') {
          hasRegisteel = true;
        }
        if (card.name === 'Regieleki') {
          hasRegieleki = true;
        }
        if (card.name === 'Regidrago') {
          hasRegidrago = true;
        }

        if (hasRegirock && hasRegice && hasRegisteel && hasRegieleki && hasRegidrago) {
          hasRegis = true;
        }

        if (hasRegis) {

          // Check if player has energy cards in discard pile
          const hasEnergy = player.discard.cards.some(c => c instanceof EnergyCard);
          if (!hasEnergy) {
            return state;
          }
          if (player.marker.hasMarker(this.ANCIENT_WISDOM_MARKER, this)) {
            throw new GameError(GameMessage.POWER_ALREADY_USED);
          }

          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.ATTACH_ENERGY_TO_BENCH,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH, SlotType.ACTIVE],
            { min: 0, max: 1, allowCancel: true }
          ), chosen => {

            chosen.forEach(target => {

              state = store.prompt(state, new AttachEnergyPrompt(
                player.id,
                GameMessage.ATTACH_ENERGY_TO_BENCH,
                player.discard,
                PlayerType.BOTTOM_PLAYER,
                [chosen as unknown as SlotType],
                { superType: SuperType.ENERGY },
                { allowCancel: true, min: 0, max: 3 }
              ), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                  return;
                }
                player.marker.addMarker(this.ANCIENT_WISDOM_MARKER, this);
                for (const transfer of transfers) {
                  const target = StateUtils.getTarget(state, player, transfer.to);
                  player.discard.moveCardTo(transfer.card, target);
                }
                return state;
              });

              if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
                const player = effect.player;
                const opponent = StateUtils.getOpponent(state, player);
                const activePokemon = opponent.active.cards[0];
                if (activePokemon && activePokemon.tags.includes(CardTag.POKEMON_VMAX)) {
                  effect.damage += 150;
                  return state;
                }
                if (effect instanceof EndTurnEffect) {
                  effect.player.marker.removeMarker(this.ANCIENT_WISDOM_MARKER, this);
                }
                return state;
              }
            });
          });
        }
      });
    }
    return state;
  }
}