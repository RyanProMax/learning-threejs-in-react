import * as THREE from 'three';
import { useRef, useEffect, useCallback } from 'react';
import Stats from '../libs/Stats';

export default function MaterialsLightAnimation() {
  const MaterialsLightAnimation = useRef(null);
  const threeRef = useRef({
    step: 0
  });

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
    MaterialsLightAnimation.current.appendChild(renderer.domElement);

    // render the scene
    renderer.render(scene, camera);

    threeRef.current = {
      ...threeRef.current,
      scene,
      camera,
      renderer,
      cube,
      sphere
    };
  }

  const renderScene = useCallback(() => {
    const { stats, scene, camera, renderer, cube, sphere, step } = threeRef.current;

    stats.update();
    cube.rotation.x += 0.02;
    cube.rotation.y += 0.02;
    cube.rotation.z += 0.02;

    threeRef.current.step += 0.04;
    sphere.position.x = 20 + 10 * Math.cos(step);
    sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

    threeRef.current.timer = requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
  }, []);

  // show FPS
  function initStats() {
    const stats = new Stats();

    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '0px';
    stats.domElement.style.top = '0px';

    MaterialsLightAnimation.current.appendChild(stats.domElement);

    threeRef.current.stats = stats;
  }

  useEffect(() => {
    init();
    initStats();
    renderScene();

    return () => {
      threeRef.current.timer && cancelAnimationFrame(threeRef.current.timer);
    };
  }, [renderScene]);

  return <div ref={MaterialsLightAnimation} />;
}
