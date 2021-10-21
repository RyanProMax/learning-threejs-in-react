import * as THREE from 'three';
import { useRef, useEffect, useCallback, useState } from 'react';
import Stats from '../libs/Stats';
import DatGui, { DatNumber, DatButton } from 'react-dat-gui';

export default function BasicScene() {
  const BasicScene = useRef(null);
  const threeRef = useRef({
    step: 0
  });
  const [data, setData] = useState({});

  const handleUpdate = newData => {
    setData(prevData => ({ ...prevData, ...newData }));
  };

  function init() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xeeeeee));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // create plane
    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    // positon and point the camera to the center of the scene
    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    // add subtle ambient lighting
    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // add spotlight for the shadows
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // add fog
    scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
    // scene.fog = new THREE.FogExp2(0xffffff, 0.01);

    // add the output of the renderer to the html element
    BasicScene.current.appendChild(renderer.domElement);

    // render the scene
    renderer.render(scene, camera);

    // controls
    class Control {
      constructor() {
        this.rotationSpeed = 0.02;
        this.numberOfObjects = scene.children.length;
      }

      removeCube() {
        const allChildren = scene.children;
        const lastObject = allChildren[allChildren.length - 1];
        if (lastObject instanceof THREE.Mesh) {
          scene.remove(lastObject);
          this.numberOfObjects = scene.children.length;
        }
      }

      addCube() {
        const cubeSize = Math.ceil(Math.random() * 3);
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        cube.name = 'cube-' + scene.children.length;

        // position the cube randomly in the scene
        cube.position.x = -30 + Math.round(Math.random() * planeGeometry.parameters.width);
        cube.position.y = Math.round(Math.random() * 5);
        cube.position.z = -20 + Math.round(Math.random() * planeGeometry.parameters.height);

        // add the cube to the scene
        scene.add(cube);
        this.numberOfObjects = scene.children.length;
      }

      outputObjects() {
        console.log(scene.children);
      }
    }

    setData(new Control());

    threeRef.current = {
      ...threeRef.current,
      scene,
      camera,
      renderer,
      plane
    };
  }

  const renderScene = useCallback(() => {
    const { stats, scene, camera, renderer, plane } = threeRef.current;

    stats.update();

    // rotate the cubes around its axes
    scene.traverse(e => {
      if (e instanceof THREE.Mesh && e !== plane) {
        e.rotation.x += data.rotationSpeed;
        e.rotation.y += data.rotationSpeed;
        e.rotation.z += data.rotationSpeed;
      }
    });

    threeRef.current.step += 0.04;

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
    stats.domElement.style.top = '120px';

    BasicScene.current.appendChild(stats.domElement);

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
      <div ref={BasicScene} />
      <DatGui data={data} onUpdate={handleUpdate}>
        <DatNumber path='rotationSpeed' label='RotationSpeed' min={0} max={0.1} step={0.01} />
        <DatButton
          label='addCube'
          onClick={() => {
            data.addCube();
          }}
        />
        <DatButton
          label='removeCube'
          onClick={() => {
            data.removeCube();
          }}
        />
        <DatButton
          label='outputObjects'
          onClick={() => {
            data.outputObjects();
          }}
        />
      </DatGui>
    </>
  );
}
