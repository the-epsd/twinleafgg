import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, BoardEffect } from '../../game/store/card/card-types';
import {
  PowerType, StoreLike, State, StateUtils, GameError, GameMessage,
  PlayerType, ChooseAttackPrompt,
  Attack,
  ChooseCardsPrompt,
  GameLog
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
// citing empoleon to help make this (https://github.com/keeshii/ryuu-play/blob/master/ptcg-server/src/sets/set-black-and-white/empoleon.ts)

function* useTricksterGX(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const oppActive = opponent.active.getPokemonCard();
  const oppBenched = opponent.bench.filter(b => b.cards.length > 0);

  const allOpponentPokemon = oppActive ? [oppActive, ...oppBenched.map(b => b.getPokemonCard())].filter((pokemon): pokemon is PokemonCard => pokemon !== undefined) : [];

  // Check if player has used GX attack
  if (player.usedGX == true) {
    throw new GameError(GameMessage.LABEL_GX_USED);
  }

  let selected: any;
  yield store.prompt(state, new ChooseAttackPrompt(
    player.id,
    GameMessage.CHOOSE_ATTACK_TO_COPY,
    allOpponentPokemon,
    { allowCancel: false }
  ), result => {
    selected = result;
    next();
  });

  const attack: Attack | null = selected;

  if (attack === null) {
    return state;
  }

  store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
    name: player.name,
    attack: attack.name
  });

  // set GX attack as used for game
  player.usedGX = true;

  // Perform attack
  const attackEffect = new AttackEffect(player, opponent, attack);
  store.reduceEffect(state, attackEffect);

  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }

  if (attackEffect.damage > 0) {
    const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
    state = store.reduceEffect(state, dealDamage);
  }

  return state;
}

export class ZoroarkGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Zorua';

  public cardType: CardType = CardType.DARK;

  public hp: number = 210;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Trade',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may discard a card from your hand. If you do, draw 2 cards.'
  }];

  public attacks = [
    {
      name: 'Riotous Beating',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 20 damage for each of your Pokémon in play.'
    },

    {
      name: 'Trickster-GX',
      cost: [CardType.DARK, CardType.DARK],
      damage: 0,
      gxAttack: true,
      text: 'Choose 1 of your opponent\'s Pokémon\'s attacks and use it as this attack. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'SLG';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '53';

  public name: string = 'Zoroark-GX';

  public fullName: string = 'Zoroark GX SLG';

  public readonly TRADE_MARKER = 'TRADE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.TRADE_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      if (player.hand.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.TRADE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { allowCancel: true, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });

        player.marker.addMarker(this.TRADE_MARKER, this);
        player.hand.moveCardsTo(cards, player.discard);
        player.deck.moveTo(player.hand, 2);
      });
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      let pokemonInPlay = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, () => { pokemonInPlay += 1; });
      effect.damage = 20 * pokemonInPlay;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = useTricksterGX(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.TRADE_MARKER, this);
    }
    return state;
  }
}