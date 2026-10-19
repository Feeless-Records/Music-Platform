import {FrequencySystem} from "./frequency.js";
import {PatternSystem} from "./pattern.js";
import {PianoRollSystem} from "./piano-roll.js";
import {ChannelRackSystem} from "./channel-rack.js";
import {ClipSystem} from "./clip.js";
import {ArrangementSystem} from "./arrangement.js";
import {SessionSystem} from "./session.js";
import {AutomationSystem} from "./automation.js";
import {MixerSystem} from "./mixer.js";
import {WarpSystem} from "./warp.js";
import {TrackerSystem} from "./tracker.js";
import {TransportSystem} from "./transport.js";
export class WorkflowSystem{
 compilePattern(id){return this.patterns.get(id).notes.map(({beat,duration,note,velocity,channelId})=>({beat,duration,frequency:FrequencySystem.midiToHz(note),velocity,channelId}));}
 constructor(timeline){this.patterns=new PatternSystem();this.pianoRoll=new PianoRollSystem(this.patterns);this.channelRack=new ChannelRackSystem(this.patterns,this.pianoRoll);this.clips=new ClipSystem(this.patterns);this.arrangement=new ArrangementSystem(this.clips);this.session=new SessionSystem(this.clips);this.automation=new AutomationSystem();this.mixer=new MixerSystem();this.warp=new WarpSystem();this.tracker=new TrackerSystem();this.transport=new TransportSystem(timeline);}
}
