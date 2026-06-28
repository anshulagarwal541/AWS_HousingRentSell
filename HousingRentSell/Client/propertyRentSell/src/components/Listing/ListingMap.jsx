import ReactMapGL from "react-map-gl";
import React, { useState, useEffect } from 'react'

function ListingMap() {
    const [viewPort, setViewPort] = useState({
        latitude: 45.4211,
        longitude: -75.6903,
        width: "100%",
        height: "100%",
        zoom: 8
    })

    return (
        <div>
            <ReactMapGL
                {...viewPort}
                mapboxApiAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                onViewPortChange={viewport => {
                    setViewPort(viewport)
                }}
            >
                markerhere
            </ReactMapGL>
        </div>
    )
}

export default ListingMap;