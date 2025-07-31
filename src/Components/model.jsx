import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


function Model(glbfile) {
  const canvasRef = useRef();
  gsap.registerPlugin(useGSAP);
  
  useEffect(() => {
 
    const scene = new THREE.Scene();
   
    const camera = new THREE.PerspectiveCamera(
      19,
      window.innerWidth.clientWidth / window.innerHeight.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 7.5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });

 renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
     camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
   camera.updateProjectionMatrix();

const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; 
  controls.dampingFactor = 0.1;
  controls.enableZoom = false;
    
    const ambient = new THREE.AmbientLight(0xffffff, 10);
    scene.add(ambient);

 
    const loader = new GLTFLoader();
    loader.load(
      '/shoes.glb', 
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);
      },
    );
        const animate = () => {
      requestAnimationFrame(animate);
       controls.update()
      renderer.render(scene, camera);
    };
     animate();
  }, []);
useGSAP(()=>{
   gsap.from("#one" ,{
        y  : -500 , 
       duration : 1.5, 
       ease : "power2.out",
   })
      
}, [])


  return (
   <>
 <div className='sm:mt-24  overflow-hidden'>
  <canvas ref={canvasRef} id="one" className='sm:h-[80vh] sm:w-[100vw] w-[50vh] h-[50vh] z-50 '/>
 </div>
</>
   )
}

export default Model;
