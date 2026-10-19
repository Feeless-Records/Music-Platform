// Hardware class is an inference; it must not control feature availability.
export class DeviceSystem{
 static detect(navigator={}){
 const ua=navigator.userAgent||"";
 const ipad=/iPad/i.test(ua)||(/Macintosh/i.test(ua)&&(navigator.maxTouchPoints||0)>1);
 if(ipad||/Tablet/i.test(ua)||(/Android/i.test(ua)&&!/Mobile/i.test(ua)))return {family:"tablet",source:"user-agent",confidence:"inferred"};
 if(navigator.userAgentData?.mobile===true||/Mobile|iPhone|iPod/i.test(ua))return {family:"smartphone",source:navigator.userAgentData?.mobile===true?"client-hints":"user-agent",confidence:"inferred"};
 if(/Windows NT|Macintosh|X11|CrOS/i.test(ua))return {family:"desktop",source:"user-agent",confidence:"inferred"};
 return {family:"unknown",source:"unavailable",confidence:"unknown"};
 }
}
