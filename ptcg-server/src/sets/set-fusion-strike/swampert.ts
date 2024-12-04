import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType, BoardEffect } from '../../game/store/card/card-types';
import { AttachEnergyPrompt, EnergyCard, GameError, GameMessage, PlayerType, PowerType, SelectPrompt, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttachEnergyEffect, PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Swampert extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = CardType.WATER;
  public hp: number = 170;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Marshtomp';

  public powers = [{
    name: 'Muddy Maker',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may attach a [W] Energy card or a [F] Energy card from your hand to 1 of your Pokémon.'
  }];

  public attacks = [{
    name: 'Earthquake',
    cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
    damage: 180,
    text: 'This attack also does 20 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'FST';
  public regulationMark = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'Swampert';
  public fullName: string = 'Swampert FST';

  public readonly MUDDY_MAKER_MARKER = 'MUDDY_MAKER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList === player.active) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 20);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      });
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      // Check to see if anything is blocking our Ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      // Can't use ability if already used
      if (player.marker.hasMarker(this.MUDDY_MAKER_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const hasEnergyInHand = player.hand.cards.some(c => {
        const isBasicFightingEnergy = c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.name === 'Fightning Energy';
        const isBasicWaterEnergy = c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.name === 'Water Energy';

        return isBasicFightingEnergy || isBasicWaterEnergy;
      });

      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const options: { message: GameMessage, action: () => void }[] = [
        {
          message: GameMessage.WANT_TO_ATTACH_ONLY_WATER_ENERGY,
          action: () => {

            return store.prompt(state, new AttachEnergyPrompt(
              player.id,
              GameMessage.ATTACH_ENERGY_CARDS,
              player.hand,
              PlayerType.BOTTOM_PLAYER,
              [SlotType.BENCH, SlotType.ACTIVE],
              { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
              { allowCancel: true, min: 1, max: 1 }
            ), transfers => {
              transfers = transfers || [];
              for (const transfer of transfers) {
                const target = StateUtils.getTarget(state, player, transfer.to);
                const energyCard = transfer.card as EnergyCard;
                const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
                store.reduceEffect(state, attachEnergyEffect);
              }

              player.marker.addMarker(this.MUDDY_MAKER_MARKER, this);

              player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                  cardList.addBoardEffect(BoardEffect.ABILITY_USED);
                }
              });

            });

          }
        },
        {
          message: GameMessage.WANT_TO_ATTACH_ONLY_FIGHTING_ENERGY,
          action: () => {

            return store.prompt(state, new AttachEnergyPrompt(
              player.id,
              GameMessage.ATTACH_ENERGY_CARDS,
              player.hand,
              PlayerType.BOTTOM_PLAYER,
              [SlotType.BENCH, SlotType.ACTIVE],
              { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fighting Energy' },
              { allowCancel: true, min: 1, max: 1 }
            ), transfers => {
              transfers = transfers || [];
              for (const transfer of transfers) {
                const target = StateUtils.getTarget(state, player, transfer.to);
                const energyCard = transfer.card as EnergyCard;
                const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
                store.reduceEffect(state, attachEnergyEffect);
              }

              player.marker.addMarker(this.MUDDY_MAKER_MARKER, this);

              player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                  cardList.addBoardEffect(BoardEffect.ABILITY_USED);
                }
              });

            });

          }
        }

      ];

      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_OPTION,
        options.map(opt => opt.message),
        { allowCancel: false }
      ), choice => {
        const option = options[choice];
        option.action();
      });
    }

    if (effect instanceof EndTurnEffect) {
      const player = (effect as EndTurnEffect).player;
      player.marker.removeMarker(this.MUDDY_MAKER_MARKER, this);
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      player.marker.removeMarker(this.MUDDY_MAKER_MARKER, this);
      return state;
    }

    return state;
  }
}