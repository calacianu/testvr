import React, { useState } from 'react';
import Marzipano from 'marzipano'

const defaultCoords = { yaw: 0, pitch: 0, radius: 1000 }
const defaultRotation = { x: 0, y: 0, z: 0 }
const defaultTransform = { coords: defaultCoords, rotation: defaultRotation }

const defaultStyle = { background: 'red', width: 40, height: 40 }

const clickable = (onClick, text, style, transform) => <div onClick={onClick} style={style} transform={transform}>{text}</div>

const defaultScene = { current: true, imageUrl: 'https://www.marzipano.net/media/equirect/angra.jpg', type: 'equirect' }

export const MultipleHotspots = () => {
  const [active, setActive] = useState(0)
  const activeStyle = { background: 'blue' }
  const getStyle = index => index === active ? { ...defaultStyle, ...activeStyle } : defaultStyle

  return (
    <Marzipano scenes={[defaultScene]} hotspots={[
      clickable(() => setActive(0), 'Nothing', getStyle(0), defaultTransform),
      clickable(() => setActive(1), 'Two', getStyle(1), { rotation: defaultRotation, coords: { yaw: -0.1, pitch: 0, radius: 1000 } }),
      clickable(() => setActive(2), 'Three', getStyle(2), { rotation: defaultRotation, coords: { yaw: 0, pitch: 0.1, radius: 1000 } })
    ]} />
  )
}