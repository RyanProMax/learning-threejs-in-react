import * as THREE from 'three';
import { useRef, useEffect, useCallback, useState } from 'react';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import Stats from '../libs/Stats';
import DatGui, { DatNumber } from 'react-dat-gui';
import 'react-dat-gui/dist/dist/index.css';

export default function ControlGui() {
  const ControlGui = useRef(null);
  const threeRef = useRef({
    step: 0
  });
  const [data, setData] = useState({
    rotationSpeed: 0.02,
    bouncingSpeed: 0.03
  });

  const handleUpdate = newData => {
    setData(prevData => ({ ...prevData, ...newData }));
  };

  function init() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // create plane
    const planeGeometry = new THREE.PlaneGeometry(60, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    scene.add(plane);

    // create a cube
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-4, 3, 0);
    scene.add(cube);

    // create a sphere
    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x7777ff
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(20, 4, 2);
    scene.add(sphere);

    // add light
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 40, -15);
    spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    spotLight.shadow.camera.far = 130;
    spotLight.shadow.camera.near = 40;
    scene.add(spotLight);

    // enable shadow
    spotLight.castShadow = true;
    renderer.shadowMap.enabled = true;
    // mesh should enable shadow too
    plane.receiveShadow = true;
    cube.castShadow = true;
    sphere.castShadow = true;

    // positon and point the camera to the center of the scene
    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    // add the output of the renderer to the html element
    ControlGui.current.appendChild(renderer.domElement);

    // render the scene
    renderer.render(scene, camera);

    // controls
    const controls = new TrackballControls(camera, renderer.domElement);

    threeRef.current = {
      ...threeRef.current,
      scene,
      camera,
      renderer,
      cube,
      sphere,
      controls
    };
  }

  const renderScene = useCallback(() => {
    const { stats, scene, camera, renderer, cube, sphere, step, controls } = threeRef.current;

    controls.update();

    stats.update();
    cube.rotation.x += data.rotationSpeed;
    cube.rotation.y += data.rotationSpeed;
    cube.rotation.z += data.rotationSpeed;

    threeRef.current.step += data.bouncingSpeed;
    sphere.position.x = 20 + 10 * Math.cos(step);
    sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

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
    stats.domElement.style.top = '60px';

    ControlGui.current.appendChild(stats.domElement);

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
  }, []);

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
      <div ref={ControlGui} />
      <DatGui data={data} onUpdate={handleUpdate}>
        <DatNumber path='rotationSpeed' label='RotationSpeed' min={0} max={0.1} step={0.01} />
        <DatNumber path='bouncingSpeed' label='BouncingSpeed' min={0} max={0.1} step={0.01} />
      </DatGui>
    </>
  );
}
