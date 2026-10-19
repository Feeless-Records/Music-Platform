import {test} from "node:test";
import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {extensionRecommendation} from "../extension-suggestion.js";
test("browser recommendation distinguishes development routes without treating mobile as desktop",()=>{
 assert.equal(extensionRecommendation({userAgent:"Mozilla Firefox/145.0"}).target,"firefox");
 assert.equal(extensionRecommendation({userAgent:"Mozilla Chrome/143.0 Edg/143.0"}).target,"chromium");
 assert.equal(extensionRecommendation({userAgent:"Version/18.0 Safari/605.1"}).target,"safari");
 assert.equal(extensionRecommendation({userAgent:"Android Chrome/143.0 Mobile"}).target,"mobile");
 assert.equal(extensionRecommendation({userAgent:"Macintosh Version/18.0 Safari/605.1",maxTouchPoints:5}).target,"mobile");
 assert.equal(extensionRecommendation({}).target,"all");
});
test("extension build artifacts request no privileges and contain complete local popup assets",()=>{
 for(const target of ["chromium","firefox","safari-source"]){
 const archive=fileURLToPath(new URL("../downloads/music-platform-"+target+"-0.1.0.zip",import.meta.url));
 const read=file=>execFileSync("unzip",["-p",archive,file]);
 execFileSync("unzip",["-tq",archive]);
 const manifest=JSON.parse(read("manifest.json"));
 assert.equal(manifest.manifest_version,3);
 for(const key of ["permissions","host_permissions","optional_permissions","background","content_scripts","externally_connectable"])assert.equal(manifest[key],undefined,key);
 assert.ok(read(manifest.action.default_popup).length>0);
 for(const icon of Object.values(manifest.icons)){const data=read(icon);assert.equal(data.subarray(1,4).toString(),"PNG");}
 if(target==="firefox"){assert.deepEqual(manifest.browser_specific_settings.gecko.data_collection_permissions.required,["none"]);assert.ok(manifest.browser_specific_settings.gecko.id);}
 const html=read("popup.html").toString("utf8");assert.doesNotMatch(html,/<script|on(?:click|load)=/i);
 const links=[...html.matchAll(/href="(https:[^"]+)"/g)].map(match=>new URL(match[1]));
 assert.ok(links.length>=6);assert.ok(links.every(url=>url.origin==="https://feeless-records.github.io"&&url.pathname.startsWith("/Music-Platform/")));
 }
});
