import { fetch } from "cross-fetch";

// jsdom doesn't support window.URL.createObjectURL, hence
// jest raises error TypeError: window.URL.createObjectURL is not a function
// vi.mock("mapbox-gl/dist/mapbox-gl", () => ({
//   GeolocateControl: vi.fn(),
//   Map: vi.fn(() => ({
//     addControl: vi.fn(),
//     on: vi.fn(),
//     remove: vi.fn(),
//   })),
//   NavigationControl: vi.fn(),
// }));

// mock window.crypto (required by auth0-spa-js)
Object.defineProperty(global, "crypto", {});

// this gets around "auth0-spa-js must run on a secure origin" error
// @ts-ignore
global.crypto.subtle = {};

// // fetch polyfill for Unleash
global.fetch = fetch;
