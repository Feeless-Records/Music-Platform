import {PROJECT_FORMAT,validateProject} from "./import-system.js?v=plugins-1";
export class ExportSystem{
 constructor(core){this.core=core;}
 project(){const value={format:PROJECT_FORMAT,version:1,name:this.core.project.name,bpm:this.core.timeline.bpm,notes:structuredClone(this.core.workflow.patterns.get("pattern-1").notes),plugins:{instruments:this.core.instruments.snapshot(),effects:this.core.effects.snapshot()}};validateProject(value);return new Blob([JSON.stringify(value,null,2)],{type:"application/json"});}
}
