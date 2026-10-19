export class VelocitySystem {
  static clamp(value){return Math.max(0,Math.min(127,Math.round(value)));}
  static toGain(velocity,curve=2){return Math.pow(VelocitySystem.clamp(velocity)/127,curve);}
  static fromGain(gain,curve=2){return VelocitySystem.clamp(127*Math.pow(Math.max(0,Math.min(1,gain)),1/curve));}
}
