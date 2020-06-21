import React, { useState } from 'react';
import Marzipano from 'marzipano'
import SceneSwitcher from 'marzipano'

const MultipleSceneProps = () => {
  const [currentId, setId] = useState(0)

  const scenes = [
    {
      current: currentId === 0,
      imageUrl: 'https://www.marzipano.net/media/equirect/angra.jpg',
      type: 'equirect'
    },
    {
      current: currentId === 1,
      imageUrl: 'https://www.marzipano.net/media/cubemap/{f}.jpg',
      type: 'cubemap',
      levels: [{ tileSize: 1024, size: 1024 }]
    }
  ]
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <SceneSwitcher sceneIds={[0, 1, 2]} onSwitchId={id => setId(id)} />
      <Marzipano scenes={scenes} />
    </div>
  )
}

export default MultipleSceneProps;