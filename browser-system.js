import {BrowserDetectionSystem} from "./browser-detection.js";
import {DeviceSystem} from "./browser-device.js";
import {BrowserPropertiesSystem} from "./browser-properties.js";
export class BrowserSystem{
 constructor(win){this.win=win;}
 inspect(){return {identity:BrowserDetectionSystem.detect(this.win.navigator),device:DeviceSystem.detect(this.win.navigator),properties:BrowserPropertiesSystem.read(this.win)};}
 storageStatus(){return BrowserPropertiesSystem.storageStatus(this.win.navigator);}
}
