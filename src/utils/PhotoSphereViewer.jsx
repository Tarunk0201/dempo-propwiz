import { useState } from "react";
import {
  PhotoSphereViewer,
  Marker,
  SceneMarker,
} from "react-photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";

const PhotoSphereViewerComponent = ({ scenesConfig, currentSceneId }) => {
  const currentScene = scenesConfig.find((s) => s.id === currentSceneId);
  if (!currentScene) return null;

  const markers = Object.entries(currentScene.hotspots || {}).map(
    ([label, link]) => (
      <SceneMarker
        key={`${currentScene.id}-${label}`}
        position={{
          yaw: (link.yaw * Math.PI) / 180,
          pitch: (link.pitch * Math.PI) / 180,
        }}
        targetScene={link.sceneId}
        tooltip={label.toUpperCase()}
        type="scene"
        color="#ff0000"
        width={4}
        height={60}
      />
    ),
  );

  return (
    <PhotoSphereViewer
      src={currentScene.image}
      position={{ yaw: "0deg", pitch: "0deg" }}
      container={document.querySelector("#viewer")}
      markers={markers}
      defaultZoomLvl={0}
      mousewheel={true}
      navbar={true}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};

export default PhotoSphereViewerComponent;
