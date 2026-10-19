import assert from "node:assert/strict";
import {test} from "node:test";
import {MasterVolumeSystem} from "../systems/master-volume.js";

class FakeGain {
  constructor(context){this.context=context;this.values=[];this.gain={
    value:0,cancelScheduledValues:()=>{},
    setTargetAtTime:(value)=>{this.values.push(value);this.gain.value=value;}
  };}
  connect(destination){this.destination=destination;}
  disconnect(){this.disconnected=true;}
}
class FakeContext {
  constructor(){this.currentTime=0;this.destination={};this.nodes=[];}
  createGain(){const node=new FakeGain(this);this.nodes.push(node);return node;}
}
test("master volume controls every connected audio context",()=>{
  const master=new MasterVolumeSystem(100);
  const a=new FakeContext(),b=new FakeContext();
  const aNode=master.attach(a,{connect:destination=>{assert.equal(destination,a.nodes[0]);}});
  const bNode=master.attach(b,{connect:destination=>{assert.equal(destination,b.nodes[0]);}});
  assert.equal(aNode.gain.value,1);
  assert.equal(bNode.gain.value,1);
  master.setValue(35);
  assert.equal(aNode.gain.value,.35);
  assert.equal(bNode.gain.value,.35);
  master.setValue(0);
  assert.equal(aNode.gain.value,0);
  assert.equal(bNode.gain.value,0);
  master.setValue(100);
  assert.equal(aNode.gain.value,1);
  master.dispose();
  assert.equal(aNode.disconnected,true);
  assert.equal(bNode.disconnected,true);
});
