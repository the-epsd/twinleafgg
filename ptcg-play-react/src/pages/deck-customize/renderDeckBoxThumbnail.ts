import {
  ACESFilmicToneMapping,
  AmbientLight,
  ClampToEdgeWrapping,
  DirectionalLight,
  Group,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { DEFAULT_CUSTOMIZE_PREVIEW_LAYOUT } from './customizePreviewLayout';

const DECK_BOX_OBJ_URL = '/assets/models/deck-box.obj';
/** Render larger then display smaller for sharper grid icons. */
const THUMB_SIZE = 512;
/** Bump when lighting/framing changes so stale data-URLs are discarded. */
const THUMB_CACHE_VERSION = 'v12';

const cache = new Map<string, string>();

function cacheKey(textureUrl: string): string {
  return `${THUMB_CACHE_VERSION}:${textureUrl}`;
}

let sharedObj: Group | null = null;
let objPromise: Promise<Group> | null = null;

function loadObj(): Promise<Group> {
  if (sharedObj) return Promise.resolve(sharedObj);
  if (objPromise) return objPromise;
  objPromise = new Promise((resolve, reject) => {
    new OBJLoader().load(
      DECK_BOX_OBJ_URL,
      (obj) => {
        sharedObj = obj;
        resolve(obj);
      },
      undefined,
      reject,
    );
  });
  return objPromise;
}

function loadTexture(url: string) {
  return new Promise<ReturnType<TextureLoader['load']>>((resolve, reject) => {
    new TextureLoader().load(url, resolve, undefined, reject);
  });
}

/**
 * Renders a deck-box OBJ with the given texture to a static PNG data URL.
 * Matches Customize preview lights + IBL-style environment as closely as practical.
 */
export async function renderDeckBoxThumbnail(textureUrl: string): Promise<string> {
  const cacheId = cacheKey(textureUrl);
  const cached = cache.get(cacheId);
  if (cached) return cached;

  const [obj, texture] = await Promise.all([loadObj(), loadTexture(textureUrl)]);
  const { camera: camLayout, box } = DEFAULT_CUSTOMIZE_PREVIEW_LAYOUT;

  const canvas = document.createElement('canvas');
  canvas.width = THUMB_SIZE;
  canvas.height = THUMB_SIZE;

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(THUMB_SIZE, THUMB_SIZE, false);
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;

  const camera = new PerspectiveCamera(camLayout.fov, 1, 0.1, 100);
  // Same view angle as Preview All; pull back so the full box fits with margin.
  const [cx, cy, cz] = camLayout.position;
  const zoom = 0.92;
  camera.position.set(cx * zoom, cy * zoom, cz * zoom);
  camera.lookAt(0, 0, 0);

  // Same key/fill/ambient as CustomizePreviewScene.
  scene.add(new AmbientLight(0xffffff, 0.65));
  const key = new DirectionalLight(0xffffff, 1.15);
  key.position.set(4, 10, 6);
  scene.add(key);
  const fill = new DirectionalLight(0xffffff, 0.4);
  fill.position.set(-6, 3, -2);
  scene.add(fill);

  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.flipY = true;
  texture.generateMipmaps = true;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.anisotropy = 8;
  texture.needsUpdate = true;

  const model = obj.clone(true) as Group;
  model.position.set(0, 0, 0);
  model.rotation.set(box.rotation[0], box.rotation[1], box.rotation[2]);
  model.scale.setScalar(box.scale * 1.42);
  model.traverse((child) => {
    if (!(child instanceof Mesh)) return;
    child.material = new MeshStandardMaterial({
      map: texture,
      roughness: 0.85,
      metalness: 0.05,
      envMapIntensity: 0.85,
    });
  });
  scene.add(model);

  renderer.render(scene, camera);
  const dataUrl = canvas.toDataURL('image/png');

  envTex.dispose();
  pmrem.dispose();
  renderer.dispose();
  texture.dispose();
  model.traverse((child) => {
    if (child instanceof Mesh) {
      const mat = child.material;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else mat.dispose();
    }
  });

  cache.set(cacheId, dataUrl);
  return dataUrl;
}

export function clearDeckBoxThumbnailCache(): void {
  cache.clear();
}
