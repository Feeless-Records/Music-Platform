export class ChordSystem {
  static NAMES=["C","C♯","D","D♯","E","F","F♯","G","G♯","A","A♯","B"];
  static PATTERNS=[
    {intervals:[0,4,7,11],suffix:"maj7"},
    {intervals:[0,3,7,10],suffix:"m7"},
    {intervals:[0,4,7,10],suffix:"7"},
    {intervals:[0,3,6,10],suffix:"m7♭5"},
    {intervals:[0,3,6,9],suffix:"dim7"},
    {intervals:[0,4,7],suffix:""},
    {intervals:[0,3,7],suffix:"m"},
    {intervals:[0,3,6],suffix:"dim"},
    {intervals:[0,4,8],suffix:"aug"},
    {intervals:[0,5,7],suffix:"sus4"},
    {intervals:[0,2,7],suffix:"sus2"}
  ];
  noteName(midi){return ChordSystem.NAMES[((midi%12)+12)%12];}
  detect(notes){
    const pitches=[...new Set(notes.map(n=>((n%12)+12)%12))].sort((a,b)=>a-b);
    if(!pitches.length)return "—";
    if(pitches.length===1)return this.noteName(pitches[0])+" (нота)";
    for(const pattern of ChordSystem.PATTERNS){
      if(pattern.intervals.length!==pitches.length)continue;
      for(const root of pitches){
        const matches=pattern.intervals.every(i=>pitches.includes((root+i)%12));
        if(matches)return this.noteName(root)+pattern.suffix;
      }
    }
    return "Аккорд не определён";
  }
  describe(notes){
    const sorted=[...notes].sort((a,b)=>a-b);
    const names=sorted.map(n=>this.noteName(n)+(Math.floor(n/12)-1));
    return {chord:this.detect(sorted),notes:names.join(" · ")||"Нет нажатых нот"};
  }
}
