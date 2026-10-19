import {number} from "./workflow-validation.js";
export class AutomationSystem{
 constructor(){this.lanes=new Map();}
 setPoint(parameter,beat,value){if(!parameter)throw new TypeError("Parameter required");number(beat);number(value,-Infinity);const lane=(this.lanes.get(parameter)||[]).filter(p=>p.beat!==beat);lane.push({beat,value});lane.sort((a,b)=>a.beat-b.beat);this.lanes.set(parameter,lane);}
 valueAt(parameter,beat){number(beat);const lane=this.lanes.get(parameter);if(!lane?.length)return null;if(beat<=lane[0].beat)return lane[0].value;for(let i=1;i<lane.length;i++)if(beat<=lane[i].beat){const a=lane[i-1],b=lane[i];return a.value+(b.value-a.value)*(beat-a.beat)/(b.beat-a.beat);}return lane.at(-1).value;}
}
