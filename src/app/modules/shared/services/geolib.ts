import * as x from 'geolib';
// import * as y from 'geolib/'
// @types/geolib is written in a way that `import * as geolib from 'geolib';` does not wo
// type geolibType = typeof geolib;
const theGeolib = (x as any).default;

export { theGeolib as geolib };
