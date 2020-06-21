import React, { Component } from 'react';
import './App.css';

import Marzipano from 'marzipano';

class App extends Component {

  constructor(props) {
    super(props);
    this.scene = null;
    this.view = null;
    this.destinationScene = null;

    this.state = {
      isHotSpotActive: false
    };

    this.lastX = 0;
    this.lastY = 0;
  }

  componentDidMount() {
    this.panoViewer = new Marzipano.Viewer(this.pano);

    // stop move
    // this.panoViewer.stopMovement();
    // this.panoViewer.setIdleMovement(Infinity);
    // this.panoViewer.controls().disable();

    // Create geometry.
    const geometry = new Marzipano.EquirectGeometry([{ width: 2048 }]);

    // Create view.
    const limiter = Marzipano.RectilinearView.limit.traditional(1024, 100 * Math.PI / 180);
    const view = new Marzipano.RectilinearView({ yaw: Math.PI }, limiter);
    this.view = view;

    const scene = this.createScene("https://www.marzipano.net/media/equirect/angra.jpg", geometry, view);
    this.scene = scene;
    const destinationScene = this.createScene("http://localhost:3000/SAM_101_0472.jpg", geometry, view);
    this.destinationScene = destinationScene;
    this.createHotSpot(scene, destinationScene);

    this.imgHotspot = null;

    // Display scene.
    scene.switchTo();
  }

  createScene = (image, geometry, view) => {
    // Create source.
    const source = Marzipano.ImageUrlSource.fromString(image);

    // Create scene.
    return this.panoViewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });
  }

  createHotSpot = (scene, destinationScene, yaw = 20 * Math.PI / 180, pitch = 35 * Math.PI / 180) => {
    if (!this.state.isHotSpotActive) {
      this.panoViewer.controls().disable();

      const destinationViewParameters = {
        yaw,
        pitch,
        fov: 80 * Math.PI / 180
      };

      const options = {
        transitionDuration: 2000
      }

      this.imgHotspot = document.createElement('img');
      this.imgHotspot.setAttribute('draggable', true);
      this.imgHotspot.src = 'http://web-apps.ro/projects/marzipano/spot.jpeg';
      this.imgHotspot.classList.add('hotspot');
      this.imgHotspot.addEventListener('click', () => {
        // this.switchScene(destinationScene, destinationViewParameters);

        // Marzipano.Scene.switchScene(destinationScene, { transitionDuration: 400 });
        // scene.lookTo(destinationViewParameters, options);
      });

      this.imgHotspot.addEventListener("mousedown", this.eleMouseDown, false);

      const position = { yaw: yaw, pitch: pitch };

      scene.hotspotContainer().createHotspot(this.imgHotspot, position);
    }
  }

  switchScene = (scene, destinationViewParameters) => {
    // scene.view.setParameters(scene.data.initialViewParameters);
    scene.switchTo(destinationViewParameters);
  }

  eleMouseDown = () => {
    // stateMouseDown = true;
    document.addEventListener("mousemove", this.eleMouseMove, false);
    console.log('mouse down');
  }

  eleMouseMove = e => {
    var pX = e.clientX;
    var pY = e.clientY;
    // this.imgHotspot.style.left = pX + "px";
    // this.imgHotspot.style.top = pY + "px";

    this.imgHotspot.style.transform = `translateX(${pX}px) translateY(${pY}px) translateZ(0px)`;
    document.addEventListener("mouseup", this.eleMouseUp, false);
  }

  eleMouseUp = e => {
    document.removeEventListener("mousemove", this.eleMouseMove, false);
    document.removeEventListener("mouseup", this.eleMouseUp, false);
  }

  render() {
    return (
      <div ref={pano => this.pano = pano} id="pano" onClick={e => {
        this.setState({
          isHotSpotActive: true
        });
        const { yaw, pitch } = this.view.screenToCoordinates({ x: e.clientX, y: e.clientY });
        this.createHotSpot(this.scene, this.destinationScene, yaw, pitch);
      }} />
    );
  }
}


export default App;
