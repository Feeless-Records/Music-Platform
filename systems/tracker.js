import {integer,number,insert,required} from "./workflow-validation.js";
export class TrackerSystem{
 constructor({linesPerBeat=4}={}){this.linesPerBeat=integer(linesPerBeat,1,256);this.patterns=new Map();this.order=[];}
 create(id,{rows=64}={}){integer(rows,1,1024);return insert(this.patterns,id,{id,rows,cells:[]});}
 setCell(id,{row,track=0,column=0,note=null,instrument=null,volume=127,effect=null}){
 const pattern=required(this.patterns,id);integer(row,0,pattern.rows-1);integer(track);integer(column,0,11);if(note!=="OFF"&&note!==null)integer(note,0,127);if(instrument!==null)integer(instrument,0,255);integer(volume,0,127);
 if(effect!==null&&!/^[A-Z0-9]{2}[A-F0-9]{2}$/.test(effect))throw new TypeError("Effect must be a two-character command plus hexadecimal byte");
 const cell={row,track,column,note,instrument,volume,effect};pattern.cells=pattern.cells.filter(c=>!(c.row===row&&c.track===track&&c.column===column));pattern.cells.push(cell);return cell;
 }
 setOrder(ids){ids.forEach(id=>required(this.patterns,id));this.order=[...ids];}
 events(){let offset=0;const result=[];for(const id of this.order){const p=required(this.patterns,id);for(const c of p.cells)result.push({...c,beat:offset+c.row/this.linesPerBeat});offset+=p.rows/this.linesPerBeat;}return result.sort((a,b)=>a.beat-b.beat);}
 static parseHex(value){if(!/^[A-Fa-f0-9]{2}$/.test(value))throw new TypeError("Hex byte required");return parseInt(value,16);}
}
