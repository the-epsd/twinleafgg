import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ChooseAttackPrompt, Card, Resistance, GameLog, CardList, Attack } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

function* useSeekInspiration(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = effect.opponent;

  if (player.deck.cards.length <= 0) { return state; }  // Attack does nothing if deck is empty.

  const deckTop = new CardList();
  player.deck.moveTo(deckTop, 1);
  const topdeck: Card = deckTop.cards[0];  // This is the card we're looking at.
  deckTop.moveTo(player.discard);

  if (!(topdeck instanceof PokemonCard)) {
    return state;
  }

  // this looks disgusting but the previous method didn't work (if only hasRuleBox() worked on topdeck, although that might not work either who knows)
  if (topdeck.tags.includes(CardTag.POKEMON_EX)
    || topdeck.tags.includes(CardTag.POKEMON_GX)
    || topdeck.tags.includes(CardTag.POKEMON_LV_X)
    || topdeck.tags.includes(CardTag.POKEMON_V)
    || topdeck.tags.includes(CardTag.PRISM_STAR)
    || topdeck.tags.includes(CardTag.RADIANT)
    || topdeck.tags.includes(CardTag.POKEMON_VMAX)
    || topdeck.tags.includes(CardTag.POKEMON_VSTAR)
    || topdeck.tags.includes(CardTag.POKEMON_ex)
    || topdeck.tags.includes(CardTag.BREAK)
    || topdeck.tags.includes(CardTag.POKEMON_SV_MEGA)) {
    return state;
  }

  const discardPokemon = player.discard.cards.filter(card => card.superType === SuperType.POKEMON) as PokemonCard[];
  const pokemonInQuestion = discardPokemon.filter(card => card === topdeck);

  if (pokemonInQuestion.length === 0) {
    return state;  // No valid Pokemon to copy from
  }

  let selected: any;
  yield store.prompt(state, new ChooseAttackPrompt(
    player.id,
    GameMessage.CHOOSE_ATTACK_TO_COPY,
    pokemonInQuestion,
    { allowCancel: true }
  ), result => {
    selected = result;
    next();
  });

  const attack: Attack | null = selected;

  if (attack === null) {
    return state; // Player chose to cancel
  }

  try {
    store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
      name: player.name,
      attack: attack.name
    });

    const attackEffect = new AttackEffect(player, opponent, attack);
    state = store.reduceEffect(state, attackEffect);

    if (store.hasPrompts()) {
      yield store.waitPrompt(state, () => next());
    }

    if (attackEffect.damage > 0) {
      const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
      state = store.reduceEffect(state, dealDamage);
    }
  } catch (error) {
    console.log('Attack failed:', error);
  }

  return state;
}

export class Slowking extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Slowpoke';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 120;

  public weakness = [{ type: CardType.DARK }];

  public resistance: Resistance[] = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Seek Inspiration',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: 0,
      text: 'Discard the top card of your deck, and if that card is a Pokemon that doesn\'t have a Rule Box, ' +
        'choose 1 of its attacks and use it as this attack. (Pokemon ex, Pokemon V, etc. have Rule Boxes.)'
    },
    { name: 'Super Psy Bolt', cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS], damage: 120, text: '' }
  ];

  public set: string = 'SCR';

  public name: string = 'Slowking';

  public fullName: string = 'Slowking SCR';

  public setNumber: string = '58';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const generator = useSeekInspiration(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
