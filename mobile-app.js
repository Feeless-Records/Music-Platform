/** Generic browser/device family module. No business dependencies. */
import {pageLayout} from "./mobile-page.js";
import {createStorage} from "./mobile-storage.js";
export function createAppProfile(){return Object.freeze({family:"mobile",pageLayout,createStorage});}
