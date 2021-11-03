import * as THREE from 'three';
import { useRef, useEffect, useCallback, useState } from 'react';
import Stats from '../libs/Stats';
import DatGui, { DatNumber, DatFolder, DatBoolean } from 'react-dat-gui';

export default function CustomGeometry() {
  const CustomGeometry = useRef(null);
  const threeRef = useRef({});
  const [data, setData] = useState({
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,

    positionX: 0,
    positionY: 4,
    positionZ: 0,

    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,

    scale: 1,

    translateX: 0,
    translateY: 0,
    translateZ: 0,

    visible: true
  });

  const handleUpdate = newData => {
    setData(prevData => ({ ...prevData, ...newData }));
  };

  const init = useCallback(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xeeeeee));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // create the ground plane
    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    // add the plane to the scene
    scene.add(plane);

    // position and point the camera to the center of the scene
    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    // add subtle ambient lighting
    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // add spotlight for the shadows
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, 20);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // add the output of the renderer to the html element
    CustomGeometry.current.appendChild(renderer.domElement);

    // render the scene
    renderer.render(scene, camera);

    // cube
    const material = new THREE.MeshLambertMaterial({ color: 0x44ff44 });
    const geom = new THREE.BoxGeometry(5, 8, 3);
    const cube = new THREE.Mesh(geom, material);
    cube.position.y = 4;
    cube.castShadow = true;
    scene.add(cube);

    threeRef.current = {
      scene,
      camera,
      renderer,
      cube
    };
  }, []);

  const renderScene = useCallback(() => {
    const { stats, scene, camera, renderer, cube } = threeRef.current;

    stats.update();

    cube.rotation.set(data.rotationX, data.rotationY, data.rotationZ);
    cube.position.set(data.positionX, data.positionY, data.positionZ);
    cube.scale.set(data.scaleX, data.scaleY, data.scaleZ);
    cube.translateX(data.translateX);
    cube.translateY(data.translateY);
    cube.translateZ(data.translateZ);
    cube.visible = data.visible;

    threeRef.current.timer = requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
  }, [data]);

  // show FPS
  function initStats() {
    const stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '16px';
    stats.domElement.style.bottom = '16px';

    CustomGeometry.current.appendChild(stats.domElement);

    threeRef.current.stats = stats;
  }

  // resize
  function onResize() {
    const { camera, renderer } = threeRef.current;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  useEffect(() => {
    init();
    initStats();
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, [init]);

  useEffect(() => {
    renderScene();

    return () => {
      if (threeRef.current.timer) {
        cancelAnimationFrame(threeRef.current.timer);
        threeRef.current.timer = null;
      }
    };
  }, [renderScene]);

  return (
    <>
      <div ref={CustomGeometry} />
      <DatGui data={data} onUpdate={handleUpdate}>
        <DatFolder title='scale' closed={false}>
          <DatNumber path='scaleX' label='scaleX' min={0.1} max={5} step={0.1} />
          <DatNumber path='scaleY' label='scaleY' min={0.1} max={5} step={0.1} />
          <DatNumber path='scaleZ' label='scaleZ' min={0.1} max={5} step={0.1} />
        </DatFolder>
        <DatFolder title='position' closed={false}>
          <DatNumber path='positionX' label='positionX' min={-10} max={10} step={1} />
          <DatNumber path='positionY' label='positionY' min={-10} max={10} step={1} />
          <DatNumber path='positionZ' label='positionZ' min={-10} max={10} step={1} />
        </DatFolder>
        <DatFolder title='rotation' closed={false}>
          <DatNumber path='rotationX' label='rotationX' min={-10} max={10} step={0.1} />
          <DatNumber path='rotationY' label='rotationY' min={-10} max={10} step={0.1} />
          <DatNumber path='rotationZ' label='rotationZ' min={-10} max={10} step={0.1} />
        </DatFolder>
        <DatFolder title='translate' closed={false}>
          <DatNumber path='translateX' label='translateX' min={-10} max={10} step={1} />
          <DatNumber path='translateY' label='translateY' min={-10} max={10} step={1} />
          <DatNumber path='translateZ' label='translateZ' min={-10} max={10} step={1} />
        </DatFolder>
        <DatBoolean path='visible' label='visible' />
      </DatGui>
    </>
  );
}
