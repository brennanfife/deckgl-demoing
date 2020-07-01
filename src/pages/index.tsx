import React, { useState, useEffect } from 'react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';
import { StaticMap } from 'react-map-gl';
import { MapView } from '@deck.gl/core';
import styled from '@emotion/styled';
import { Button, ButtonGroup, Checkbox, CheckboxGroup } from '@chakra-ui/core';

import {
  defaultScatterObject,
  defaultHeatObject,
  defaultHexObject,
} from '../components/layers';
import getFilteredData from '../components/getFiltered';

const MAPBOX_API_KEY =
  'pk.eyJ1IjoiYnJlbmZpZmUiLCJhIjoiY2tieHkxMzViMG1oMTJ6cDdpdTF6cDB2ZiJ9.cEluY5CXGPMreXcH4mSBJg';

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -90,
  latitude: 40,
  zoom: 3.0,
  maxZoom: 20,
  pitch: 30,
  bearing: 0,
};

const Info = styled.div`
  left: x;
  top: y;
  pointer-events: none;
  position: absolute;
  z-index: 9;
  font-size: 12px;
  padding: 8px;
  background: #000;
  color: #fff;
  min-width: 160px;
  max-height: 240px;
  overflow-y: hidden;
`;

export default function App() {
  enum MapStyle {
    'mapbox://styles/mapbox/satellite-v9',
    'mapbox://styles/mapbox/streets-v11',
    'mapbox://styles/mapbox/dark-v9',
  }

  enum MapType {
    Scatter,
    Heat,
    Hex,
  }

  const conditionVals = [
    'armed robbery',
    'home invasion',
    'drive-by',
    'suicide',
    'defensive use',
    'drug involvement',
    'gang involvement',
    'officer involved',
    'mass shooting',
  ];
  const filteredish = getFilteredData(conditionVals).then((val: any) =>
    console.log(val)
  );
  console.log('filteredish:', filteredish);

  const [currentMapStyle, setCurrentMapStyle] = useState(MapStyle[2]);
  const [currentMapType, setCurrentMapType] = useState(MapType[1]);
  const [filters, setFilters] = useState([]);
  const [gunData, setGunData] = useState();
  const [x, setX] = useState();
  const [y, setY] = useState();
  const [hoveredObject, setHoveredObject] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        'https://firebasestorage.googleapis.com/v0/b/deckgldatamap.appspot.com/o/gundata.json?alt=media&token=113ee5d6-c816-47d5-8000-fcbf00997f13'
      );
      const gunData = await response.json();
      setGunData(gunData);
    })();

    return () => {};
  }, [gunData]);

  function toggleMapStyle() {
    if (currentMapStyle === MapStyle[0]) setCurrentMapStyle(MapStyle[1]);
    else if (currentMapStyle === MapStyle[1]) setCurrentMapStyle(MapStyle[2]);
    else if (currentMapStyle === MapStyle[2]) setCurrentMapStyle(MapStyle[0]);
  }

  function toggleMapType() {
    if (currentMapType === MapType[0]) setCurrentMapType(MapType[1]);
    else if (currentMapType === MapType[1]) setCurrentMapType(MapType[2]);
    else if (currentMapType === MapType[2]) setCurrentMapType(MapType[0]);
  }

  function _onHover({ object, x, y }: any) {
    if (object) {
      setHoveredObject(object);
      setX(x);
      setY(y);
    } else {
      setHoveredObject(undefined);
      setX(undefined);
      setY(undefined);
    }
  }

  function _onClick({ object }: any) {
    window.open(
      `https://www.gunviolencearchive.org/incident/${object.incident_id}`
    );
  }

  function renderLayers() {
    let conditions = [];
    conditions = filters.filter((filter: any) => {
      return filter.checked === true;
    });

    let conditionVals: any[] = [];
    conditions.forEach((condition: any) => {
      conditionVals.push(condition.value.toLowerCase());
    });

    const renderData = getFilteredData(conditionVals);

    const data = gunData;

    let layer = new ScatterplotLayer({
      ...defaultScatterObject,
      data,
      onHover: _onHover,
      onClick: _onClick,
    });

    // if (currentMapType === MapType.Scatter + '')
    //   layer = new ScatterplotLayer({
    //     ...defaultScatterObject,
    //     onHover: _onHover,
    //     onClick: _onClick,
    //   });
    // else if (currentMapType === MapType.Heat + '')
    //   layer = new HeatmapLayer({
    //     ...defaultHeatObject,
    //   });
    // else
    //   layer = new HexagonLayer({
    //     ...defaultHexObject,
    //   });

    return [layer];
  }

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={renderLayers()}
    >
      <StaticMap
        width="100vw"
        height="100vh"
        mapboxApiAccessToken={MAPBOX_API_KEY}
        mapStyle={currentMapStyle}
      />
      <ButtonGroup m="1rem">
        <Button onClick={() => toggleMapStyle()}>Toggle Map Style</Button>
        <Button onClick={() => toggleMapType()}>Toggle Map Type</Button>
      </ButtonGroup>
      <Info>
        {hoveredObject &&
          `${hoveredObject.n_killed},  ${hoveredObject.n_injured}, ${hoveredObject.date}, ${hoveredObject.notes}, ${hoveredObject.latitude}, ${hoveredObject.longitude}`}
      </Info>

      <CheckboxGroup
        isInline
        bg="#ffffff"
        mt="1rem"
        spacing={8}
        variantColor="teal"
        defaultValue={['itachi', 'kisame']}
      >
        <Checkbox value="itachi">Drive-by</Checkbox>
        <Checkbox value="itachi">Home Invasion</Checkbox>
        <Checkbox defaultIsChecked>Suicide</Checkbox>
        <Checkbox defaultIsChecked>Defensive Use</Checkbox>
        <Checkbox defaultIsChecked>Armed Robbery</Checkbox>
        <Checkbox defaultIsChecked>Drug Involvement</Checkbox>
        <Checkbox defaultIsChecked>Gang Involvement</Checkbox>
        <Checkbox defaultIsChecked>Officer Involved</Checkbox>
        <Checkbox defaultIsChecked>Mass Shooting</Checkbox>
      </CheckboxGroup>
    </DeckGL>
  );
}
