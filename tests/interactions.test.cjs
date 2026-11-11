'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = path.resolve(__dirname, '../public/assets/oferta.js');
let triggerTop = 100;
let observerCallback;
let activeIntervals = 0;
const docListeners = {};
const windowListeners = {};
const filters = ['todos', 'doce', 'salgado'].map(choice => ({
 dataset: { recipeFilter: choice }, attributes: {}, handlers: {},
 setAttribute(k, v) { this.attributes[k] = v; },
 addEventListener(k, v) { this.handlers[k] = v; }
}));
const cards = ['doce', 'salgado', 'doce'].map(type => ({ dataset: { recipeType: type }, hidden: false }));
const status = { textContent: '' };
const classes = new Set();
const sticky = { classList: { toggle(name, value) { if (value) classes.add(name); else classes.delete(name); } } };
const trigger = { getBoundingClientRect: () => ({ top: triggerTop }) };
const document = {
 hidden: false,
 querySelectorAll(selector) { return selector === '[data-recipe-filter]' ? filters : selector === '[data-recipe-type]' ? cards : []; },
 querySelector(selector) { return selector === '.mobile-offer' ? sticky : selector === '.recipe-filter-status' ? status : null; },
 getElementById() { return trigger; },
 addEventListener(k, callback) { docListeners[k] = callback; }
};
const context = {
 document,
 Date: class extends Date { static now() { return now; } },
 window: { IntersectionObserver: true, addEventListener(k, callback) { windowListeners[k] = callback; } },
 IntersectionObserver: class { constructor(callback) { observerCallback = callback; } observe() {} },
 setInterval() { activeIntervals++; return 1; },
 clearInterval() { activeIntervals--; }
};
vm.runInNewContext(fs.readFileSync(source, 'utf8'), context);
assert.equal(classes.has('is-visible'), false);
triggerTop = -1; observerCallback(); assert.equal(classes.has('is-visible'), true);
triggerTop = 100; observerCallback(); assert.equal(classes.has('is-visible'), false);
filters[1].handlers.click();
assert.deepEqual(cards.map(x => x.hidden), [false, true, false]);
assert.equal(status.textContent, '2 ideias em exibição');
assert.equal(filters[1].attributes['aria-pressed'], 'true');
assert.equal(filters[0].attributes['aria-pressed'], 'false');
filters[0].handlers.click(); assert.deepEqual(cards.map(x => x.hidden), [false, false, false]);
console.log('PASS: recipe filters and sticky CTA threshold; countdown removed.');
// Review duplication stays outside the accessible reading order; pause enables browsing.
const reviewClasses = new Set();
const reviewToggle = { hidden: true, textContent: '', attrs: {}, setAttribute(k,v) { this.attrs[k]=v; }, addEventListener(k,v) { this[k]=v; } };
const clone = { attrs: {}, setAttribute(k,v) { this.attrs[k]=v; } };
const reviewTrack = { appendChild(node) { this.child=node; } };
const viewport = { scrollLeft: 80 };
const review = {
 querySelector(s) { return { '.reviews-group': { cloneNode: () => clone }, '.reviews-track': reviewTrack, '.reviews-toggle': reviewToggle, '.reviews-viewport': viewport }[s]; },
 classList: { add(k) { reviewClasses.add(k); }, toggle(k) { if(reviewClasses.has(k)) { reviewClasses.delete(k); return false; } reviewClasses.add(k); return true; } }
};
const previousQuery = document.querySelector;
document.querySelector = s => s === '.reviews' ? review : previousQuery(s);
vm.runInNewContext(fs.readFileSync(source, 'utf8'), context);
assert.equal(reviewTrack.child, clone);
assert.equal(clone.attrs['aria-hidden'], 'true');
assert.equal(clone.attrs.inert, '');
assert.equal(reviewToggle.hidden, false);
reviewToggle.click();
assert.equal(reviewClasses.has('is-paused'), true);
assert.equal(reviewToggle.attrs['aria-pressed'], 'true');
reviewToggle.click();
assert.equal(reviewClasses.has('is-paused'), false);
assert.equal(viewport.scrollLeft, 0);
const html = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8');
assert.equal((html.match(/class="review-card"/g)||[]).length,10);
assert.equal((html.match(/aria-label="4 de 5 estrelas"/g)||[]).length,4);
console.log('PASS: ten reviews, corrected ratings, accessible clones and pause/resume.');
