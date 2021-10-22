import * as THREE from 'three';
import { createMultiMaterialObject } from 'three/examples/jsm/utils/SceneUtils';
import { useRef, useEffect, useCallback, useState } from 'react';
import Stats from '../libs/Stats';
import DatGui, { DatNumber, DatFolder, DatButton } from 'react-dat-gui';

export default function CustomGeometry() {
  const CustomGeometry = useRef(null);
  const threeRef = useRef({});
  const [data, setData] = useState({});

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
    camera.position.set(-20, 25, 20);
    camera.lookAt(new THREE.Vector3(5, 0, 0));

    // add subtle ambient lighting
    // const ambientLight = new THREE.AmbientLight(0x494949);
    // scene.add(ambientLight);

    // add spotlight for the shadows
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, 10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // add the output of the renderer to the html element
    CustomGeometry.current.appendChild(renderer.domElement);

    // render the scene
    renderer.render(scene, camera);

    // custom geometry
    const vertices = [
      new THREE.Vector3(1, 3, 1),
      new THREE.Vector3(1, 3, -1),
      new THREE.Vector3(1, -1, 1),
      new THREE.Vector3(1, -1, -1),
      new THREE.Vector3(-1, 3, -1),
      new THREE.Vector3(-1, 3, 1),
      new THREE.Vector3(-1, -1, -1),
      new THREE.Vector3(-1, -1, 1)
    ];

    // 书中示例的 Face3 构造器在 r126 已被移除，这里转换成新语法
    const generatePoints = vertices => {
      const generateFace = (vertice1, vertice2, vertice3) => {
        return [vertices[vertice1], vertices[vertice2], vertices[vertice3]];
      };
      const faces = [
        generateFace(0, 2, 1),
        generateFace(2, 3, 1),
        generateFace(4, 6, 5),
        generateFace(6, 7, 5),
        generateFace(4, 5, 1),
        generateFace(5, 0, 1),
        generateFace(7, 6, 2),
        generateFace(6, 3, 2),
        generateFace(5, 7, 0),
        generateFace(7, 2, 0),
        generateFace(1, 3, 4),
        generateFace(3, 6, 4)
      ];
      return faces.flat(1);
    };

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(generatePoints(vertices));
    geometry.computeVertexNormals();

    const materials = [new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0x44ff44, transparent: true }), new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })];

    const mesh = createMultiMaterialObject(geometry, materials);
    mesh.children.forEach(function (e) {
      e.castShadow = true;
    });
    mesh.position.setY(1.1);
    scene.add(mesh);

    // control
    const addControl = (x, y, z) => ({ x, y, z });
    const controlPoints = [];
    controlPoints.push(addControl(3, 5, 3));
    controlPoints.push(addControl(3, 5, 0));
    controlPoints.push(addControl(3, 0, 3));
    controlPoints.push(addControl(3, 0, 0));
    controlPoints.push(addControl(0, 5, 0));
    controlPoints.push(addControl(0, 5, 3));
    controlPoints.push(addControl(0, 0, 0));
    controlPoints.push(addControl(0, 0, 3));
    handleUpdate({ controlPoints });

    threeRef.current = {
      scene,
      camera,
      renderer,
      mesh,
      generatePoints
    };
  }, []);

  const renderScene = useCallback(() => {
    const { stats, scene, camera, renderer, mesh } = threeRef.current;

    stats.update();

    const vertices = data.controlPoints;

    console.log(vertices);

    mesh.children.forEach(e => {
      // e.geometry.setFromPoints(generatePoints(vertices));
      // e.geometry.computeVertexNormals();
    });

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
        {data.controlPoints &&
          data.controlPoints.map(({ x, y, z }, idx) => (
            <DatFolder key={idx} title={`Vertices ${idx + 1}`}>
              <DatNumber path={`controlPoints.${idx}.x`} label='x' min={-10} max={10} step={1} />
              <DatNumber path={`controlPoints.${idx}.y`} label='y' min={-10} max={10} step={1} />
              <DatNumber path={`controlPoints.${idx}.z`} label='z' min={-10} max={10} step={1} />
            </DatFolder>
          ))}
        <DatButton
          label='addCube'
          onClick={() => {
            data.addCube();
          }}
        />
      </DatGui>
    </>
  );
}
