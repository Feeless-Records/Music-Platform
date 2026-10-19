import {TouchSystem} from "./touch-system.js?v=industry-1";
export class MobileSystem extends TouchSystem{
 constructor(root,options={}){super(root,{...options,layout:"mobile"});}
}
