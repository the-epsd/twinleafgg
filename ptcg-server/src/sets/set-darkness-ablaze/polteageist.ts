import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, BoardEffect, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, GameError, GameMessage, PlayerType, ChooseCardsPrompt, EnergyCard } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Polteageist extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Sinistea';

  public cardType: CardType = P;

  public hp: number = 60;

  public weakness = [{ type: D }];

  public resistance = [{ type: F, value: -30 }];

  public retreat = [C];

  public powers = [
    {
      name: 'Tea Break',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'You must discard a Pokémon that has the Mad Party attack from your hand in order to use this Ability. ' +
        'Once during your turn, you may draw 2 cards.',
    }
  ];

  public attacks = [
    {
      name: 'Mad Party',
      cost: [C, C],
      damage: 20,
      damageCalculation: 'x',
      text: 'This attack does 20 damage for each Pokémon in your discard pile that has the Mad Party attack.'
    }
  ];

  public set: string = 'DAA';

  public name: string = 'Polteageist';

  public fullName: string = 'Polteageist DAA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '83';

  public regulationMark = 'D';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.ABILITY_USED_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ABILITY_USED_MARKER, this)) {
      const player = effect.player;
      player.marker.removeMarker(this.ABILITY_USED_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard;
      });

      if (!hasEnergyInHand)
        throw new GameError(GameMessage.CANNOT_USE_POWER);

      if (player.marker.hasMarker(this.ABILITY_USED_MARKER, this))
        throw new GameError(GameMessage.POWER_ALREADY_USED);

      if (player.deck.cards.length === 0)
        throw new GameError(GameMessage.CANNOT_USE_POWER);

      const blocked = player.hand.cards
        .filter(c => !c.attacks.some(a => a.name === 'Mad Party'))
        .map(c => player.hand.cards.indexOf(c));

      if (blocked.length == player.hand.cards.length)
        throw new GameError(GameMessage.CANNOT_USE_POWER);

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.POKEMON },
        { allowCancel: true, min: 1, max: 1, blocked }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }
        player.marker.addMarker(this.ABILITY_USED_MARKER, this);

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });

        player.hand.moveCardsTo(cards, player.discard);
        player.deck.moveTo(player.hand, 2);
      });
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let pokemonCount = 0;
      player.discard.cards.forEach(c => {
        if (c instanceof PokemonCard && c.attacks.some(a => a.name === 'Mad Party'))
          pokemonCount += 1;
      });

      effect.damage = pokemonCount * 20;
    }

    return state;
  }

}
