# follow-the-script

The core of a voice-following teleprompter: given a script and the words a speech recognizer thinks it heard, keep a pointer at the place you have read up to.

Instead of demanding an exact transcript, each recognized word searches a short window of upcoming script words (12 by default). A hit moves the pointer just past the match; a miss is treated as noise and the pointer stays put. Words of four or more characters also match with one typo, so a misheard word does not stall tracking, and short words such as "the" and "then" are never confused.

## Use

```js
const { ScriptFollower } = require("./index");
const f = new ScriptFollower("Welcome back to the channel. Today we are looking at ...");
f.hear("welcome back to the channel"); // 5
f.hear("today we are");                // 8
f.pointer;                             // word index to scroll to
```

In a browser, feed `hear()` from the `SpeechRecognition` result event (Chrome and Edge support it; audio handling depends on the browser, so read its privacy notes). `npm test` covers typos, noise words, skipping ahead and the window limit.

## In the wild

This is the matching idea behind the browser-based [voice-controlled teleprompter](https://getvoiceteleprompter.com/?utm_source=github&utm_medium=readme), which also has a manual scroll mode for browsers without speech recognition.

License: MIT
