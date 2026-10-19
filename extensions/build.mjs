import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {deflateSync} from "node:zlib";
import {execFileSync} from "node:child_process";
const root=path.dirname(fileURLToPath(import.meta.url)),output=path.join(root,"build"),downloads=path.resolve(root,"../downloads");
function crc32(bytes){let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;}
function chunk(type,bytes){const name=Buffer.from(type),size=Buffer.alloc(4),crc=Buffer.alloc(4);size.writeUInt32BE(bytes.length);crc.writeUInt32BE(crc32(Buffer.concat([name,bytes])));return Buffer.concat([size,name,bytes,crc]);}
function icon(size){const pixels=Buffer.alloc((size*4+1)*size);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=y*(size*4+1)+1+x*4;const waveform=Math.abs(y-size/2)<size*.06&&x>size*.18&&x<size*.82||Math.abs(x-size*.35)<size*.045&&y>size*.28&&y<size*.72||Math.abs(x-size*.51)<size*.045&&y>size*.15&&y<size*.85||Math.abs(x-size*.67)<size*.045&&y>size*.35&&y<size*.65;const rgb=waveform?[23,42,28]:[190,239,139];pixels.set([...rgb,255],i);}const header=Buffer.alloc(13);header.writeUInt32BE(size);header.writeUInt32BE(size,4);header[8]=8;header[9]=6;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk("IHDR",header),chunk("IDAT",deflateSync(pixels)),chunk("IEND",Buffer.alloc(0))]);}
fs.mkdirSync(path.join(root,"common/icons"),{recursive:true});for(const size of [16,32,48,128])fs.writeFileSync(path.join(root,"common/icons/icon-"+size+".png"),icon(size));
fs.mkdirSync(output,{recursive:true});fs.mkdirSync(downloads,{recursive:true});
const icons=Object.fromEntries([16,32,48,128].map(size=>[size,"icons/icon-"+size+".png"]));
const base={manifest_version:3,name:"Feeless Records Music Platform Companion",version:"0.1.0",description:"Open the Music Platform studio and tools from your browser toolbar.",homepage_url:"https://feeless-records.github.io/Music-Platform/",icons,action:{default_title:"Music Platform",default_popup:"popup.html",default_icon:icons}};
for(const target of ["chromium","firefox","safari-source"]){
 const dir=path.join(output,target);fs.mkdirSync(dir,{recursive:true});fs.cpSync(path.join(root,"common"),dir,{recursive:true});
 const manifest=structuredClone(base);
 if(target==="firefox")manifest.browser_specific_settings={gecko:{id:"music-platform@feeless-records.github.io",strict_min_version:"142.0",data_collection_permissions:{required:["none"]}}};
 fs.writeFileSync(path.join(dir,"manifest.json"),JSON.stringify(manifest,null,2)+"\n");
 const archive=path.join(downloads,"music-platform-"+target+"-0.1.0.zip");fs.rmSync(archive,{force:true});
 execFileSync("zip",["-q","-r",archive,"manifest.json","popup.html","popup.css","icons"],{cwd:dir});
 console.log(target+": "+archive);
}
