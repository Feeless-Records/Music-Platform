import {test} from "node:test";
import assert from "node:assert/strict";
import {fitBounds} from "../systems/window-system.js";
test("windows remain reachable after resizing to a phone viewport",()=>{
 assert.deepEqual(fitBounds({x:450,y:300,width:570,height:320},{width:360,height:260}),{x:0,y:0,width:360,height:260});
 assert.deepEqual(fitBounds({x:-100,y:-20,width:300,height:200},{width:800,height:600}),{x:0,y:0,width:300,height:200});
});
test("moving windows cannot lose title bars beyond workspace edges",()=>{
 const bounds=fitBounds({x:1000,y:900,width:300,height:200},{width:800,height:600});
 assert.deepEqual(bounds,{x:500,y:400,width:300,height:200});
});
