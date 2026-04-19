import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/** Move model so its bounding box center sits at the origin (call once after load). */
function centerModelOnOrigin(object) {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  object.position.sub(center);
}

/** Place camera from current model bounds without changing model position. */
function fitCameraToModel(object, camera, controls, margin = 1.15) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 0.001);

  const vFov = (camera.fov * Math.PI) / 180;
  const fitHeight = maxDim / (2 * Math.tan(vFov / 2));
  const fitWidth = fitHeight / Math.max(camera.aspect, 0.2);
  const distance = margin * Math.max(fitHeight, fitWidth);

  const offset = new THREE.Vector3(1.05, 0.52, 1.12).normalize().multiplyScalar(distance);
  camera.position.copy(offset);
  camera.near = Math.max(0.01, distance / 120);
  camera.far = distance * 120;
  camera.updateProjectionMatrix();

  const targetY = size.y * 0.06;
  controls.target.set(0, targetY, 0);
  controls.update();
}

function Model() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  gsap.registerPlugin(useGSAP);

  useGSAP(() => {
    const el = wrapRef.current;
    if (!el) return;
    gsap.from(el, {
      opacity: 0,
      y: 28,
      duration: 1.1,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;

    const scene = new THREE.Scene();
    const isMobile = window.innerWidth < 768;
    const camera = new THREE.PerspectiveCamera(isMobile ? 42 : 36, 1, 0.05, 200);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 3.4;
    controls.maxPolarAngle = Math.PI / 2.02;
    controls.rotateSpeed = 0.62;

    const hemi = new THREE.HemisphereLight(0xffffff, 0x1a1a24, 0.88);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 1.05);
    key.position.set(5, 9, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xa8b8ff, 0.32);
    rim.position.set(-6, 3, -5);
    scene.add(rim);

    let frameId = 0;
    let root = null;
    const margin = isMobile ? 1.14 : 1.06;

    const resize = () => {
      const w = Math.max(1, wrap.clientWidth);
      const h = Math.max(1, wrap.clientHeight);
      const pr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(pr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (root) fitCameraToModel(root, camera, controls, margin);
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);
    resize();

    const loader = new GLTFLoader();
    loader.load(
      "/shoes.glb",
      (gltf) => {
        if (root) scene.remove(root);
        root = gltf.scene;
        root.rotation.y = Math.PI * 0.92;
        scene.add(root);
        centerModelOnOrigin(root);
        fitCameraToModel(root, camera, controls, margin);
      },
      undefined,
      (err) => console.error("GLTF load error:", err)
    );

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      if (root) {
        root.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry?.dispose?.();
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach((m) => {
              m?.map?.dispose?.();
              m?.dispose?.();
            });
          }
        });
      }
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative flex h-full min-h-[280px] w-full flex-1 items-center justify-center sm:min-h-[320px] lg:min-h-[360px]"
    >
      <canvas ref={canvasRef} className="block h-full w-full touch-none" />
    </div>
  );
}

export default Model;
