import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType, BoardEffect } from '../../game/store/card/card-types';
import { AttachEnergyPrompt, EnergyCard, GameError, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect, PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Hydrappleex extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public tags = [CardTag.POKEMON_ex];
  public regulationMark = 'H';
  public cardType: CardType = CardType.GRASS;
  public weakness = [{ type: CardType.FIRE }];
  public hp: number = 330;
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Dipplin';

  public powers = [{
    name: 'Ripening Charge',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may attach a Basic [G] Energy card from your hand to 1 of your Pokémon. If you attached Energy to a Pokémon in this way, heal 30 damage from that Pokémon.'
  }];

  public attacks = [{
    name: 'Syrup Storm',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 30,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each [G] Energy attached to all of your Pokémon.'
  }];

  public set: string = 'SCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Hydrapple ex';
  public fullName: string = 'Hydrapple ex SV7';

  public readonly RIPE_CHARGE_MARKER = 'RIPE_CHARGE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.RIPE_CHARGE_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.RIPE_CHARGE_MARKER, this);
    }


    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.RIPE_CHARGE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.GRASS);
      });

      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Grass Energy' },
        { min: 1, max: 1, allowCancel: true }
      ), transfers => {
        transfers = transfers || [];

        player.marker.addMarker(this.RIPE_CHARGE_MARKER, this);

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const energyCard = transfer.card as EnergyCard;
          const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
          store.reduceEffect(state, attachEnergyEffect);

          const healEffect = new HealEffect(player, target, 30);
          state = store.reduceEffect(state, healEffect);
          return state;
        }
      });

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let energyCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {

        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergyEffect);

        checkProvidedEnergyEffect.energyMap.forEach(em => {
          energyCount += em.provides.filter(cardType => {
            return cardType === CardType.GRASS || cardType === CardType.ANY;
          }).length;

          console.log('Num grass energies: ' + energyCount);

        });

      });

      effect.damage += energyCount * 30;
      return state;
    }

    return state;
  }

}