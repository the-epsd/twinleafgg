import { PokemonCard, CardTag, Stage, CardType, StoreLike, State, StateUtils, CoinFlipPrompt, GameMessage, ChoosePokemonPrompt, PlayerType, SlotType, CardTarget, AttachEnergyPrompt, EnergyCard, EnergyType, SuperType } from '../../game';
import { KnockOutOpponentEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';

export class AlolanExeggutorex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Exeggcute';
  public cardType: CardType = CardType.DRAGON;
  public hp: number = 300;
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Tropical Fever',
      cost: [CardType.GRASS, CardType.WATER],
      damage: 150,
      text: 'Choose any number of Basic Energy cards from your hand and attach them to your Pokemon in any way you like.'
    },
    {
      name: 'Swinging Sphene',
      cost: [CardType.GRASS, CardType.WATER, CardType.FIGHTING],
      damage: 0,
      text: 'Flip a coin. If heads, Knock Out your opponent\'s Active Basic Pokemon. If tails, Knock Out 1 of your opponent\'s Benched Basic Pokemon.'
    }
  ];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '133';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Alolan Exeggutor ex';
  public fullName: string = 'Alolan Exeggutor ex SV7a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC;
      });
      if (!hasEnergyInHand) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const energyCard = transfer.card as EnergyCard;
          const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
          store.reduceEffect(state, attachEnergyEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const blocked: CardTarget[] = [];

      const opponentActive = opponent.active.getPokemonCard();
      const opponentBench = opponent.bench.filter(card => card.getPokemonCard()?.stage === Stage.BASIC);
      opponentBench.forEach(card => {
        if (card.stage !== Stage.BASIC) {
          blocked.push();
        }
      });


      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          if (opponentActive && opponentActive.stage !== Stage.BASIC) {
            return state;
          }
          if (opponentActive && opponentActive.stage === Stage.BASIC) {
            const dealDamage = new KnockOutOpponentEffect(effect, 999);
            dealDamage.target = opponent.active;
            store.reduceEffect(state, dealDamage);
          }
        }
        if (!result) {
          if (!opponentBench) {
            return state;
          }
          if (opponentBench) {
            return store.prompt(state, new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
              PlayerType.TOP_PLAYER,
              [SlotType.BENCH],
              { min: 1, max: 1, allowCancel: false, blocked: blocked }
            ), selected => {
              const targets = selected || [];
              targets.forEach(target => {
                const dealDamage = new KnockOutOpponentEffect(effect, 999);
                dealDamage.target = target;
                store.reduceEffect(state, dealDamage);
              });
            });
          }
        }
      });
    }
    return state;
  }
}