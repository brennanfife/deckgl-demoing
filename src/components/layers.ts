export const defaultScatterObject = {
  id: 'scatter',
  // data: gundata,
  visible: true,
  opacity: 0.8,
  filled: true,
  radiusMinPixels: 2,
  radiusMaxPixels: 5,
  getPosition: (d: any) => [d.longitude, d.latitude],
  getFillColor: (d: any) =>
    d.n_killed > 0 ? [200, 0, 40, 150] : [255, 140, 0, 100],
  pickable: true,
  // onHover: ({ object, x, y }: any) => {
  //   const el = document.getElementById('tooltip');
  //   if (object) {
  //     const {
  //       n_killed,
  //       incident_id,
  //       n_injured,
  //       date,
  //       notes,
  //       latitude,
  //       longitude,
  //     } = object;
  //     //@ts-ignore
  //     el.innerHTML = `<h1>ID ${incident_id}</h1>`;

  //     el.innerHTML = `<div style="font-size: 1.0em">
  //                   <strong>ID:${incident_id}</strong><br>
  //                   <span style="color: rgb(200, 0, 40)">${n_killed}</span> Dead ${
  //       n_killed ? strCount(n_killed, 'killed') : ''
  //     }<br>
  //                   <span style="color: rgb(255, 140, 0)">${n_injured}</span> Injured ${
  //       n_injured ? strCount(n_injured, 'injured') : ''
  //     }<br>
  //                   Went down on ${date}. ${notes}
  //                   <hr>
  //                   <br><span style="font-size: 0.8em">Lat: ${latitude} , Lng: ${longitude}</span></div>
  //                   `;
  //     //@ts-ignore
  //     el.style.display = 'block';
  //     //@ts-ignore
  //     el.style.opacity = 0.9;
  //     //@ts-ignore
  //     el.style.left = x + 'px';
  //     //@ts-ignore
  //     el.style.top = y + 'px';
  //     //@ts-ignore
  //   } else el.style.opacity = 0.0;
  // },

  // onClick: ({ object, x, y }: any) => {
  //   window.open(
  //     `https://www.gunviolencearchive.org/incident/${object.incident_id}`
  //   );
  // },
};

export const defaultHeatObject = {
  id: 'heat',
  getPosition: (d: any) => [d.longitude, d.latitude],
  getWeight: (d: any) => d.n_killed + d.n_injured * 0.5,
  radiusPixels: 80,
};

export const defaultHexObject = {
  id: 'hex',
  getPosition: (d: any) => [d.longitude, d.latitude],
  getElevationWeight: (d: any) => d.n_killed * 2 + d.n_injured,
  elevationScale: 100,
  extruded: true,
  radius: 1609,
  opacity: 0.6,
  coverage: 0.88,
  lowerPercentile: 50,
};
