/** Generic browser/device family module. No business dependencies. */
import {layout as portrait} from "./mobile-portrait.js";
import {layout as landscape} from "./mobile-landscape.js";
export function pageLayout(orientation){return orientation==="landscape"?landscape:portrait;}
