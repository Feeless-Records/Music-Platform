export class ThemeSystem {
  static presets={dark:{background:"#10121a",foreground:"#eef1f8",accent:"#ffb542"},light:{background:"#f5f7fb",foreground:"#182030",accent:"#a34b00"}};
  constructor(root=document.documentElement){this.root=root;}
  apply(name="dark"){
    const theme=ThemeSystem.presets[name]||ThemeSystem.presets.dark;
    for(const [key,value] of Object.entries(theme))this.root.style.setProperty("--"+key,value);
  }
}
