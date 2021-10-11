import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from 'react'
//import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { withGoogleMap, withScriptjs } from 'react-google-maps';
import { GoogleMap, LoadScript , Marker, useJsApiLoader } from '@react-google-maps/api';
import ISite from '../../../../api/models/DTO/Site/ISite';

/*
    googleMapURL: string
    loadingElement:any
    containerElement:any
    mapElement:any
*/
interface Props {
    sites?: Array<ISite>,

}

const WorldwideMap: FunctionComponent<Props> = (props) => {
    
    const { sites } = props;

    const map = useRef<any>();

    const [markerPositions, setMarkerPositions] = useState<Array<any>>([]);
    //setMarkerPositions([...positions]);


    /*const markers = markerPositions.map((markerPosition: any, index: number) => (
        <Marker position={markerPosition} key={index} />
    ));*/

    useEffect(() => {
        //debugger;

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

        /*if(map.current) {
            const bounds = new window.google.maps.LatLngBounds();
            positions.map((mp: any) => {
              bounds.extend(mp);
            });
            map.current.fitBounds(bounds);
        }*/
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
            googleMapsApiKey="AIzaSyAfIvsuIw9Kg3z8iWuiyYk55yfjbIFYUSo"
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
//export default withScriptjs(withGoogleMap(WorldwideMap));

/*
                    sites?.map((site: ISite, index: number) => {
                        if(site.facility_location)
                        {
                            const lat = Number(site.facility_location.split(',')[0]);
                            const lng = Number(site.facility_location.split(',')[1]);

                            return (<Marker key={index} position={{lat: lat, lng: lng }} />)

                        }
                    })
*/