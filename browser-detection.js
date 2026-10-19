// Advisory browser identity only. Feature support is checked separately.
export class BrowserDetectionSystem{
 static detect(navigator={}){
 const ua=navigator.userAgent||"",brands=navigator.userAgentData?.brands||[];
 for(const [name,pattern]of [["Edge",/Edg(?:A|iOS)?\/([\d.]+)/],["Opera",/(?:OPR|OPiOS)\/([\d.]+)/],["Samsung Internet",/SamsungBrowser\/([\d.]+)/]]){const match=ua.match(pattern);if(match)return {name,version:match[1],source:"user-agent",confidence:"advisory"};}
 const hints=[["Microsoft Edge","Edge"],["Opera","Opera"],["Google Chrome","Chrome"],["Chromium","Chromium"]];
 for(const [brand,name]of hints){const found=brands.find(item=>item.brand===brand);if(found)return {name,version:found.version,source:"client-hints",confidence:"advisory"};}
 const patterns=[["Edge",/Edg(?:A|iOS)?\/([\d.]+)/],["Opera",/(?:OPR|OPiOS)\/([\d.]+)/],["Samsung Internet",/SamsungBrowser\/([\d.]+)/],["Firefox",/(?:Firefox|FxiOS)\/([\d.]+)/],["Chrome",/(?:Chrome|CriOS)\/([\d.]+)/],["Safari",/Version\/([\d.]+).*Safari/]];
 for(const [name,pattern]of patterns){const match=ua.match(pattern);if(match)return {name,version:match[1],source:"user-agent",confidence:"advisory"};}
 return {name:"Unknown",version:null,source:"unavailable",confidence:"unknown"};
 }
}
