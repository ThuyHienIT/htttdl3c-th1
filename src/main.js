import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

import { getCityGraphic, fetchCities } from "./places";
import { fetchProvinces, getProvinceGraphic } from "./provinces";
import { fetchNationRoad, getNationalRoadGraphic } from "./route";
import esriConfig from "@arcgis/core/config";
import "./style.css";
import { config } from "./config";

esriConfig.apiKey = config.key;

const map = new Map({
  basemap: "arcgis-navigation",
});

const view = new MapView({
  map: map,
  center: [108.805, 14.027],
  zoom: 5,
  container: "viewDiv",
  popup: {
    dockEnabled: false,
    dockOptions: {
      buttonEnabled: true,
      breakpoint: false,
    },
  },
});

const graphicLayer = new GraphicsLayer({});
map.add(graphicLayer);

const routeLayer = new GraphicsLayer();
map.add(routeLayer);

const placesLayer = new GraphicsLayer();
map.add(placesLayer);

view
  .when()
  .then(fetchProvinces)
  .then((provinces) => provinces.map(getProvinceGraphic))
  .then((graphics) => {
    graphics.forEach((g) => {
      graphicLayer.add(g);
    });
  })

  .then(fetchNationRoad)
  .then((routes) => {
    routes.forEach((route) => {
      getNationalRoadGraphic(route).then((result) => {
        routeLayer.add(result);
      });
    });
  })

  .then(fetchCities)
  .then((cities) => cities.map(getCityGraphic))
  .then((citiesGraphic) => {
    citiesGraphic.forEach((g) => {
      placesLayer.add(g);
    });
  })
  .catch(console.log);
