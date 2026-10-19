export class PluginSystem{
 constructor(){this.registry=new Map();}
 register(definition){
 if(!/^[a-z0-9][a-z0-9.-]*$/.test(definition.id)||this.registry.has(definition.id)||!["instrument","effect"].includes(definition.kind)||typeof definition.name!=="string"||typeof definition.create!=="function")throw new TypeError("Invalid or duplicate plugin");
 for(const parameter of Object.values(definition.parameters??{}))if(![parameter.min,parameter.max,parameter.default].every(Number.isFinite)||parameter.min>parameter.default||parameter.default>parameter.max)throw new TypeError("Invalid plugin parameter");
 const plugin=Object.freeze({...definition,parameters:Object.freeze(Object.fromEntries(Object.entries(definition.parameters??{}).map(([key,value])=>[key,Object.freeze({...value})])))});
 this.registry.set(plugin.id,plugin);return plugin;
 }
 get(id,kind){const plugin=this.registry.get(id);if(!plugin||kind&&plugin.kind!==kind)throw new Error("Unknown "+(kind??"")+" plugin: "+id);return plugin;}
 list(kind){return [...this.registry.values()].filter(plugin=>!kind||plugin.kind===kind);}
 settings(id,parameters={},kind){const plugin=this.get(id,kind);if(!parameters||typeof parameters!=="object"||Array.isArray(parameters))throw new TypeError("Invalid plugin parameters");if(Object.keys(parameters).some(key=>!Object.hasOwn(plugin.parameters,key)))throw new Error("Unknown plugin parameter");
 return Object.fromEntries(Object.entries(plugin.parameters).map(([key,rule])=>{const value=parameters[key]??rule.default;if(!Number.isFinite(value)||value<rule.min||value>rule.max||rule.integer&&!Number.isInteger(value))throw new RangeError("Invalid "+key);return [key,value];}));
 }
}
