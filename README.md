# Sequence Diagrams for HTML

This is a set of stylesheets for displaying sequence diagrams in HTML pages.

You can see it in action on the [demo page](http://geraintluff.github.io/sequence-diagram-html/example-semantic.html) - be sure to look at the source.  For the layout code, see the [pure CSS demo](http://geraintluff.github.io/sequence-diagram-html/example-css.html).

To embed in your page, you'll need [`sequence-diagram.css`](http://geraintluff.github.io/sequence-diagram-html/sequence-diagram.css), plus either the conversion script or an extra CSS file for columns.

## Pure CSS (includes layout)

The underlying markup works by separating everything into columns and adding CSS classes (e.g. `col-2-4` for column 2 in a 4-column layout).  If you're doing the layout manually (pure CSS option), you'll need to include [`sequence-diagram-columns.css`](http://geraintluff.github.io/sequence-diagram-html/sequence-diagram-columns.css).

However, you shouldn't have to write this layout code yourself, instead writing the semantic markup.

## Semantic markup

The diagram can be entered in a more intuitive way (no layout concerns).  To automatically convert, include the [`convert.js`](http://geraintluff.github.io/sequence-diagram-html/convert.js) script, and place the diagram markup in a `<sequence-diagram-semantic>` element.  You do not need the column CSS, because the conversion script generates CSS as needed.

All elements in the semantic markup can be used either directly (i.e. `<sequence-diagram-semantic>`) or declared by the corresponding CSS class (i.e. `<div class="sequence-diagram-semantic">`).

### Declaring entities

Entities are declared with a `<header>` element.  Each entity is an `<entity>` element, with an optional `alias` attribute specifying how it will be referred to later.

```html
<sequence-diagram-semantic>
	<header>
		<entity>Alice</entity>
		<entity>Bob</entity>
		<entity>Carol</entity>
		<entity alias="cat">Dani's cat</entity>
	</header>
	...
</sequence-diagram-semantic>
```

### Actions

Actions are declared with a `<action>` element.

The source/target of the action can be specified either with `<to>`/`<from>` elements, or `to`/`from` properties, depending on whether they're part of the content or not:

```html
<sequence-diagram-semantic>
	<header>...</header>
	<action><from>Alice</from> asks <to>Bob</to> a question</action>
	<action from="Bob" to="Alice">reply</action>
</sequence-diagram-semantic>
```

### Notes and events

Notes and events are declared with `<note>` or `<event>` elements.

As with `<action>`s, `to`/`from` (attributes or elements) can be used to span the event between two entities.  However, `<for>` (or the `for=` attribute) can be used to place associate the note/event with a single entity.

## Conversion from text

Also included is a (fairly hacky) convertor that takes in a simple text format and outputs HTML:

```
Alice --> Carol: say hello
Carol: (notes go here)
Dani: some event
```

See more at the [live demo](http://geraintluff.github.io/sequence-diagram-html/).
