/** Generic browser/device family module. No business dependencies. */
import {pageLayout} from "./desktop-page.js";
import {createStorage} from "./desktop-storage.js";
export function createAppProfile(){return Object.freeze({family:"desktop",pageLayout,createStorage});}
