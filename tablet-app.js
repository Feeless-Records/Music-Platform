/** Generic browser/device family module. No business dependencies. */
import {pageLayout} from "./tablet-page.js";
import {createStorage} from "./tablet-storage.js";
export function createAppProfile(){return Object.freeze({family:"tablet",pageLayout,createStorage});}
