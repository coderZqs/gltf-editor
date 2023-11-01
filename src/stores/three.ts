import { ref, Ref, toRaw } from "vue";
import * as THREE from "three";
import T from "@/utils/threeUtils";
import { defineStore } from "pinia";
import gsap from "gsap";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";

export default defineStore("three", () => {
  let camera: THREE.PerspectiveCamera = T.initCamera();
  let renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
  let scene: THREE.Scene = new THREE.Scene();
  let model: Ref<THREE.Object3D> = ref({} as THREE.Object3D);
  let composer = {} as EffectComposer;
  let outlinePass = ref({} as OutlinePass);

  const setOutLineEffect = (width, height) => {
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    outlinePass.value = new OutlinePass(
      new THREE.Vector2(width, height),
      scene,
      camera
    );

    let params = {
      edgeStrength: 10, // 边缘强度
      edgeGlow: 1, // 边缘发光
      edgeThickness: 4, // 边缘厚度
      pulsePeriod: 5, // 脉冲周期
      rotate: false,
      usePatternTexture: false
    };

    outlinePass.value.edgeStrength = Number(params.edgeStrength);
    outlinePass.value.edgeGlow = Number(params.edgeGlow);
    outlinePass.value.edgeThickness = Number(params.edgeThickness);
    outlinePass.value.pulsePeriod = Number(params.pulsePeriod);
    outlinePass.value.visibleEdgeColor.set("#ffffff");
    outlinePass.value.hiddenEdgeColor.set("#ffffff");

    composer.addPass(toRaw(outlinePass.value));
  };

  /**
   * 设置屏幕大小
   */

  const setScreenSize = dom => {
    let { width, height } = dom.getBoundingClientRect();
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    return { width, height };
  };

  /**
   * 初始化场景
   */

  const initScreen = dom => {
    if (renderer && camera && scene) {
      let { width, height } = setScreenSize(dom);
      setCameraToModelSide();
      setOutLineEffect(width, height);

      let controls = T.addOrbitControls(camera, renderer.domElement);
      T.appendCanvasToElement(dom, renderer.domElement);
      // controls.enableDamping = true;

      window.addEventListener("resize", () => {
        setScreenSize(dom);
      });

      let animate = () => {
        requestAnimationFrame(animate);
        composer.render();

        renderer.setClearColor(0x272822);
        // renderer!.render(scene!, camera!);
        controls.update();
      };

      animate();
    }
  };

  const setCameraToModelSide = () => {
    var box = new THREE.Box3().setFromObject(model.value);
    var size = box.getSize(new THREE.Vector3());

    const helper = new THREE.Box3Helper(box);
    scene.add(helper);

    let maxValue = Math.max(size.x, size.y, size.z);

    gsap.to(camera.position, {
      x: maxValue * 2.5,
      y: maxValue * 2.5,
      z: maxValue * 2.5,
      onUpdate: function () {
        camera.lookAt(model.value.position);
      },
      onComplete: function () {
        console.log(camera.position);
      }
    });
  };

  return {
    camera,
    renderer,
    scene,
    model,
    initScreen,
    composer,
    outlinePass
  };
});
