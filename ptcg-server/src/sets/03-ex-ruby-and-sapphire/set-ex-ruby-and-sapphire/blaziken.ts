import { AttachEnergyPrompt, Card, ChooseEnergyPrompt, EnergyCard, GameError, GameMessage, PlayerType, PokemonCardList, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { DealDamageEffect, DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { ABILITY_USED, MOVE_CARDS, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Blaziken extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Combusken';
  public hp: number = 100;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public powers = [{
    name: 'Firestarter',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may attach a [R] Energy card from your discard pile to 1 of your Benched Pokémon. This power can\'t be used if Blaziken is affected by a Special Condition.',
  }];

  public attacks = [{
    name: 'Fire Stream',
    cost: [R, C, C],
    damage: 50,
    text: 'Discard a [R] Energy card attached to Blaziken. If you do, this attack does 10 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)',
  }];

  public set: string = 'RS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Blaziken';
  public fullName: string = 'Blaziken RS';

  public readonly FIRESTARTER_MARKER = 'FIRESTARTER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      REMOVE_MARKER(this.FIRESTARTER_MARKER, effect.player, this);
      return state;
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.FIRESTARTER_MARKER, this);

    // Firestarter
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      if (cardList.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.provides.includes(CardType.FIRE);
      });
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { allowCancel: true, min: 1, max: 1 },
      ), transfers => {
        transfers = transfers || [];
        if (transfers.length === 0) {
          return;
        }

        USE_ABILITY_ONCE_PER_TURN(player, this.FIRESTARTER_MARKER, this);
        ABILITY_USED(player, this);

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.discard, target, { cards: [transfer.card], sourceCard: this });
        }
      });
    }

    // Fire Stream
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      return store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.FIRE],
        { allowCancel: false },
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);

        benched.forEach(target => {
          const damageEffect = new DealDamageEffect(effect, 10);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
      });
    }

    return state;
  }
}
