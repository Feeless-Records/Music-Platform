export function number(value,min=0,max=Infinity){if(!Number.isFinite(value)||value<min||value>max)throw new RangeError("Value outside allowed range");return value;}
export function integer(value,min=0,max=Infinity){number(value,min,max);if(!Number.isInteger(value))throw new RangeError("Integer required");return value;}
export function required(map,id){if(!map.has(id))throw new Error("Unknown id: "+id);return map.get(id);}
export function insert(map,id,value){if(typeof id!=="string"||!id||map.has(id))throw new Error("Invalid or duplicate id");map.set(id,value);return value;}
