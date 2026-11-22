const assert = require("assert");
const { ScriptFollower, withinOneEdit, wordsMatch } = require("./index");
const script = "Welcome back to the channel. Today we are looking at how a voice teleprompter follows your reading.";
let f = new ScriptFollower(script);
assert.strictEqual(f.hear("welcome back to the channel"), 5);
// a misheard word ("telepromter") with 1 edit still matches
assert.strictEqual(f.hear("today we are looking at how a voice telepromter"), 14);
// a word that is not in the window does not move the pointer
assert.strictEqual(f.hear("banana"), 14);
// skipping ahead within the window works
f = new ScriptFollower(script);
assert.strictEqual(f.hear("today"), 6);
// outside a 12-word window nothing matches
f = new ScriptFollower("one two three four five six seven eight nine ten eleven twelve thirteen fourteen", 3);
assert.strictEqual(f.hear("fourteen"), 0);
assert.ok(withinOneEdit("reading", "reeding"));
assert.ok(!wordsMatch("the", "then"));
f = new ScriptFollower("short script"); f.hear("short script"); assert.ok(f.done);
console.log("ok");
