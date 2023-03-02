import Graphic from "@arcgis/core/Graphic";
import { randomRgba } from "./helper";

/**
 * @typedef {{
 *    area: string,
 *    population: string,
 *    description: string
 * }} ProvinceInfo
 *
 * @typedef {{
 *    bbox: number[],
 *    coordinates: [number, number][][][],
 *    level1_id: string,
 *    level2s: {},
 *    name: string,
 *    type: string,
 *    info: ProvinceInfo
 * }} ProvinceGeoJSON
 */

export async function fetchProvinces() {
  return fetchProvincesInfo().then((data) =>
    Promise.all(Object.keys(data).map((id) => fetchProvince(id, data[id])))
  );
}

/**
 * Fetch province informations
 * @returns {Promise<{
 *  [id: number]: {
 *    area: string,
 *    population: string,
 *    description: string
 *  }
 * }>}
 */
async function fetchProvincesInfo() {
  return fetch("/data/provinces.json").then((resp) => resp.json());
}

/**
 *
 * @param {string} id
 * @param {ProvinceInfo} info
 * @returns {ProvinceGeoJSON}
 */
async function fetchProvince(id, info) {
  const url = `https://raw.githubusercontent.com/daohoangson/dvhcvn/master/data/gis/${id}.json`;

  return fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      const geo = [];
      data.coordinates.forEach((list) => {
        geo.push(...list);
      });

      return { ...data, coordinates: geo, info };
    });
}

/**
 *
 * @param {ProvinceGeoJSON} data
 * @returns {Graphic}
 */
export function getProvinceGraphic(data) {
  const color = randomRgba();

  // Create a polygon geometry
  const polygon = {
    type: "polygon",
    rings: data.coordinates,
  };

  const simpleFillSymbol = {
    type: "simple-fill",
    color: color,
    style: "solid",
    outline: {
      color: [255, 255, 255],
      width: 1,
    },
  };

  const polygonGraphic = new Graphic({
    geometry: polygon,
    symbol: simpleFillSymbol,
    popupTemplate: {
      content: data.info
        ? `<p>Diện tích: ${data.info?.area}</p>
           <p>Dân số: ${data.info?.population}</p>
           <p>Thông tin thêm: ${data.info?.description}</p>`
        : "",
      title: data.name,
    },
  });
  return polygonGraphic;
}
