import React, { useState, useEffect } from 'react'
import ReactMapGL, { Marker, Popup, NavigationControl } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

function ClusterMap({ property }) {
    const [viewPort, setViewPort] = useState({
        latitude: property.latitude,
        longitude: property.longitude,
        zoom: 12,
        center: [property.latitude, property.longitude]
    })
    return (
        <div>
            <ReactMapGL
                {...viewPort}
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                style={{
                    width: "100%",
                    height: '500px'
                }}
                mapStyle='mapbox://styles/anshulagarwal541/clx0nzeqh000301qs7gl2978k'
                onMove={event => setViewPort(event.viewState)}
                scrollZoom={false}
            >
                <Marker
                    latitude={property.latitude}
                    longitude={property.longitude}
                ></Marker>
                <NavigationControl style={{ marginRight: "50px" }} />
            </ReactMapGL>
        </div>
    )
}

export default ClusterMap