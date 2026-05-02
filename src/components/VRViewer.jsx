import { useEffect, useRef } from "react";
import * as THREE from "three";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";

const VRViewer = ({
  panoramas,
  initialSceneId,
  hotspotsMap,
  pulsingHotspots,
  labelHotspotsMap,
  navLinks,
}) => {
  const labelSpriteRef = useRef(null);
  const textSpriteRef = useRef(null);
  const mountRef = useRef();
  const materialRef = useRef();
  const hotspotObjectsRef = useRef([]);
  const navMenuObjectsRef = useRef([]);
  const currentSceneRef = useRef(initialSceneId);

  useEffect(() => {
    const scene = new THREE.Scene();

    const clock = new THREE.Clock();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000,
    );
    camera.position.set(0, 0, 0.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    // 🌐 Sphere
    const geometry = new THREE.SphereGeometry(500, 64, 64);
    geometry.scale(-1, 1, 1);
    geometry.rotateY(-Math.PI / 2);
    const material = new THREE.MeshBasicMaterial();
    materialRef.current = material;

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const loader = new THREE.TextureLoader();

    // 🔥 CREATE HOTSPOTS
    const createHotspots = (sceneId) => {
      // remove old
      hotspotObjectsRef.current.forEach((h) => scene.remove(h));
      hotspotObjectsRef.current = [];

      // 1️⃣ Walkthrough
      const walkHotspotsObj = hotspotsMap[sceneId] || {};
      const walkHotspots = Object.values(walkHotspotsObj);

      // 2️⃣ Aerial navigation
      const aerialHotspots =
        sceneId === "aerial" ? pulsingHotspots["aerial"] || [] : [];

      // 3️⃣ Label pins
      const labelHotspots =
        sceneId === "aerial" ? labelHotspotsMap["aerial"] || [] : [];

      const allHotspots = [
        ...walkHotspots.map((h) => ({ ...h, type: "walk" })),
        ...aerialHotspots.map((h) => ({ ...h, type: "aerial" })),
        ...labelHotspots.map((h) => ({ ...h, type: "label" })),
      ];

      allHotspots.forEach((spot) => {
        const { pitch, yaw, sceneId: targetId, type } = spot;

        let mesh;

        // 📍 LABEL PIN
        if (type === "label") {
          mesh = new THREE.Mesh(
            new THREE.ConeGeometry(6, 20, 16),
            new THREE.MeshBasicMaterial({ color: 0x00ffff }),
          );
        } else {
          // 🔴 / 🟣 spheres
          mesh = new THREE.Mesh(
            new THREE.SphereGeometry(type === "aerial" ? 8 : 4, 16, 16),
            new THREE.MeshBasicMaterial({
              color: 0xffffff,
            }),
          );
        }

        const phi = THREE.MathUtils.degToRad(90 - pitch);
        const theta = THREE.MathUtils.degToRad(yaw + 270);

        const r = 400;

        mesh.position.set(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta),
        );

        // 📍 rotate pin inward
        if (type === "label") {
          mesh.lookAt(0, 0, 0);
        }

        mesh.material.depthTest = false;
        mesh.renderOrder = 999;

        mesh.userData = {
          sceneId: targetId || null,
          type,
          label: spot.label || null,
          text: spot.text || null,
        };

        scene.add(mesh);
        hotspotObjectsRef.current.push(mesh);
      });
    };

    // 🌐 LOAD SCENE
    const loadScene = (sceneId) => {
      const pano = panoramas.find((p) => p.id === sceneId);
      if (!pano) return;

      loader.load(pano.image, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        material.map = texture;
        material.needsUpdate = true;
      });

      createHotspots(sceneId);
    };

    loadScene(currentSceneRef.current);
    createNavigationPanel();
    createLogo();

    // 🎯 RAYCASTER
    const raycaster = new THREE.Raycaster();
    const controllers = [];

    for (let i = 0; i < 2; i++) {
      const controller = renderer.xr.getController(i);
      scene.add(controller);

      // 🔴 laser
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 0, -1),
        ]),
        new THREE.LineBasicMaterial({ color: 0xffffff }),
      );
      line.scale.z = 1000;
      line.name = "line";
      controller.add(line);

      // ⚪ pointer
      const pointer = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
      );
      pointer.position.z = -1000;
      pointer.name = "pointer";
      controller.add(pointer);

      // 🎯 CLICK
      controller.addEventListener("selectstart", () => {
        const tempMatrix = new THREE.Matrix4();
        tempMatrix.identity().extractRotation(controller.matrixWorld);

        raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

        const hits = raycaster.intersectObjects([
          ...hotspotObjectsRef.current,
          ...navMenuObjectsRef.current,
        ]);

        if (hits.length > 0) {
          const obj = hits[0].object;
          const data = obj.userData;

          if (data.type === "nav-button") {
            if (data.sceneId) {
              currentSceneRef.current = data.sceneId;
              loadScene(data.sceneId);
            }
            return;
          }

          // 📍 LABEL → NO NAVIGATION
          if (data.type === "label") {
            console.log("📍 Location:", data.label);
            return;
          }

          if (!data.sceneId) return;

          currentSceneRef.current = data.sceneId;
          loadScene(data.sceneId);
        }
      });

      controllers.push(controller);
    }

    function createTextSprite(text) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const fontFace = "Arial";
      const fontSize = 32;
      const padding = 10;

      ctx.font = `bold ${fontSize}px ${fontFace}`;
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;

      canvas.width = textWidth + padding * 2;
      canvas.height = fontSize + padding * 2;

      ctx.fillStyle = "white";
      ctx.font = `bold ${fontSize}px ${fontFace}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
      });

      const sprite = new THREE.Sprite(material);
      const scale = 40;
      sprite.scale.set((scale * canvas.width) / canvas.height, scale, 1);
      sprite.renderOrder = 1000;
      material.depthTest = false;

      return sprite;
    }

    function createLabelSprite(data) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const fontFace = "Arial";
      const titleFontSize = 30;
      const regularFontSize = 22;
      const padding = 20;
      const lineHeight = 35;
      const cornerRadius = 10;
      const travelText = `🚗 ${data.travel.car} | 🏍️ ${data.travel.bike} | 🚶 ${data.travel.walk}`;

      // 1. Measure text
      ctx.font = `bold ${titleFontSize}px ${fontFace}`;
      const titleWidth = ctx.measureText(data.title).width;
      ctx.font = `${regularFontSize}px ${fontFace}`;
      const distanceWidth = ctx.measureText(data.distance).width;
      const travelWidth = ctx.measureText(travelText).width;

      const contentWidth = Math.max(titleWidth, distanceWidth, travelWidth);
      const canvasWidth = contentWidth + padding * 2;
      const canvasHeight = 130;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // 2. Draw background
      ctx.fillStyle = "rgba(26, 26, 26, 0.7)";
      ctx.beginPath();
      ctx.moveTo(cornerRadius, 0);
      ctx.lineTo(canvasWidth - cornerRadius, 0);
      ctx.quadraticCurveTo(canvasWidth, 0, canvasWidth, cornerRadius);
      ctx.lineTo(canvasWidth, canvasHeight - cornerRadius);
      ctx.quadraticCurveTo(
        canvasWidth,
        canvasHeight,
        canvasWidth - cornerRadius,
        canvasHeight,
      );
      ctx.lineTo(cornerRadius, canvasHeight);
      ctx.quadraticCurveTo(0, canvasHeight, 0, canvasHeight - cornerRadius);
      ctx.lineTo(0, cornerRadius);
      ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
      ctx.closePath();
      ctx.fill();

      // 3. Draw text
      ctx.fillStyle = "white";
      ctx.textAlign = "left";

      // Title
      ctx.font = `bold ${titleFontSize}px ${fontFace}`;
      ctx.fillText(data.title, padding, padding + titleFontSize);

      // Distance
      ctx.font = `${regularFontSize}px ${fontFace}`;
      ctx.globalAlpha = 0.8;
      ctx.fillText(
        data.distance,
        padding,
        padding + titleFontSize + lineHeight,
      );
      ctx.globalAlpha = 1.0;

      // Travel
      ctx.fillText(
        travelText,
        padding,
        padding + titleFontSize + lineHeight * 2,
      );

      // 4. Create sprite
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
      });
      const sprite = new THREE.Sprite(material);

      const scale = 35;
      sprite.scale.set((scale * canvas.width) / canvas.height, scale, 1);
      sprite.renderOrder = 1000;
      material.depthTest = false;

      return sprite;
    }

    function createNavigationPanel() {
      const panel = new THREE.Group();
      const buttonWidth = 1.2;
      const buttonHeight = 0.3;
      const buttonMargin = 0.1;
      const linkNames = Object.keys(navLinks);
      const totalWidth =
        linkNames.length * (buttonWidth + buttonMargin) - buttonMargin;

      linkNames.forEach((linkName, i) => {
        const sceneId = navLinks[linkName].sceneId;
        const button = createNavButton(linkName, buttonWidth, buttonHeight);
        const x =
          -totalWidth / 2 + i * (buttonWidth + buttonMargin) + buttonWidth / 2;
        button.position.set(x, 0, 0);
        button.userData = {
          type: "nav-button",
          sceneId,
          text: linkName,
          state: "normal",
        };
        panel.add(button);
        navMenuObjectsRef.current.push(button);
      });

      panel.position.set(0, -1, -4);
      scene.add(panel);
    }

    function drawButton(ctx, width, height, text, bgColor, textColor) {
      const fontFace = "Arial";
      const fontSize = 60;
      const cornerRadius = 30;

      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.moveTo(cornerRadius, 0);
      ctx.lineTo(width - cornerRadius, 0);
      ctx.quadraticCurveTo(width, 0, width, cornerRadius);
      ctx.lineTo(width, height - cornerRadius);
      ctx.quadraticCurveTo(width, height, width - cornerRadius, height);
      ctx.lineTo(cornerRadius, height);
      ctx.quadraticCurveTo(0, height, 0, height - cornerRadius);
      ctx.lineTo(0, cornerRadius);
      ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
      ctx.closePath();
      ctx.fill();

      // Text
      ctx.fillStyle = textColor;
      ctx.font = `bold ${fontSize}px ${fontFace}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, width / 2, height / 2);
    }

    function createNavButton(text, width, height) {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");

      drawButton(
        ctx,
        canvas.width,
        canvas.height,
        text,
        "rgba(0, 0, 0, 0.2)",
        "white",
      );

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      });
      const geometry = new THREE.PlaneGeometry(width, height);
      const mesh = new THREE.Mesh(geometry, material);

      return mesh;
    }

    function createLogo() {
      loader.load(
        "./logo.png",
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          const aspectRatio = texture.image.width / texture.image.height;
          const logoHeight = 0.7; // Increased logo size
          const logoWidth = logoHeight * aspectRatio;

          const geometry = new THREE.PlaneGeometry(logoWidth, logoHeight);
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
          });

          const logo = new THREE.Mesh(geometry, material);

          // Position it just above the navigation panel
          logo.position.set(0, -0.3, -4);

          // Make it render on top of other objects
          logo.renderOrder = 999;
          material.depthTest = false;

          scene.add(logo);
        },
        undefined,
        (err) => {
          console.error("An error occurred while loading the logo:", err);
        },
      );
    }

    // 🎯 HOVER
    function updateRay(controller) {
      const tempMatrix = new THREE.Matrix4();
      tempMatrix.identity().extractRotation(controller.matrixWorld);

      raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
      raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

      const allInteractableObjects = [
        ...hotspotObjectsRef.current,
        ...navMenuObjectsRef.current,
      ];
      const hits = raycaster.intersectObjects(allInteractableObjects);
      const hoveredObject = hits.length > 0 ? hits[0].object : null;

      // --- Handle Label Sprite ---
      const isHoveringLabel =
        hoveredObject &&
        hoveredObject.userData.type === "label" &&
        hoveredObject.userData.label;

      if (isHoveringLabel) {
        if (!labelSpriteRef.current) {
          labelSpriteRef.current = createLabelSprite(
            hoveredObject.userData.label,
          );
          labelSpriteRef.current.material.opacity = 0;
          scene.add(labelSpriteRef.current);
        }
        labelSpriteRef.current.position
          .copy(hoveredObject.position)
          .add(new THREE.Vector3(0, 25, 0));
      }

      if (labelSpriteRef.current) {
        const targetOpacity = isHoveringLabel ? 1 : 0;
        const spriteMaterial = labelSpriteRef.current.material;
        spriteMaterial.opacity +=
          (targetOpacity - spriteMaterial.opacity) * 0.1;

        if (spriteMaterial.opacity < 0.01 && !isHoveringLabel) {
          scene.remove(labelSpriteRef.current);
          labelSpriteRef.current = null;
        }
      }

      // --- Handle Text Sprite for Aerial ---
      const isHoveringAerial =
        hoveredObject &&
        hoveredObject.userData.type === "aerial" &&
        hoveredObject.userData.text;

      if (isHoveringAerial) {
        if (!textSpriteRef.current) {
          textSpriteRef.current = createTextSprite(hoveredObject.userData.text);
          textSpriteRef.current.material.opacity = 0;
          scene.add(textSpriteRef.current);
        }
        textSpriteRef.current.position
          .copy(hoveredObject.position)
          .add(new THREE.Vector3(0, 25, 0));
      }

      if (textSpriteRef.current) {
        const targetOpacity = isHoveringAerial ? 1 : 0;
        const spriteMaterial = textSpriteRef.current.material;
        spriteMaterial.opacity +=
          (targetOpacity - spriteMaterial.opacity) * 0.1;

        if (spriteMaterial.opacity < 0.01 && !isHoveringAerial) {
          scene.remove(textSpriteRef.current);
          textSpriteRef.current = null;
        }
      }

      // --- Update Hotspot Visuals ---
      const elapsedTime = clock.getElapsedTime();
      hotspotObjectsRef.current.forEach((h) => {
        const isHovered = h === hoveredObject;

        // 1. Update Scale
        if (isHovered) {
          h.scale.set(1.4, 1.4, 1.4);
        } else {
          if (h.userData.type === "aerial" || h.userData.type === "walk") {
            const pulse = (Math.sin(elapsedTime * 4) + 1) / 4; // 0 to 0.5
            const scale = 0.8 + pulse;
            h.scale.set(scale, scale, scale);
          } else {
            h.scale.set(1, 1, 1);
          }
        }

        // 2. Update Color
        if (isHovered) {
          h.material.color.set(0xffff00);
        } else {
          if (h.userData.type === "label") {
            h.material.color.set(0x00ffff);
          } else {
            h.material.color.set(0xffffff);
          }
        }
      });

      // --- Update Nav Button Visuals ---
      navMenuObjectsRef.current.forEach((button) => {
        const isHovered = button === hoveredObject;
        const isActive = button.userData.sceneId === currentSceneRef.current;

        const oldState = button.userData.state;
        let newState = "normal";
        if (isActive) newState = "active";
        else if (isHovered) newState = "hover";

        if (oldState !== newState) {
          button.userData.state = newState;

          let bgColor = "rgba(0, 0, 0, 0.2)"; // Normal: bg-black/20
          let textColor = "white";

          if (newState === "active") {
            bgColor = "#D0BF7A";
            textColor = "black";
          } else if (newState === "hover") {
            bgColor = "rgba(255, 255, 255, 0.1)"; // Hover: bg-white/10
          }

          const canvas = button.material.map.image;
          const ctx = canvas.getContext("2d");
          drawButton(
            ctx,
            canvas.width,
            canvas.height,
            button.userData.text,
            bgColor,
            textColor,
          );
          button.material.map.needsUpdate = true;
        }
      });

      // --- Update Controller Line and Pointer ---
      const line = controller.getObjectByName("line");
      const pointer = controller.getObjectByName("pointer");

      if (hoveredObject) {
        const hit = hits[0];
        line.scale.z = hit.distance;
        pointer.position.z = -hit.distance;
      } else {
        line.scale.z = 1000;
        pointer.position.z = -1000;
      }
    }

    renderer.setAnimationLoop(() => {
      controllers.forEach(updateRay);
      renderer.render(scene, camera);
    });

    return () => {
      if (renderer.xr.getSession()) renderer.xr.getSession().end();
      renderer.dispose();
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default VRViewer;
