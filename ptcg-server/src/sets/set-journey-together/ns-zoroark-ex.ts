import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, GameError, ChooseCardsPrompt, ChooseAttackPrompt, StateUtils, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ABILITY_USED, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

function* useNightJoker(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const benched = player.bench.filter(b => b.cards.length > 0 && b.getPokemonCard()?.tags.includes(CardTag.NS) && b.getPokemonCard()?.name !== 'N\'s Zoroark ex' && player.active !== b);

  // Return early if no valid targets
  if (benched.length === 0) {
    return state;
  }

  const allYourPokemon = [...benched.map(b => b.getPokemonCard())];

  let selected: any;
  yield store.prompt(state, new ChooseAttackPrompt(
    player.id,
    GameMessage.CHOOSE_ATTACK_TO_COPY,
    allYourPokemon.filter((card): card is any => card !== undefined),
    { allowCancel: false }
  ), result => {
    selected = result;
    next();
  });

  // Validate selected attack
  if (!selected || selected.copycatAttack) {
    return state; // Exit if no valid attack is selected
  }

  store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
    name: player.name,
    attack: selected.name
  });

  // Perform attack
  const attackEffect = new AttackEffect(player, opponent, selected);
  state = store.reduceEffect(state, attackEffect);

  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }

  if (attackEffect.damage > 0) {
    const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
    state = store.reduceEffect(state, dealDamage);
  }
  return state;
}

export class NsZoroarkex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.NS];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'N\'s Zorua';
  public cardType: CardType = D;
  public hp: number = 280;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public powers = [{
    name: 'Trade',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'You must discard a card from your hand in order to use this Ability. Once during your turn, you may draw 2 cards.'
  }];

  public attacks = [
    {
      name: 'Night Joker',
      cost: [D, D],
      copycatAttack: true,
      damage: 0,
      text: 'Choose 1 of your Benched N\'s Pokémon\'s attacks and use it as this attack.'
    }
  ];

  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public set: string = 'JTG';
  public setNumber = '98';
  public name: string = 'N\'s Zoroark ex';
  public fullName: string = 'N\'s Zoroark ex JTG';

  public readonly TRADE_MARKER = 'TRADE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.TRADE_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.TRADE_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
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
        { allowCancel: false, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];
        ABILITY_USED(player, this);
        player.marker.addMarker(this.TRADE_MARKER, this);
        player.hand.moveCardsTo(cards, player.discard);
        player.deck.moveTo(player.hand, 2);
      });

      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const generator = useNightJoker(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}