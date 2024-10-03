import { PokemonCard, CardType, Stage, PowerType, GameError, GameMessage, PokemonCardList, State, StoreLike, AttachEnergyPrompt, CardTarget, EnergyCard, EnergyType, PlayerType, SlotType, StateUtils, SuperType, SpecialCondition, CardTag } from '../../game';
import { KnockOutOpponentEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class DarkraiGX extends PokemonCard {
  public cardType: CardType = CardType.DARK;
  public tags = [CardTag.POKEMON_GX];
  public stage: Stage = Stage.BASIC;
  public hp: number = 180;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Restoration',
    useFromDiscard: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokémon is in your discard pile, you may put it onto your Bench. Then, attach a [D] Energy card from your discard pile to this Pokémon.'
  }];

  public attacks = [
    {
      name: 'Dark Cleave',
      cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS],
      damage: 130,
      text: 'This attack\'s damage isn\'t affected by Resistance.'
    },
    {
      name: 'Dead End-GX',
      cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS],
      damage: 0,
      gxAttack: true,
      text: 'If your opponent\'s Active Pokémon is affected by a Special Condition, that Pokémon is Knocked Out. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';
  public name: string = 'Darkrai-GX';
  public fullName: string = 'Darkrai-GX BUS';

  public readonly NETHERWORLD_GATE_MARKER = 'NETHERWORLD_GATE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

      console.log('Number of bench slots open: ' + slots.length);
      // Check if card is in the discard
      if (!player.discard.cards.includes(this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Power already used
      if (player.marker.hasMarker(this.NETHERWORLD_GATE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      // No open slots, throw error
      if (slots.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      // Add Marker
      player.marker.addMarker(this.NETHERWORLD_GATE_MARKER, this);

      const cards = player.discard.cards.filter(c => c === this);
      cards.forEach((card, index) => {
        player.discard.moveCardTo(card, slots[index]);
      });

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.DARK);
      });
      if (!hasEnergyInDiscard) {
        return state;
      }

      let hasDarkraiGXOnBench = false;
      const blockedTo: CardTarget[] = [];
      player.bench.forEach((bench, index) => {
        if (bench.cards.length === 0) {
          return;
        }

        const pokemonCard = bench.getPokemonCard();
        if (pokemonCard instanceof DarkraiGX) {
          hasDarkraiGXOnBench = true;
        } else {
          const target: CardTarget = {
            player: PlayerType.BOTTOM_PLAYER,
            slot: SlotType.BENCH,
            index
          };
          blockedTo.push(target);
        }
      });

      if (hasDarkraiGXOnBench) {

        state = store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          player.discard,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Darkness Energy' },
          { allowCancel: false, min: 0, max: 1, blockedTo }
        ), transfers => {
          transfers = transfers || [];

          if (transfers.length === 0) {
            return;
          }

          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            player.discard.moveCardTo(transfer.card, target);
          }

        });
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.ignoreResistance = true;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.usedGX === true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }

      player.usedGX = true;

      const opponentActive = opponent.active;

      if (opponentActive instanceof PokemonCardList) {
        const activePokemon = opponentActive.getPokemonCard();

        if (!activePokemon) {
          return state;
        }

        if (activePokemon) {
          const hasSpecialCondition = opponentActive.specialConditions.some(condition =>
            condition !== SpecialCondition.ABILITY_USED
          );

          if (hasSpecialCondition) {
            opponentActive.specialConditions = opponentActive.specialConditions.filter(condition =>
              condition === SpecialCondition.ABILITY_USED);

            const dealDamage = new KnockOutOpponentEffect(effect, 999);
            dealDamage.target = opponent.active;
            store.reduceEffect(state, dealDamage);
          }
        }
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.NETHERWORLD_GATE_MARKER, this);
    }
    return state;
  }
}