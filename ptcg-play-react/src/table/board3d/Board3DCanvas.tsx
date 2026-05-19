import { useCallback, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PCFSoftShadowMap, SRGBColorSpace } from 'three';
import type { Card, CardList, Player } from 'ptcg-server';
import { useCardImageMaps, useDeckCardScanUrl } from '../../context/CardImagesContext';
import { useAuth } from '../../context/AuthContext';
import type { LocalGameState } from '../types/localGameState';
import { BoardInteractionService } from '../BoardInteractionService';
import type { Board3dController } from './board3dController';
import { createBoard3dRuntime } from './createBoard3dRuntime';
import { createBoard3dCardsAdapter } from './createBoard3dCardsAdapter';
import type { Board3dCardsAdapter } from './board3dCardsAdapter';
import type { Board3dGameActions } from './board3dGameActions';
import { Board3dExperience } from './Board3dExperience';
import {
  BOARD3D_LIGHTING_DEFAULTS,
  board3dToneMappingConstant,
  cloneBoard3dLightingDefaults,
} from './board3dLightingConfig';
import { CardInfoPopup } from '../../card-info/CardInfoPopup';
import { CardInfoListPopup } from '../../card-info/CardInfoListPopup';
import type { Board3dCardInfoData, CardInfoPaneActionResult } from './board3dCardsAdapter';
import styles from './Board3DCanvas.module.css';
import { appConfig } from '../../env/config';

const EMPTY_CATALOG: Card[] = [];

const BOARD_CANVAS_GL = {
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance' as const,
};

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
  onBoardFps?: (fps: number) => void;
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

function useBoardCanvasDpr(): [number, number] {
  return useMemo((): [number, number] => {
    const cap = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1;
    return [1, cap];
  }, []);
}

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
  const controllerRef = useRef<Board3dController | null>(null);
  const boardCanvasDpr = useBoardCanvasDpr();
  const lightingSettings = useMemo(() => cloneBoard3dLightingDefaults(), []);
  const [cardPrompt, setCardPrompt] = useState<CardPromptState>(null);
  const onControllerReady = useCallback((c: Board3dController | null) => {
    controllerRef.current = c;
  }, []);

  const maps = useCardImageMaps();
  const { serverConfig, cardsInfo } = useAuth();
  const getScanUrl = useDeckCardScanUrl(serverConfig?.scansUrl);
  const gameActionsStable = useStableGameActions(props.gameActions);

  const catalog =
    props.catalog.length > 0 ? props.catalog : (cardsInfo?.cards ?? EMPTY_CATALOG);

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

  const runtime = useMemo(() => createBoard3dRuntime(cardsAdapter), [cardsAdapter]);

  const controllerProps = useMemo(
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

  const onCanvasCreated = useCallback(
    ({ gl }: { gl: import('three').WebGLRenderer }) => {
      gl.shadowMap.enabled = lightingSettings.directional.castShadow;
      gl.shadowMap.type = PCFSoftShadowMap;
      gl.sortObjects = false;
      gl.outputColorSpace = SRGBColorSpace;
      gl.toneMapping = board3dToneMappingConstant(BOARD3D_LIGHTING_DEFAULTS.renderer.toneMapping);
      gl.toneMappingExposure = BOARD3D_LIGHTING_DEFAULTS.renderer.toneMappingExposure;
    },
    [lightingSettings.directional.castShadow],
  );

  return (
    <div className={styles.root}>
      <div className={styles.board3dContainer}>
        <Canvas
          className={styles.board3dCanvas}
          shadows={lightingSettings.directional.castShadow}
          gl={BOARD_CANVAS_GL}
          dpr={boardCanvasDpr}
          onCreated={onCanvasCreated}
        >
          <Board3dExperience
            runtime={runtime}
            cardsAdapter={cardsAdapter}
            gameActions={gameActionsStable}
            boardInteraction={props.boardInteraction}
            controllerProps={controllerProps}
            onControllerReady={onControllerReady}
            lightingSettings={lightingSettings}
            onBoardFps={props.onBoardFps}
          />
        </Canvas>
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
