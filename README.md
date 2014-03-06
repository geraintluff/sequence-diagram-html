# Sequence Diagrams for HTML

This is a set of stylesheets for displaying sequence diagrams in HTML pages.

You can preview it at the [demo page](http://geraintluff.github.io/sequence-diagram-html/example-css.html) - be sure to look at the source!

## Conversion from semantic markup

The diagram can be entered in a more intuitive way (no layout concerns).  To automatically convert, include the `convert.js` script, and place the diagram markup in a `<sequence-diagram-semantic>` element.

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

## Conversion from text

Also included is a (fairly hacky) convertor that takes in a simple text format and outputs HTML:

```
Alice --> Carol: say hello
Carol: (notes go here)
Dani: some event
```

See more at the [live demo](http://geraintluff.github.io/sequence-diagram-html/).