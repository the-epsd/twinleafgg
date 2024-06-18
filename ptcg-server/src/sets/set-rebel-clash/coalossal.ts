import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SpecialCondition, SuperType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, EnergyCard, GameError, GameMessage, PlayerType, SelectPrompt, AttachEnergyPrompt, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Coalossal extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Carkol';
  public regulationMark: string = 'D';
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 160;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Tar Generator',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may attach a [R] Energy card, a [F] Energy card, or 1 of each from your discard pile to your Pokemon in any way you like.'
  }];

  public attacks = [{
    name: 'Flaming Avalanche',
    cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 130,
    text: ''
  }];

  public set: string = 'RCL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name: string = 'Coalossal';
  public fullName: string = 'Coalossal RCL';

  public readonly TAR_GENERATOR_MARKER = 'TAR_GENERATOR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.TAR_GENERATOR_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && (c.provides.includes(CardType.FIGHTING) || c.provides.includes(CardType.FIRE));
      });

      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.TAR_GENERATOR_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const options: { message: GameMessage, value: number }[] = [
        { message: GameMessage.WANT_TO_ATTACH_ONLY_FIGHTING_ENERGY, value: -1 },
        { message: GameMessage.WANT_TO_ATTACH_ONLY_FIRE_ENERGY, value: 0 },
        { message: GameMessage.WANT_TO_ATTACH_ONE_OF_EACH, value: 1 }
      ];

      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_SPECIAL_CONDITION,
        options.map(c => c.message),
        { allowCancel: false }
      ), choice => {
        const option = options[choice];

        if (option !== undefined) {
          if (option.value === -1) {
            state = store.prompt(state, new AttachEnergyPrompt(
              player.id,
              GameMessage.ATTACH_ENERGY_CARDS,
              player.discard,
              PlayerType.BOTTOM_PLAYER,
              [SlotType.BENCH, SlotType.ACTIVE],
              { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fighting Energy' },
              { allowCancel: false, min: 1, max: 1 }
            ), transfers => {
              transfers = transfers || [];

              player.marker.addMarker(this.TAR_GENERATOR_MARKER, this);
              for (const transfer of transfers) {
                const target = StateUtils.getTarget(state, player, transfer.to);
                player.discard.moveCardTo(transfer.card, target);
              }
            });
          }
          if (option.value === 0) {
            state = store.prompt(state, new AttachEnergyPrompt(
              player.id,
              GameMessage.ATTACH_ENERGY_CARDS,
              player.discard,
              PlayerType.BOTTOM_PLAYER,
              [SlotType.BENCH, SlotType.ACTIVE],
              { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
              { allowCancel: false, min: 1, max: 1 }
            ), transfers => {
              transfers = transfers || [];

              player.marker.addMarker(this.TAR_GENERATOR_MARKER, this);
              for (const transfer of transfers) {
                const target = StateUtils.getTarget(state, player, transfer.to);
                player.discard.moveCardTo(transfer.card, target);
              }
            });
          }

          const blocked: number[] = [];
          player.discard.cards.forEach((card, index) => {
            if(card instanceof EnergyCard && card.energyType === EnergyType.BASIC && !card.provides.includes(CardType.FIGHTING) && !card.provides.includes(CardType.FIRE)) {
              blocked.push(index);
            }
          });

          console.log(blocked);

          if (option.value === 1) {
            state = store.prompt(state, new AttachEnergyPrompt(
              player.id,
              GameMessage.ATTACH_ENERGY_CARDS,
              player.discard,
              PlayerType.BOTTOM_PLAYER,
              [SlotType.BENCH, SlotType.ACTIVE],
              { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
              { allowCancel: false, min: 0, max: 2, blocked}
            ), transfers => {
              transfers = transfers || [];
              for (const transfer of transfers) {

                if (transfers.length > 1) {
                  if (transfers[0].card.name === transfers[1].card.name) {
                    throw new GameError (GameMessage.CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES);  
                  }
                }
                
                const target = StateUtils.getTarget(state, player, transfer.to);
                player.discard.moveCardTo(transfer.card, target); 
              }
            });
          }
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
            if (cardList.getPokemonCard() === this) {
              cardList.addSpecialCondition(SpecialCondition.ABILITY_USED);
            }
          });
        }
      });

    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.TAR_GENERATOR_MARKER, this);
    }
    return state;
  }

}