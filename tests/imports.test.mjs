import {test} from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
test("both browser entrypoints and their imports are served locally",()=>{
 const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),".."),seen=new Set();
 function visit(file){
 if(seen.has(file))return;seen.add(file);
 const source=fs.readFileSync(path.join(root,file),"utf8");
 for(const match of source.matchAll(/(?:from\s*|import\s*)["'](\.\.?\/[^"']+)["']/g))visit(path.normalize(path.join(path.dirname(file),match[1].split("?")[0])));
 }
 visit("index.js");visit("app.js");visit("desktop.js");
 const server=fs.readFileSync(path.join(root,"server.js"),"utf8");
 for(const file of seen)assert.ok(server.includes(JSON.stringify(file)),"Local server must serve "+file);
});
