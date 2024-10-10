import { GameError, GameLog, GameMessage, PokemonCard, Power, PowerType, State, StateUtils, StoreLike, TrainerCard } from '../..';
import { CardType, PokemonType, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect, PowerEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { PlayItemEffect, PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class LilliesPokeDoll extends TrainerCard {

  public trainerType = TrainerType.ITEM;
  public superType = SuperType.TRAINER;

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;
  public cardTypez: CardType = CardType.COLORLESS;

  public movedToActiveThisTurn = false;

  public pokemonType = PokemonType.NORMAL;
  public evolvesFrom = '';
  public cardTag = [];
  public tools = [];

  public archetype = [];

  public hp: number = 30;

  public weakness = [];

  public retreat = [];

  public resistance = [];

  public attacks = [];

  public set: string = 'CEC';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '197';

  public name: string = 'Lillie\'s Poké Doll';

  public fullName: string = 'Lillie\'s Poké Doll CEC';

  public powers: Power[] = [
    {
      name: 'Lillie\'s Poké Doll',
      text: 'At any time during your turn (before your attack), if this Pokémon is your Active Pokémon, you may discard all cards from it and put it on the bottom of your deck.',
      useWhenInPlay: true,
      exemptFromAbilityLock: true,
      powerType: PowerType.ABILITY
    }
  ];

  public text =
    'Play this card as if it were a 30-HP [C] Basic Pokémon. At any time during your turn (before your attack), if this Pokémon is your Active Pokémon, you may discard all cards from it and put it on the bottom of your deck.' +
    '' +
    'This card can\'t retreat. If this card is Knocked Out, your opponent can\'t take any Prize cards for it.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0] && effect.player.active.cards.includes(this)) {
      const cardList = effect.player.active;
      const player = effect.player;

      store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: effect.player.name, card: this.name });

      if (player.bench.every(b => b.cards.length === 0)) {
        // technical implementation does not matter exactly because this ends the game
        effect.player.active.clearEffects();
        effect.player.active.clearAttackEffects();
        effect.player.active.moveCardsTo(effect.player.active.cards, player.deck);
      } else {
        player.switchPokemon(cardList);
        const pokeDollCardList = StateUtils.findCardList(state, this);
        pokeDollCardList.moveCardsTo(pokeDollCardList.cards.filter(c => c === this), effect.player.deck);
        pokeDollCardList.moveCardsTo(pokeDollCardList.cards.filter(c => c !== this), effect.player.discard);
      }
    }

    if (effect instanceof PlayItemEffect && effect.trainerCard === this) {
      const player = effect.player;

      const emptySlots = player.bench.filter(b => b.cards.length === 0);
      if (emptySlots.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const playPokemonEffect = new PlayPokemonEffect(player, this as PokemonCard, emptySlots[0]);
      store.reduceEffect(state, playPokemonEffect);
    }

    if (effect instanceof RetreatEffect && effect.player.active.cards.includes(this)) {
      throw new GameError(GameMessage.CANNOT_RETREAT);
    }

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      effect.prizeCount = 0;
      return state;
    }

    if (effect instanceof RetreatEffect && effect.player.active.cards.includes(this)) {
      throw new GameError(GameMessage.CANNOT_RETREAT);
    }

    return state;
  }

}
