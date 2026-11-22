"use strict";
const normalize = (w) => w.toLowerCase().replace(/[^a-z0-9']/g, "");

// Edit distance <= 1 (substitution, insertion or deletion).
function withinOneEdit(a, b) {
  if (a === b) return true;
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let i = 0, j = 0, miss = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++miss > 1) return false;
    if (la === lb) { i++; j++; } else if (la > lb) i++; else j++;
  }
  return true;
}

// Fuzzy only for words of 4+ characters so "the" and "then" are not confused.
const wordsMatch = (a, b) => !!a && !!b && (a === b || (a.length >= 4 && b.length >= 4 && withinOneEdit(a, b)));

class ScriptFollower {
  constructor(script, lookahead = 12) {
    this.tokens = script.split(/\s+/).filter(Boolean).map(normalize);
    this.lookahead = lookahead;
    this.pointer = 0; // index of the next word we expect to hear
  }
  // Feed recognised words. Each word searches forward from the pointer inside the
  // lookahead window; a miss is treated as noise and leaves the pointer alone.
  hear(text) {
    let p = this.pointer;
    for (const w of text.split(/\s+/).map(normalize).filter(Boolean)) {
      const end = Math.min(this.tokens.length, p + this.lookahead);
      for (let q = p; q < end; q++) {
        if (wordsMatch(this.tokens[q], w)) { p = q + 1; break; }
      }
    }
    this.pointer = p;
    return p;
  }
  get done() { return this.pointer >= this.tokens.length; }
}

module.exports = { normalize, withinOneEdit, wordsMatch, ScriptFollower };
