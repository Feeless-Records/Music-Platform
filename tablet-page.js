/** Generic browser/device family module. No business dependencies. */
import {layout as portrait} from "./tablet-portrait.js";
import {layout as landscape} from "./tablet-landscape.js";
export function pageLayout(orientation){return orientation==="landscape"?landscape:portrait;}
