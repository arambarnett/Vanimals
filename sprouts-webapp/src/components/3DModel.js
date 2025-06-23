import "@google/model-viewer";
import { useEffect } from "react";

const Model = ({ glbFile, poster, vanimal, zoom, onLoad }) => {
  useEffect(() => {
    if (vanimal && onLoad) {
      const modelViewer = document.querySelector(`model-viewer[name='${vanimal}']`);
      modelViewer.addEventListener("load", () => {
        onLoad(modelViewer);
      });
    }
  }, [vanimal, onLoad]);

  return (
    <model-viewer
      name={vanimal}
      src={glbFile}
      poster={poster}
      ios-src=""
      alt="3D model of a vanimal"
      shadow-intensity="1"
      disable-zoom
      camera-controls
      min-field-of-view={zoom || "auto"}
      ar
    >
      <div id="model-viewer-poster" slot="poster" />
    </model-viewer>
  );
};

export default Model;
