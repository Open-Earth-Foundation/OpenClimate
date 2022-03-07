import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { GoogleMap, LoadScript , Marker } from '@react-google-maps/api';
import ISite from '../../../../api/models/DTO/Site/ISite';
import { Map } from '../../../environments/map.environments';

interface Props {
    sites?: Array<ISite>,

}

const WorldwideMap: FunctionComponent<Props> = (props) => {
    
    const { sites } = props;

    const map = useRef<any>();

    const [markerPositions, setMarkerPositions] = useState<Array<any>>([]);

    useEffect(() => {

        const positions:Array<any> = [];
        sites?.map((site: ISite) => {
    
            if(site.facility_location && site.facility_location.includes(','))
            {
                const splittedLocation = site.facility_location.split(',');
                const markerPosition = {
                    lat: Number(splittedLocation[0]),
                    lng: Number(splittedLocation[1])
                }
    
                positions.push(markerPosition);
            }
        });

        setMarkerPositions(positions);

      }, [sites]);

      const mapOnLoad = (map: any) => {
        const bounds = new window.google.maps.LatLngBounds();
        markerPositions.map((mp: any) => {
            bounds.extend({
                lat: mp.lat,
                lng: mp.lng
            });
        });
        map.fitBounds(bounds);
      }

    return (
        <LoadScript
            googleMapsApiKey={Map.googleMapApiKey}
        >
            <GoogleMap
                key={new Date().getTime()}
                options={{
                    maxZoom: 5,
                    fullscreenControl: false,
                    mapTypeControl: false
                }}
                ref={map}
                zoom={2}
                center={{ lat: -15, lng: 20.05689357908851 }}
                mapContainerStyle={{
                    height: "100%"
                  }}
                onLoad={mapOnLoad}
            >
                {
                    markerPositions.map((position: any, index: number) => (
                        <Marker key={index} position={position} />
                    ))


                }
            </GoogleMap>
        </LoadScript>
    );
}

export default React.memo(WorldwideMap)
