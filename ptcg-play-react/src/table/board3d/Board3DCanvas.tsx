import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { Card, CardList, Player } from 'ptcg-server';
import { useCardImageMaps, useDeckCardScanUrl } from '../../context/CardImagesContext';
import { useAuth } from '../../context/AuthContext';
import type { LocalGameState } from '../types/localGameState';
import { BoardInteractionService } from '../BoardInteractionService';
import { Board3dController, type Board3dControllerProps } from './board3dController';
import { createBoard3dRuntime } from './createBoard3dRuntime';
import { createBoard3dCardsAdapter } from './createBoard3dCardsAdapter';
import type { Board3dCardsAdapter } from './board3dCardsAdapter';
import type { Board3dGameActions } from './board3dGameActions';
import { Board3dStats } from './Board3dStats';
import { CardInfoPopup } from '../../card-info/CardInfoPopup';
import { CardInfoListPopup } from '../../card-info/CardInfoListPopup';
import type { Board3dCardInfoData, CardInfoPaneActionResult } from './board3dCardsAdapter';
import styles from './Board3DCanvas.module.css';
import { appConfig } from '../../env/config';

export type Board3DCanvasProps = {
  gameState: LocalGameState;
  topPlayer: Player;
  bottomPlayer: Player;
  bottomPlayerHand: CardList;
  topPlayerHand: CardList;
  clientId: number;
  catalog: Card[];
  boardInteraction: BoardInteractionService;
  gameActions: Board3dGameActions;
  onKoSequenceActiveChange?: (active: boolean) => void;
};

type CardPromptState =
  | null
  | {
      kind: 'info';
      data: Board3dCardInfoData;
      resolve: (v: CardInfoPaneActionResult) => void;
    }
  | {
      kind: 'list';
      data: Board3dCardInfoData;
      resolve: (v: CardInfoPaneActionResult) => void;
    };

function useStableGameActions(actions: Board3dGameActions): Board3dGameActions {
  const ref = useRef(actions);
  ref.current = actions;
  return useMemo(
    () => ({
      playCardAction: (...a) => ref.current.playCardAction(...a),
      retreatAction: (...a) => ref.current.retreatAction(...a),
      trainerAbility: (...a) => ref.current.trainerAbility(...a),
      energyAbility: (...a) => ref.current.energyAbility(...a),
      ability: (...a) => ref.current.ability(...a),
      stadium: (...a) => ref.current.stadium(...a),
      attack: (...a) => ref.current.attack(...a),
      retreatStart: (...a) => ref.current.retreatStart(...a),
      resolvePrompt: (...a) => ref.current.resolvePrompt(...a),
    }),
    [],
  );
}

export function Board3DCanvas(props: Board3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<Board3dController | null>(null);
  const [cardPrompt, setCardPrompt] = useState<CardPromptState>(null);
  const [, bumpGlContext] = useReducer((x: number) => x + 1, 0);

  const maps = useCardImageMaps();
  const { serverConfig, cardsInfo } = useAuth();
  const getScanUrl = useDeckCardScanUrl(serverConfig?.scansUrl);
  const gameActionsStable = useStableGameActions(props.gameActions);

  const catalog = props.catalog.length ? props.catalog : cardsInfo?.cards ?? [];

  const queueInfo = useCallback((data: Board3dCardInfoData) => {
    return new Promise<CardInfoPaneActionResult>((resolve) => {
      setCardPrompt({ kind: 'info', data, resolve });
    });
  }, []);

  const queueList = useCallback((data: Board3dCardInfoData) => {
    return new Promise<CardInfoPaneActionResult>((resolve) => {
      setCardPrompt({ kind: 'list', data, resolve });
    });
  }, []);

  const cardsAdapter: Board3dCardsAdapter = useMemo(
    () =>
      createBoard3dCardsAdapter({
        catalog,
        maps,
        scansUrl: serverConfig?.scansUrl,
        apiBase: appConfig.apiUrl,
        sleevesUrl: serverConfig?.sleevesUrl,
        showCardInfo: queueInfo,
        showCardInfoList: queueList,
      }),
    [catalog, maps, serverConfig?.scansUrl, serverConfig?.sleevesUrl, queueInfo, queueList],
  );

  const controllerProps: Board3dControllerProps = useMemo(
    () => ({
      gameState: props.gameState,
      topPlayer: props.topPlayer,
      bottomPlayer: props.bottomPlayer,
      bottomPlayerHand: props.bottomPlayerHand,
      topPlayerHand: props.topPlayerHand,
      clientId: props.clientId,
      onKoSequenceActiveChange: props.onKoSequenceActiveChange,
    }),
    [
      props.gameState,
      props.topPlayer,
      props.bottomPlayer,
      props.bottomPlayerHand,
      props.topPlayerHand,
      props.clientId,
      props.onKoSequenceActiveChange,
    ],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const runtime = createBoard3dRuntime(cardsAdapter);
    const ctrl = new Board3dController(
      runtime.assetLoader,
      runtime.stateSync,
      runtime.animationService,
      runtime.interactionService,
      runtime.handService,
      runtime.wireframeService,
      runtime.lightingService,
      runtime.postProcessingService,
      cardsAdapter,
      gameActionsStable,
      props.boardInteraction,
    );
    controllerRef.current = ctrl;
    ctrl.init(canvas, controllerProps);
    bumpGlContext();

    return () => {
      ctrl.destroy();
      controllerRef.current = null;
    };
  }, [cardsAdapter, gameActionsStable, props.boardInteraction]);

  useEffect(() => {
    controllerRef.current?.refreshProps(controllerProps);
  }, [controllerProps]);

  const scene = controllerRef.current?.scene ?? null;
  const renderer = controllerRef.current?.renderer ?? null;

  return (
    <div className={styles.root}>
      <div className={styles.board3dContainer}>
        <canvas ref={canvasRef} className={styles.board3dCanvas} />
        <Board3dStats
          scene={scene}
          renderer={renderer}
          onWireframeToggle={(enabled) => controllerRef.current?.onWireframeToggle(enabled)}
        />
      </div>

      {cardPrompt?.kind === 'info' && cardPrompt.data.card ? (
        <CardInfoPopup
          card={cardPrompt.data.card}
          cardList={cardPrompt.data.cardList}
          facedown={cardPrompt.data.facedown}
          catalog={catalog}
          getScanUrl={getScanUrl}
          onClose={() => {
            cardPrompt.resolve(undefined);
            setCardPrompt(null);
          }}
          isInGame
          options={cardPrompt.data.options}
          onTableAction={(action) => {
            cardPrompt.resolve(action);
            setCardPrompt(null);
          }}
        />
      ) : null}

      {cardPrompt?.kind === 'list' && cardPrompt.data.cardList ? (
        <CardInfoListPopup
          cardList={cardPrompt.data.cardList}
          catalog={catalog}
          getScanUrl={getScanUrl}
          facedown={cardPrompt.data.facedown}
          allowReveal={cardPrompt.data.allowReveal}
          options={cardPrompt.data.options}
          isInGame
          onClose={() => {
            cardPrompt.resolve(undefined);
            setCardPrompt(null);
          }}
          onResolve={(action) => {
            cardPrompt.resolve(action);
            setCardPrompt(null);
          }}
        />
      ) : null}
    </div>
  );
}
