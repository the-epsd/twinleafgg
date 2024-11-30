import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, SlotType, GameError, StateUtils, EnergyCard } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { DiscardEnergyPrompt } from '../../game/store/prompts/discard-energy-prompt';


export class RagingBoltex extends PokemonCard {

  public regulationMark = 'H';

  public tags = [CardTag.POKEMON_ex, CardTag.ANCIENT];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 240;

  public weakness = [];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Burst Roar',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Discard your hand and draw 6 cards.'
    },
    {
      name: 'Bellowing Thunder',
      cost: [CardType.LIGHTNING, CardType.FIGHTING],
      damage: 70,
      damageCalculation: 'x',
      text: 'You may discard any amount of Basic Energy from your Pokémon. This attack does 70 damage for each card you discarded in this way.'
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '123';

  public name: string = 'Raging Bolt ex';

  public fullName: string = 'Raging Bolt ex TEF';

  // Implement power
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      player.hand.moveTo(player.discard);
      player.deck.moveTo(player.hand, 6);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      // return store.prompt(state, new ChoosePokemonPrompt(
      //   player.id,
      //   GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      //   PlayerType.BOTTOM_PLAYER,
      //   [SlotType.ACTIVE, SlotType.BENCH],
      //   { min: 1, max: 6, allowCancel: true }
      // ), targets => {
      //   targets.forEach(target => {

      let totalEnergy = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const basicEnergyCount = cardList.cards.filter(card =>
          card instanceof EnergyCard && card.energyType === EnergyType.BASIC
        ).length;
        totalEnergy += basicEnergyCount;
      });

      return store.prompt(state, new DiscardEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],// Card source is target Pokemon
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 1, max: totalEnergy, allowCancel: false }
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

          effect.damage = totalDiscarded * 70;

        }
        return state;
      });
    }
    return state;
  }
}