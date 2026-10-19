export class EventSystem {
  constructor(){this.handlers=new Map();}
  on(type,handler){const set=this.handlers.get(type)||new Set();set.add(handler);this.handlers.set(type,set);return ()=>this.off(type,handler);}
  off(type,handler){this.handlers.get(type)?.delete(handler);}
  emit(type,payload){for(const handler of this.handlers.get(type)||[])handler(payload);return payload;}
  clear(){this.handlers.clear();}
}
