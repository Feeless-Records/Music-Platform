import {TouchSystem} from "./touch-system.js?v=storage-1";
export class MobileSystem extends TouchSystem{
 constructor(root,options={}){super(root,{...options,layout:"mobile"});}
}
