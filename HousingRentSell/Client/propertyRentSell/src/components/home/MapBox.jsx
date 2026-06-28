import React, { useState, useEffect, useContext } from 'react';
import ReactMapGL, { Marker, NavigationControl } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { AuthContext } from '../../Helpers/AuthContext';

function MapBox() {
    const { url } = useContext(AuthContext);
    const [viewPort, setViewPort] = useState({
        latitude: 36.310699,
        longitude: 59.599457,
        zoom: 3,
        bearing: 0,
        pitch: 0
    });
    const [properties, setProperties] = useState(null);

    useEffect(() => {
        axios.get(`${url}/properties`).then((response) => {
            if (!response.data.error) {
                setProperties(response.data);
            }
        });
    }, [url]);

    return (
        <div className='w-full h-[300px] sm:h-[400px] lg:h-[500px]'>  {/* Responsive heights */}
            <ReactMapGL
                {...viewPort}
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                style={{
                    width: "100%",
                    height: "100%",  // Set map height dynamically
                }}
                mapStyle='mapbox://styles/anshulagarwal541/clx0nzeqh000301qs7gl2978k'
                onMove={event => setViewPort(event.viewState)}
                scrollZoom={window.innerWidth >= 768}
                setFog={true}
            >
                {properties && properties.map((property, i) => (
                    <Marker
                        key={i}
                        latitude={property.latitude}
                        longitude={property.longitude}
                    >
                        {/* Add a marker icon or any custom marker content */}
                    </Marker>
                ))}
                <NavigationControl
                    style={{ marginRight: "10px", marginTop: "10px" }}
                    showCompass={true}
                    showZoom={true}
                />
            </ReactMapGL>
        </div>
    );
}

export default MapBox;
