import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


function Model() {

const shoes = [
   {image : "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSd_hkRSfNBKYShwz2ls2kTtFl1n3eBcRfyhojPIxIPO-zuS9hRIKqKEdrPVdiXSbBKGg-eWbCSfbWSqgJchv3bhRfCjyc4SRTaAeSW3XoQXNGaRNYUv_nOvTY" , title : "Performance running shoes"  ,link : "Enginered for speed and comfort"},
   {image : "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT9iVQIt75QKTUgFPQKp3kZhx2bR_8_jHmjA9OG_Og-nmxF5fXttsRqgeTM4ucPLtnb36Fz5KEq_l2l1roH_xgTJl0DKID2xpStsppS_P5Gfj-GPcHrfXc38Q" , title : "High-top Basketball Shoes"  ,link : "Dominate the court with style"},
   {image : "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQ5dnqCoWcq72QVljqCKbb8bv7eOPx2lq3Day1ND-Ah8R6cKfSTKXUA3BtgEFYCWr1ZjltLd3KSX9Q2XhQLElvUSQ9K7uNqmrvB6IcKgrOH3AydlnP-MJsl" , title : "Rugged Hiking"  ,link : "Conquer any trail with confidance"},
]

const arrivals = [
   {image : "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSsxL2gTvWYkKfxDTSCE5u6MKhhzX4VAxx9wsEQxbItz5_VTTnthSp9MDWk82_kalpMwKYA0RMZUtwA7jPVYBlFrRzQ6zupIbvTbQSYkU3RZDSlBoHRMfO0" , title : "Performance running shoes"},
   {image : "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTZS8mQyOPVZVpXZblV263abVtPxg5NmVmEju9Uo7dV9HyGzo78hqB3FJ_9WwHGO06ziim-WZ6xkca97cXb-Bh_0ZmqMVog6RUF8LZB5ITj9bZlsVVfQJ4XunQ" , title : "High-top Basketball Shoes"},
   {image : "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQywvjRK5ARa_BU61mZMW_tWf31UjaxoOQPq28xZwzcm-SOkIERRAFltDgOw1tXCClWjyqM9NSYaE8blLsO4OKj9Mw-GetC-n0R3rxHDrHWcRvDMk5XpgDo" , title : "Rugged Hiking"},
     {image : "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRyy9QPOZ-qGvhXVRHEh99Ym6535RwSJ6qN9IlUYgsFyEIH5EGKcwvvnAKZPVOfbVxF8anACKpNhh32eT8QCUEK2ohr7jI4tM54tyOfmITdfqRGyqRrIz5vwA" , title : "Rugged Hiking"},
]


  const canvasRef = useRef();
  gsap.registerPlugin(useGSAP);

  useGSAP


  useEffect(() => {
 
    const scene = new THREE.Scene();
   

    const camera = new THREE.PerspectiveCamera(
      15,
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
