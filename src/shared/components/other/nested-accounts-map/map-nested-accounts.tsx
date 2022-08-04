import { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer, Popup, TileLayer,Marker,GeoJSON, Polygon, Tooltip, GeoJSONProps } from 'react-leaflet';
import countryPolygons from '../../../../api/data/map/countries.geojson';
import ISite from '../../../../api/models/DTO/Site/ISite';
import MapButton from './map-button/map-button';
import IGeoSubnational from '../../../../api/models/DTO/NestedAccounts/IGeoSubnational';
import { useHistory, useLocation } from 'react-router-dom'
import './map-nested-accounts.scss';
import Switcher from '../../form-elements/switcher/switcher';

interface Props {
  sites?: Array<ISite>,
  geoSubnationals: Array<IGeoSubnational>,
  panelShown: boolean,
  countrySelectHandler: (countryName: string) => void,
  subnationalSelectedHandler: (subnationalName: string) => void,
  siteSelectedHandler: (siteId: string) => void,
  loadGeoSubnational: (countryCode: string) => any
}

let mounted = false;

const MapNestedAccounts: FunctionComponent<Props> = (props) => {
  
  const { sites, geoSubnationals, panelShown,
    siteSelectedHandler, countrySelectHandler, 
    subnationalSelectedHandler, loadGeoSubnational } = props;

  const zoomDefault = 3;
  const defaultCountryStyle = {
    fillColor: 'white',
    color: 'black',
    weight: 1
  }

  const selectedCountryStyle = {
    fillColor: '#ceddf1',
    color: '#398afe',
    weight: 1
  }
  const selectedSubnationalStyle = {
    fillColor: 'red',
    color: 'black',
    weight: 1
  }

  const countryGeoJsonRef = useRef<any>();
  const subnationalsGeoJsonRef = useRef<any>();
  const mapRef = useRef<any>();

  const [countryGeoJson, setCountryGeoJson] = useState<any>();
  const [subnationalsGeoJson, setSubnationalsGeoJson] = useState<any>();

  const [markers, setMarkers] = useState<Array<any>>([]);
  const [polygonCoordinates, setPolygonCoordinates] = useState<Array<any>>([]);
  const [siteSelectedId, setSiteSelectedId] = useState<string>('');

  const [countrySelectedCode, setCountrySelectedCode] = useState<string>('');

  const [showClearZoom, setShowClearZoom] = useState<boolean>(false);
  const [showLoadSubnationals, setShowLoadSubnationals] = useState<boolean>(false);

  const [defaultCountry, setDefaultCountry] = useState<any>();
  
  const [defaultJurisdictionName, setDefaultJurisdictionName] = useState<any>();
  const [defaultJurisdictionCode, setDefaultJurisdictionCode] = useState<any>();

  const [defaultSiteName, setDefaultName] = useState<any>();

  const [loadDefaultJurisdiction, setLoadDefaultjurisdiction] = useState<boolean>(false);

  useEffect(() => {
    if(loadDefaultJurisdiction && subnationalsGeoJsonRef.current)
    {
      selectDefaultSubnational();
      setShowLoadSubnationals(false);
    }
  }, [loadDefaultJurisdiction, subnationalsGeoJson, subnationalsGeoJsonRef.current]);

   const location = useLocation();
   const history = useHistory()

  useEffect(() => {
     if(countrySelectedCode){
        const found: any = geoSubnationals.find(gs => gs.name === countrySelectedCode);
        setSubnationalsGeoJson(found.geoData);
        
     }
  }, [geoSubnationals])


  useEffect(() => {
    const parsedCountries = JSON.parse(countryPolygons);
    setCountryGeoJson(parsedCountries.features);

    const query = new URLSearchParams(location.search);
    const countryCode = query.get(`country`);
    const jurisdictionName = query.get(`jurisdictionName`);
    const jurisdictionCode = query.get(`jurisdictionCode`);
    const siteName = query.get(`siteName`);
    if(countryCode)
    {
      setDefaultCountry(countryCode);
      setCountrySelectedCode(countryCode);
      query.delete('country');
    }
    else
      setDefaultCountry('');

    if(jurisdictionName)
    {
      setDefaultJurisdictionName(jurisdictionName);
      setDefaultJurisdictionCode(jurisdictionCode);

      if(countryCode)
        loadSubnationalsClickHandler(countryCode);

      query.delete('jurisdiction');
    }
    else{
      setDefaultJurisdictionName('');
      setDefaultJurisdictionCode('');
    }

    if(siteName)
    {
      setDefaultName(siteName);
      query.delete('siteName');
    }

    history.replace({
      search: query.toString()
    });

    mounted = true;

    return () => {
      mounted = false;
    }

  }, [])

  useEffect(() => {
    setTimeout(function(){ mapRef.current?.invalidateSize()}, 400);
  }, [panelShown]);

   useEffect(() => {

    const parsedMarkers:Array<any> = [];

    sites?.forEach((site: ISite) => {

        if(site.facility_location && site.facility_location.includes(','))
        {
            const location = site.facility_location.replace(';', '');

            const splittedLocation = location.split(',');
            const markerPosition = {
                lat: Number(splittedLocation[0]),
                lng: Number(splittedLocation[1])
            }
            
            parsedMarkers.push({
              siteId: site.id,
              siteName: site.facility_name,
              siteType: site.facility_type,
              position: markerPosition
            });
        }
    });

    setMarkers(parsedMarkers);

  }, [sites]);

  const loadSubnationalsClickHandler = (countryCode: string) => {
      
    if(!countryCode)
        return;
    
      setPolygonCoordinates([]);
      setShowLoadSubnationals(false);

      let foundGeoData = geoSubnationals.find(gs => gs.name === countryCode);
      if(!foundGeoData)
        loadGeoSubnational(countryCode)
      else
        setSubnationalsGeoJson(foundGeoData.geoData);
  }

  const onEachFeatureSub = (feature: any, layer: any) => {

    layer.on({
      click: (e: any) => subnationalClickHandler(layer)
    });

    if((layer.feature.properties.shapeISO === defaultJurisdictionCode || 
      layer.feature.properties.shapeName === defaultJurisdictionName) 
      && !loadDefaultJurisdiction)
    {
      setLoadDefaultjurisdiction(true);
    }
  }

  const onEachFeature = (feature: any, layer: any) => {
    layer.setStyle(defaultCountryStyle);
    
    layer.on({
      click: (e: any) => countryClickHandler(layer, false)
    });
  }

  const subnationalClickHandler = (layer: any) => {
    subnationalsGeoJsonRef.current?.resetStyle();
    layer._map.fitBounds(layer._bounds);
    layer.setStyle(selectedSubnationalStyle);
    setSiteSelectedId('');

    let subnationalName = layer.feature.properties.shapeName;
    if( layer.feature.properties?.shapeISO === "AFG")
      subnationalName = layer.feature.properties.PROV_34_NA;

    subnationalSelectedHandler(subnationalName);
  }

  const countryClickHandler = (layer: any, fromDefault: boolean) => {
    clearCountriesStyles();
    setSubnationalsGeoJson('');

    layer._map.fitBounds(layer._bounds);
    layer.setStyle(selectedCountryStyle);

    countrySelectHandler(layer.feature.properties.ADMIN);
    setCountrySelectedCode(layer.feature.properties.ISO_A3);
    setShowLoadSubnationals(true);
    setSiteSelectedId('');
  }

  const siteClickHandler = (siteId: string) => {
    const foundSite = sites?.find(s => s.id === siteId);

    const splitedCoordinates = foundSite?.facility_bounds?.split(';').filter(c => c);
    
    const coordinatesArr: Array<any> = [];
    if(splitedCoordinates && splitedCoordinates.length > 1)
    {
      splitedCoordinates?.map(coordinates => {
        const pointStr = coordinates.split(',')
        coordinatesArr.push([+pointStr[0], +pointStr[1]]);

        return coordinatesArr;
      });
    }
    const marker = markers.find(m => m.siteId === siteId);
    mapRef.current?.flyTo(marker?.position, 14, {
      animate: true,
      duration: 0.25,
    });

    if(coordinatesArr && coordinatesArr.length)
      setPolygonCoordinates(coordinatesArr);

    clearCountriesStyles();
    setSubnationalsGeoJson('');
    setSiteSelectedId(siteId);
    setShowLoadSubnationals(false);
    siteSelectedHandler(siteId);
  }

  const clearCountriesStyles = () => {
    countryGeoJsonRef.current.resetStyle();
    countryGeoJsonRef.current.setStyle(defaultCountryStyle);
  }

  const onClearZoom = () => {
      setSiteSelectedId('');
      mapRef.current?.setZoom(3);
  }
  const onZoomChanged = (e: any) => {
    if(e.target._zoom > zoomDefault)
      setShowClearZoom(true);
    else
      setShowClearZoom(false);
  }

  const selectDefaultSite = () => {
    const siteDefaultId = sites?.find(s => s.facility_name === defaultSiteName)?.id;
    if(siteDefaultId)
      siteClickHandler(siteDefaultId);
  }

  const selectDefaultCountry = () => {
    const layerKey = Object.keys(countryGeoJsonRef.current._layers)
        .find((k:any) => countryGeoJsonRef.current._layers[k].feature.properties.ISO_A3 === defaultCountry);
            
    if(layerKey)
      countryClickHandler(countryGeoJsonRef.current._layers[layerKey], true);
  }
  
  const selectDefaultSubnational = () => {
    Object.keys(subnationalsGeoJsonRef.current?._layers).forEach((k: any) => {
      if(subnationalsGeoJsonRef.current?._layers[k].feature.properties.shapeISO === defaultJurisdictionCode ||
        subnationalsGeoJsonRef.current?._layers[k].feature.properties.shapeName === defaultJurisdictionName)
        subnationalsGeoJsonRef.current?._layers[k].fire('click');
    });
  }

  const redirectToWidgetView = () => {
    history.push('/');
  }

  return (
    <>
      <div className="nested-switcher-container">
          <Switcher
              className='nested-switcher'
              leftOption='Widget View'
              rightOption='Nested Map View'
              leftOptionChosen={false}
              onChange={redirectToWidgetView}
          />
      </div>
      <MapContainer 
        style={{width: `${panelShown ? '50%' : ''}`}}
        whenCreated={ (mapInstance: any) => { 
          mapRef.current = mapInstance 
          mapInstance.on('zoomend', onZoomChanged);

          if(defaultCountry)
            selectDefaultCountry();
          if(defaultSiteName)
            selectDefaultSite();

        } }
        
        center={[20,30]} 
        zoom={3} 
        scrollWheelZoom={true}
        minZoom={3}
      >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

      />
      
      {
          markers.map((marker: any, index: number) => (
              <Marker 
                key={index} 
                position={marker.position} 
                eventHandlers={{
                  click: e => siteClickHandler(marker.siteId)
                }}
                
                
              >
                {
                  siteSelectedId === marker.siteId ?

                  <Tooltip 
                    key={`${marker.siteName}_${siteSelectedId}`}
                    permanent={true}
                  >
                      {marker.siteName} ({marker.siteType})
                    </Tooltip>
                  
                  :
                  <Tooltip>{marker.siteName} ({marker.siteType})</Tooltip>
                }
                
              </Marker>
          ))
      }

      {
        countryGeoJson ?
        <GeoJSON 
          ref={countryGeoJsonRef}
          onEachFeature={(x, y) => {
            onEachFeature(x, y)
          }}
          data={countryGeoJson} 
        />
        : ''
      }

      {
        subnationalsGeoJson ? 
          <GeoJSON 
            ref={subnationalsGeoJsonRef}
            onEachFeature={onEachFeatureSub}
            data={subnationalsGeoJson} 

          />
        : ''
      }


      {
          polygonCoordinates ?
          <Polygon pathOptions={{ fillColor: 'red' }} positions={polygonCoordinates} />
          : ""
      }

    </MapContainer>

    <div className="nested-accounts__buttons">
    {
      (showLoadSubnationals) ?
      <MapButton 
      iconType='dashboard'
      text='See subnational level'
      onClick={() => loadSubnationalsClickHandler(countrySelectedCode)}
      /> : ''
    }
    {
      showClearZoom ? 
      <MapButton 
      iconType='zoomout'
      text='Clear zoom'
      onClick={onClearZoom}
      /> 
      : ''
    }
    </div>


  </>
  );
}
    
export default MapNestedAccounts  