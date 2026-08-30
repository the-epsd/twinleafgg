import { CardList, CardTag, CardType, ChooseCardsPrompt, ChoosePokemonPrompt, ConfirmPrompt, EnergyCard, GameError, GameMessage, PlayerType, PokemonCard, PowerType, SlotType, Stage, State, StateUtils, StoreLike, SuperType } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { PlayPokemonEffect } from "../../../game/store/effects/play-card-effects";
import { REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, AFTER_ATTACK, MOVE_CARDS, WAS_POWER_USED, IS_ABILITY_BLOCKED, HAS_MARKER, ADD_MARKER, ABILITY_USED } from "../../../game/store/prefabs/prefabs";

export class InteleonVMAX extends PokemonCard {
  public stage: Stage = Stage.VMAX;
  public evolvesFrom = 'Inteleon V';
  protected _tags = [CardTag.POKEMON_VMAX, CardTag.RAPID_STRIKE];
  public cardType: CardType[] = [W];
  public hp: number = 320;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public powers = [
    {
      name: 'Double Gunner',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: "You must discard a [W] Energy card from your hand in order to use this Ability. Once during your turn, you may choose 2 of your opponent's Benched Pokémon and put 2 damage counters on each of them.",
    },
  ];

  public attacks = [
    {
      name: 'Aqua Bullet',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: 70,
      text: 'You may put an Energy attached to this Pokémon into your hand. If you do, this attack does 70 more damage.',
    },
  ];

  public regulationMark = 'E';
  public set: string = 'FST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';
  public name: string = 'Inteleon VMAX';
  public fullName: string = 'Inteleon VMAX FST';

  public readonly DOUBLE_GUNNER_MARKER = 'DOUBLE_GUNNER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      REMOVE_MARKER(this.DOUBLE_GUNNER_MARKER, effect.player, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.DOUBLE_GUNNER_MARKER, this);

    // Aqua Bullet
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const attacker = effect.source;
      attacker.pendingEnergyReturnToHand = [];

      const energyCards = attacker.cards.filter(c => c.superType === SuperType.ENERGY);
      if (energyCards.length === 0) {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (!wantToUse) {
          return;
        }

        const cardList = new CardList();
        cardList.cards = energyCards;

        state = store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_ENERGIES_TO_HAND,
          cardList,
          { superType: SuperType.ENERGY },
          { min: 1, max: 1, allowCancel: false }
        ), energies => {
          const cards = energies || [];
          if (cards.length === 0) {
            return;
          }
          effect.damage += 70;
          attacker.pendingEnergyReturnToHand = cards;
        });
      });
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const attacker = player.active;
      const cards = attacker.pendingEnergyReturnToHand;
      if (cards.length === 0) {
        return state;
      }
      attacker.pendingEnergyReturnToHand = [];
      MOVE_CARDS(store, state, attacker, player.hand, { cards, sourceCard: this });
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (HAS_MARKER(this.DOUBLE_GUNNER_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const hasWaterEnergy = player.hand.cards.some(
        c => c instanceof EnergyCard && c.name === 'Water Energy'
      );
      if (!hasWaterEnergy) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (!opponent.bench.some(b => b.cards.length > 0)) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY, name: 'Water Energy' },
        { allowCancel: true, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }

        MOVE_CARDS(store, state, player.hand, player.discard, {
          cards,
          sourceCard: this,
          sourceEffect: this.powers[0],
        });

        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { min: 1, max: 2, allowCancel: false },
        ), selected => {
          (selected || []).forEach(target => {
            target.damage += 20;
          });
          ADD_MARKER(this.DOUBLE_GUNNER_MARKER, player, this);
          ABILITY_USED(player, this);
        });
      });
    }

    return state;
  }
}
