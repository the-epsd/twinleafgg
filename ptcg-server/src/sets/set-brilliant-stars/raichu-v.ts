import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, SlotType, StateUtils, GameError, AttachEnergyPrompt, ShuffleDeckPrompt, EnergyCard } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { DiscardEnergyPrompt } from '../../game/store/prompts/discard-energy-prompt';


export class RaichuV extends PokemonCard {

  public regulationMark = 'F';

  public tags = [CardTag.POKEMON_V];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 200;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Fast Charge',
      cost: [CardType.LIGHTNING],
      damage: 0,
      text: 'If you go first, you can use this attack during your first turn. Search your deck for a L Energy card and attach it to this Pokémon. Then, shuffle your deck.'
    },
    {
      name: 'Dynamic Spark',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING],
      damage: 60,
      damageCalculation: 'x',
      text: 'You may discard any amount of L Energy from your Pokémon. This attack does 60 damage for each card you discarded in this way.'
    }
  ];

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '45';

  public name: string = 'Raichu V';

  public fullName: string = 'Raichu V BRS';

  // Implement power
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    const player = state.players[state.activePlayer];

    if (state.turn == 1 && player.active.cards[0] == this) {
      player.canAttackFirstTurn = true;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const cardList = StateUtils.findCardList(state, this);
      if (cardList === undefined) {
        return state;
      }

      if (player.canAttackFirstTurn) {

        return store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          player.deck,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Lightning Energy' },
          { allowCancel: false, min: 0, max: 1 },
        ), transfers => {
          transfers = transfers || [];
          // cancelled by user
          if (transfers.length === 0) {
            return state;
          }
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            player.deck.moveCardTo(transfer.card, target);
          }
          state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
          });
        });
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      if (player.canAttackFirstTurn) {
        throw new GameError(GameMessage.CANNOT_ATTACK_ON_FIRST_TURN);
      }

      // return store.prompt(state, new ChoosePokemonPrompt(
      //   player.id,
      //   GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      //   PlayerType.BOTTOM_PLAYER,
      //   [SlotType.ACTIVE, SlotType.BENCH],
      //   { min: 1, max: 6, allowCancel: true }
      // ), targets => {
      //   targets.forEach(target => {

      let totalLightningEnergy = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const lightningCount = cardList.cards.filter(card =>
          card instanceof EnergyCard && card.name === 'Lightning Energy'
        ).length;
        totalLightningEnergy += lightningCount;
      });

      console.log('Total Lightning Energy: ' + totalLightningEnergy);

      return store.prompt(state, new DiscardEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],// Card source is target Pokemon
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Lightning Energy' },
        { min: 1, max: totalLightningEnergy, allowCancel: false }
      ), transfers => {

        if (transfers === null) {
          return;
        }

        for (const transfer of transfers) {
          let totalDiscarded = 0;

          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = player.discard;
          source.moveCardTo(transfer.card, target);

          totalDiscarded = transfers.length;

          effect.damage = totalDiscarded * 60;

        }
        console.log('Total Damage: ' + effect.damage);
        return state;
      });
    }
    return state;
  }
}