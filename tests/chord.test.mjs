import assert from "node:assert/strict";
import {test} from "node:test";
import {ChordSystem} from "../systems/chord.js";
test("major and minor triads",()=>{const c=new ChordSystem();assert.equal(c.detect([60,64,67]),"C");assert.equal(c.detect([57,60,64]),"Am");});
test("seventh chords and inversions",()=>{const c=new ChordSystem();assert.equal(c.detect([64,67,71,72]),"Cmaj7");assert.equal(c.detect([62,65,69,72]),"Dm7");});
test("octaves and empty selection",()=>{const c=new ChordSystem();assert.equal(c.detect([48,60,64,67]),"C");assert.equal(c.describe([]).chord,"—");});
