import {TouchSystem} from "./touch-system.js?v=plugins-1";
export class MobileSystem extends TouchSystem{
 constructor(root,options={}){super(root,{...options,layout:"mobile"});}
}
