import { PokemonCard, Stage, CardType, CardTag, StoreLike, State, StateUtils, ConfirmPrompt, GameMessage, DamageMap, PlayerType, PutDamagePrompt, SlotType, GameError } from '../../game';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

function* useLightningStormStar(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.usedVSTAR) {
    throw new GameError(GameMessage.LABEL_VSTAR_USED);
  }

  player.usedVSTAR = true;

  const maxAllowedDamage: DamageMap[] = [];
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    maxAllowedDamage.push({ target, damage: card.hp + 240 });
  });

  const damage = 240;

  return store.prompt(state, new PutDamagePrompt(
    effect.player.id,
    GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
    PlayerType.TOP_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    damage,
    maxAllowedDamage,
    { allowCancel: false, damageMultiple: 60 }
  ), targets => {
    const results = targets || [];
    for (const result of results) {
      const target = StateUtils.getTarget(state, player, result.target);
      const putCountersEffect = new PutCountersEffect(effect, result.damage);
      putCountersEffect.target = target;
      store.reduceEffect(state, putCountersEffect);
    }
  });
}

export class ZeraoraVSTAR extends PokemonCard {
  public stage: Stage = Stage.VSTAR;
  public tags = [CardTag.POKEMON_VSTAR];
  public evolvesFrom: string = 'Zeraora V';
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 270;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [];
  public regulationMark = 'F';

  public attacks = [
    {
      name: 'Crushing Beat',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 190,
      text: 'You may discard a Stadium in play.'
    },
    {
      name: 'Lightning Storm Star',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 0,
      text: 'Choose 1 of your opponent\'s Pokémon 4 times. (You can choose the same Pokémon more than once.) For each time you chose a Pokémon, do 60 damage to it. This damage isn\'t affected by Weakness or Resistance. (You can\'t use more than 1 VSTAR Power in a game.)'
    }
  ];

  public set: string = 'CRZ';
  public name: string = 'Zeraora VSTAR';
  public fullName: string = 'Zeraora VSTAR CRZ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard !== undefined) {

        state = store.prompt(state, new ConfirmPrompt(
          effect.player.id,
          GameMessage.WANT_TO_DISCARD_STADIUM,
        ), wantToUse => {
          if (wantToUse) {

            // Discard Stadium
            const cardList = StateUtils.findCardList(state, stadiumCard);
            const player = StateUtils.findOwner(state, cardList);
            cardList.moveTo(player.discard);
            return state;
          }
          return state;
        });
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = useLightningStormStar(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
