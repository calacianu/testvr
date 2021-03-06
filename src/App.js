import React, { Component } from 'react';
import './App.css';

import Marzipano from 'marzipano';

import Menu from './components/Menu/Menu';
import HotspotMenu from './components/Menu/HotspotMenu';

class App extends Component {

  constructor(props) {
    super(props);
    this.scene = null;
    this.view = null;
    this.destinationScene = null;

    this.state = {
      isHotSpotActive: false,
      showHotspotMenu: false,
      hotSpotMenuPositon: {
        x: 0,
        y: 0
      }
    };
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
    // this.createHotSpot(scene, destinationScene);

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
      this.imgHotspot.addEventListener('click', e => {
        this.setState({
          showHotspotMenu: true,
          hotSpotMenuPositon: {
            x: e.clientX,
            y: e.clientY
          }
        }, () => {
          console.log(this.state);
        });
        // asta-i bun
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
    this.imgHotspot.style.transform = `translateX(${pX}px) translateY(${pY - 50}px) translateZ(0px)`;
    document.addEventListener("mouseup", this.eleMouseUp, false);
  }

  eleMouseUp = e => {
    document.removeEventListener("mousemove", this.eleMouseMove, false);
    document.removeEventListener("mouseup", this.eleMouseUp, false);
  }

  addHotspotOnClick = e => {
    this.setState({
      isHotSpotActive: true
    });
    // const { yaw, pitch } = this.view.screenToCoordinates({ x: e.clientX, y: e.clientY });
    const { yaw, pitch } = this.view.screenToCoordinates({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    this.createHotSpot(this.scene, this.destinationScene, yaw, pitch);
  };

  render() {
    return (
      <>
        <Menu onClickFunction={this.addHotspotOnClick} />
        {this.state.showHotspotMenu && 
          <HotspotMenu 
            styleMenu={`translateX(${this.state.hotSpotMenuPositon.x}px) translateY(${this.state.hotSpotMenuPositon.y - 100}px) translateZ(0px)`}
          />}
        <div ref={pano => this.pano = pano} id="pano" onClick={e => this.addHotspotOnClick(e)} />
      </>
    );
  }
}


export default App;
