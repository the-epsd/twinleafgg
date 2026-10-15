import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { AttachEnergyPrompt, CardList, ChoosePokemonPrompt, EnergyCard, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../../game/store/effects/play-card-effects';
import { ABILITY_USED, ADD_MARKER, CONFIRMATION_PROMPT, HAS_MARKER, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Raikou extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F, value: +20 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Thunder Rumble',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), when you attach a Lightning Energy card from your hand to Raikou, you may put 1 damage counter on 1 of your opponent\'s Benched Pokémon.'
  }];

  public attacks = [{
    name: 'Thunder Climb',
    cost: [L, L, L],
    damage: 50,
    damageCalculation: '+',
    text: 'Discard 3 cards from the top of your deck. This attack does 50 damage plus 10 more damage for each Lightning Energy card you discarded. Then, attach those Lightning Energy cards to 1 of your Pokémon.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '16';
  public name: string = 'Raikou';
  public fullName: string = 'Raikou SW';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Thunder Rumble
    if (effect instanceof AttachEnergyEffect && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.energyCard.name !== 'Lightning Energy') {
        return state;
      }
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }
      if (HAS_MARKER(this.ABILITY_USED_MARKER, player, this)) {
        return state;
      }

      const hasBench = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }
        ADD_MARKER(this.ABILITY_USED_MARKER, player, this);
        ABILITY_USED(player, this);

        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false }
        ), selected => {
          const target = selected[0];
          store.reduceEffect(
            state,
            new PlaceDamageCountersEffect(player, target, 10, this, this.powers[0]),
          );
        });
      });
    }

    // Thunder Climb
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const cardsToDiscard = Math.min(3, player.deck.cards.length);
      if (cardsToDiscard === 0) {
        return state;
      }

      const discarded = new CardList();
      for (let i = 0; i < cardsToDiscard; i++) {
        MOVE_CARDS(store, state, player.deck, discarded, {
          cards: [player.deck.cards[0]],
          sourceCard: this,
          sourceEffect: effect,
        });
      }

      const lightningEnergy = discarded.cards.filter(c =>
        c instanceof EnergyCard &&
        c.energyType === EnergyType.BASIC &&
        c.provides.includes(CardType.LIGHTNING)
      );
      effect.damage += 10 * lightningEnergy.length;

      const nonLightning = discarded.cards.filter(c => !lightningEnergy.includes(c));
      if (nonLightning.length > 0) {
        MOVE_CARDS(store, state, discarded, player.discard, { cards: nonLightning, sourceCard: this });
      }

      if (lightningEnergy.length === 0) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        discarded,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Lightning Energy' },
        {
          min: lightningEnergy.length,
          max: lightningEnergy.length,
          allowCancel: false,
          sameTarget: true,
        }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, discarded, target, { cards: [transfer.card], sourceCard: this });
        }
        if (discarded.cards.length > 0) {
          MOVE_CARDS(store, state, discarded, player.discard, { cards: discarded.cards.slice(), sourceCard: this });
        }
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
