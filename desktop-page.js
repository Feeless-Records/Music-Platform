/** Generic browser/device family module. No business dependencies. */
import {layout as portrait} from "./desktop-portrait.js";
import {layout as landscape} from "./desktop-landscape.js";
export function pageLayout(orientation){return orientation==="landscape"?landscape:portrait;}
