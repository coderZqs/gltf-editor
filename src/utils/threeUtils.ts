import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
const sizeConfig = {
  height: window.innerHeight,
  width: window.innerWidth
};

/**
 * 添加生成的canvas
 * @param element
 * @param canvas
 */

const appendCanvasToElement = (
  element: HTMLElement,
  canvas: HTMLCanvasElement
) => {
  element.appendChild(canvas);
};

/**
 * 添加控制器
 * @param camera
 * @param canvas
 * @returns
 */

const addOrbitControls = (camera: THREE.Camera, canvas: HTMLCanvasElement) => {
  const controls = new OrbitControls(camera, canvas);

  return controls;
};

/**
 * 添加控制器
 * @param camera
 * @param canvas
 * @returns
 */

const addLockControls = (camera: THREE.Camera) => {
  const controls = new PointerLockControls(camera, document.body);

  return controls;
};

/**
 * 添加照相机
 * @param type
 * @param near
 * @param far
 * @returns
 */
const initCamera = (type = "PerspectiveCamera", near = 0.1, far = 1000) => {
  let camera;
  if (type === "PerspectiveCamera") {
    camera = new THREE.PerspectiveCamera(
      45,
      sizeConfig.width / sizeConfig.height,
      near,
      far
    );
  } else {
    const k = sizeConfig.width / sizeConfig.height; //窗口宽高比
    const s = 150;
    //创建相机对象
    camera = new THREE.OrthographicCamera(
      -150 * k,
      150 * k,
      150,
      -150,
      near,
      far
    );
  }

  return camera;
};

/**
 * 添加渲染器
 * @param params
 * @returns
 */

const initRenderer = (
  size?: { width: number; height: number },
  params: object = {}
): THREE.WebGLRenderer => {
  const renderer = new THREE.WebGLRenderer({
    ...params
  });
  renderer.shadowMap.enabled = true;

  console.log(size);
  renderer.setSize(
    size?.width || sizeConfig.width,
    size?.height || sizeConfig.height
  );

  return renderer;
};

/**
 *  添加BoxGeometry
 * @param sizeConfig
 * @param materialType
 * @param materialConfig
 * @returns
 */

const generateCube = (
  sizeConfig: number[] = [100, 100, 100],
  materialType = "MeshBasicMaterial",
  materialConfig: {}
) => {
  return new THREE.Mesh(
    new THREE.BoxGeometry(sizeConfig[0], sizeConfig[1], sizeConfig[2]),
    new (THREE as any)[materialType]({ ...materialConfig })
  );
};

/**
 * aspect scene
 */

const addAdaptionScreen = (
  renderer: THREE.Renderer,
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
  size
) => {
  window.addEventListener("resize", () => {
    sizeConfig.height = window.innerHeight;
    sizeConfig.width = window.innerWidth;
    camera.updateProjectionMatrix();

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = sizeConfig.width / sizeConfig.height;
    }

    renderer.setSize(sizeConfig.width, sizeConfig.height);
  });
};

/**
 * 判断射线是否接触到物体
 * @param raycaster
 * @param objectList
 * @returns
 */

const judgeRaycasterTouchObject = (
  raycaster: THREE.Raycaster,
  objectList: THREE.Object3D[],
  pointer: THREE.Vector2,
  camera: THREE.Camera
) => {
  raycaster.setFromCamera(pointer, camera);
  const intersectObject = raycaster.intersectObjects(objectList, false);
  return { isTouch: Boolean(intersectObject.length), intersectObject };
};

/**
 * 添加贴图加载器
 * @param textureUrl
 * @param callback
 */
const addTextureLoader = (
  textureUrl: string,
  callback: (arg1: object) => any
) => {
  const fileExtension = textureUrl.split(".").pop();
  const isDDS = fileExtension === "dds";

  let loader;

  if (isDDS) {
    loader = new DDSLoader();
  } else {
    loader = new THREE.TextureLoader();
  }

  loader.load(textureUrl, object => {
    callback && callback(object);
  });
};

/**
 * 添加位置相关的音频对象
 * @param audioUrl
 * @param camera
 * @param volume
 * @param refDistance
 */

const addPositionalAudio = (
  audioUrl: string,
  camera: THREE.Camera,
  volume: number,
  refDistance: number
) => {
  return new Promise((resolve, reject) => {
    const listener = new THREE.AudioListener();
    camera.add(listener);
    const PositionalAudio = new THREE.PositionalAudio(listener);

    const audioLoader = new THREE.AudioLoader();

    audioLoader.load(audioUrl, AudioBuffer => {
      PositionalAudio.setBuffer(AudioBuffer);
      PositionalAudio.setVolume(volume || 0.9); //音量
      PositionalAudio.setRefDistance(refDistance || 1); //参数值越大,声音越大

      resolve(PositionalAudio);
    });
  });
};

/**
 * 生成地板
 */

const addPlane = (size: number, params: object): THREE.Mesh => {
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({
      ...params
    })
  );

  plane.rotation.x = -Math.PI / 2;

  return plane;
};

/**
 * 加载fbx
 */

const loadFBX = (url: string, callback: (arg0: object) => void) => {
  const loader = new FBXLoader();
  // 加载人物
  loader.load(url, object => {
    callback && callback(object);
  });
};

/**
 * 加载OBJ
 */

const loadOBJ = (url: string, callback: (arg0: object) => void) => {
  const loader = new OBJLoader();
  // 加载人物
  loader.load(url, object => {
    callback && callback(object);
  });
};

/**
 * 加载GLTF
 */

const loadGLTF = async (url: string) => {
  return new Promise(resolve => {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader(dracoLoader)
    loader.load(url, object => {
      resolve(object as unknown as THREE.Group);
    });
  });
};

const calcObject3DSize = (object3d: THREE.Object3D) => {
  const box = new THREE.Box3().setFromObject(object3d);
  const width = box.max.x + box.min.x;
  const height = box.max.y + box.min.y;

  return { width, height };
};

export default {
  addPlane,
  appendCanvasToElement,
  generateCube,
  addOrbitControls,
  initCamera,
  initRenderer,
  addAdaptionScreen,
  judgeRaycasterTouchObject,
  addTextureLoader,
  addPositionalAudio,
  addLockControls,
  loadFBX,
  loadOBJ,
  loadGLTF,
  calcObject3DSize
};
