import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage,
  ChooseAttackPrompt, Attack, GameLog, PowerType, Card, ChooseCardsPrompt, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

function* useApexDragon(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  
  const discardPokemon = player.discard.cards.filter(card => card.superType === SuperType.POKEMON) as PokemonCard[];
  const dragonTypePokemon = discardPokemon.filter(card => card.cardType === CardType.DRAGON);


  let selected: any;
  yield store.prompt(state, new ChooseAttackPrompt(
    player.id,
    GameMessage.CHOOSE_ATTACK_TO_COPY,
    dragonTypePokemon,
    { allowCancel: true }
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

export class RegidragoVSTAR extends PokemonCard {

  public tags = [ CardTag.POKEMON_VSTAR ];

  public regulationMark = 'F';

  public stage: Stage = Stage.VSTAR;

  public evolvesFrom = 'Regidrago V';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 280;

  public weakness = [ ];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Apex Dragon',
      cost: [ CardType.GRASS, CardType.GRASS, CardType.FIRE ],
      damage: 0,
      text: 'Choose an attack from a [N] Pokémon in your discard pile and use it as this attack.'
    }];

  public powers = [
    {
      name: 'Summoning Star',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'During your turn, you may discard the top 7 cards of your deck. Then, put up to 2 cards from your discard pile into your hand. (You can\'t use more than 1 VSTAR Power in a game.)'
    }
  ];

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '136';

  public name: string = 'Regidrago VSTAR';

  public fullName: string = 'Regidrago VSTAR SIT 114';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useApexDragon(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.usedVSTAR === true) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
      }
      player.usedVSTAR = true;

      player.deck.moveTo(player.discard, 7);

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        { },
        { min: 1, max: 2, allowCancel: true }
      ), selected => {
        cards = selected || [];

        cards.forEach((card, index) => {
          player.discard.moveCardTo(card, player.hand);
        });
        return state;
      });
    }
    return state;
  }
}
