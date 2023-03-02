import Graphic from "@arcgis/core/Graphic";

// Cities, School,...
export async function fetchCities() {
  return fetch("/data/cities.json").then((resp) => resp.json());
}

export function getCityGraphic(data) {
  const { long, lat, name, content = "" } = data;
  const point = {
    type: "point",
    longitude: long,
    latitude: lat,
  };

  const markerSymbol = {
    type: "picture-marker",
    url: "/pin.svg",
    width: "16px",
    height: "22px",
  };

  return new Graphic({
    geometry: point,
    symbol: markerSymbol,
    popupTemplate: {
      content: content,
      title: name,
    },
  });
}
