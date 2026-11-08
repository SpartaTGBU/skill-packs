# Accessibility fixes and keystroke tests

Fix only the flagged element. Examples use a toolbar, a clickable card and a search field.

```html
<!-- toolbar icon with no name -->
<button class="tb"><svg>...</svg></button>
<button class="tb" aria-label="Bold" aria-pressed="false"><svg aria-hidden="true" focusable="false">...</svg></button>

<!-- clickable card made of a div -->
<div class="card" onclick="open(7)"><h3>Q3 report</h3></div>
<article class="card"><h3><a href="/reports/7" class="stretch">Q3 report</a></h3></article>
<!-- .stretch::after { content:""; position:absolute; inset:0 } makes the whole card a hit area -->

<!-- search field, placeholder as label, silent result count -->
<input placeholder="Search"><div>12 results</div>
<form role="search"><label for="q">Search reports</label><input id="q" type="search">
<p role="status">12 results</p></form>

<!-- disclosure -->
<button aria-expanded="false" aria-controls="ship">Shipping</button><div id="ship" hidden>...</div>
```

## Keystroke tests per widget
Pass means every line holds. Run with the mouse unplugged.

| Widget | Keys and expected result |
|---|---|
| Button, toggle | Tab lands once; Enter and Space both activate; `aria-pressed` flips |
| Link | Tab lands; Enter follows; Space does not |
| Disclosure | Enter or Space toggles; `aria-expanded` follows; content reachable by Tab only when open |
| Menu button + menu | Enter or Down opens and focuses first item; Up/Down move; Home/End jump; Esc closes and focus returns to button; Tab leaves the menu |
| Tabs | Tab enters the tab list on the selected tab only; Left/Right move (and select or focus per project choice); Tab goes to the panel |
| Dialog | open: focus inside; Tab x N cycles inside; Shift+Tab from first goes to last; Esc closes; focus on trigger; scrolling the page behind does nothing |
| Listbox / select | Down opens; type-ahead jumps; Enter chooses; Esc cancels without changing value |
| Combobox | typing filters; Down moves into list without leaving the input in the tree; Enter selects; Esc clears popup first, text second |
| Radio group | one Tab stop; arrows move and check |
| Slider | arrows step; Home/End min/max; PageUp/PageDown larger step; value announced |
| Toast | does not move focus; has `role="status"`; dismiss button reachable; stays at least 5s plus 1s per 100 characters [practice: house heuristic, not a WCAG number; WCAG 2.2.1 only requires the user can extend or turn off a time limit] |

Combobox, date picker and drag-and-drop: use the project's primitive library, do not hand-roll.

Console helper to watch where focus goes while pressing Tab:
```js
document.addEventListener('focusin', e => console.log(e.target.tagName, e.target.getAttribute('aria-label')||e.target.textContent.trim().slice(0,30)));
```
