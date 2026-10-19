import {TouchSystem} from "./touch-system.js?v=recording-2";
export class MobileSystem extends TouchSystem{
 constructor(root,options={}){super(root,{...options,layout:"mobile"});}
}
