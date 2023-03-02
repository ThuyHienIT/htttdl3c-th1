import Stop from "@arcgis/core/rest/support/Stop";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters";
import Collection from "@arcgis/core/core/Collection";
import * as route from "@arcgis/core/rest/route";
import { config } from "./config";
import Graphic from "@arcgis/core/Graphic";

/**
 * @typedef {{
 *  name: string,
 *   from: { lat: number, long: number },
 *   to: { lat: number, long: number }
 * }} RouteInfo
 */

/**
 * @returns {RouteInfo[]}
 */
export async function fetchNationRoad() {
  return fetch("/data/route.json").then((resp) => resp.json());
}

/**
 * Get Route Graphic
 * @param {RouteInfo} data
 * @returns {Promise<Graphic>}
 */
export async function getNationalRoadGraphic(data) {
  const { from, to } = data;

  const routeUrl =
    "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

  // create a Collection of new Stops
  const stops = new Collection([
    new Stop({
      geometry: { x: from.long, y: from.lat },
    }),
    new Stop({
      geometry: { x: to.long, y: to.lat },
    }),
  ]);

  const routeParams = new RouteParameters({
    apiKey: config.key,
    stops: stops,
  });

  return route.solve(routeUrl, routeParams).then((data) => showRoute(data));
}

/**
 * Get Route result
 * @param {RouteSolveResult} data
 * @returns
 */
function showRoute(data) {
  const routeSymbol = {
    type: "simple-line",
    color: [0, 0, 255, 0.9],
    width: 4,
  };

  const routeResult = data.routeResults[0].route;
  routeResult.symbol = routeSymbol;

  return routeResult;
}
