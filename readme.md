## What is it?

This package lets you use embedded Sitches on your website. Sitches are functionality focused web pages that you can build on https://mysitch.app. You can learn more about what they're for at https://sitch.cards.

## Demo

The blog, store, and contact form on https://sitch.cards are all embedded Sitches.

## Installation

    yarn add sitch-embed
or

    npm add sitch-embed
or if you're not using a package manager

    <script src="https://storage.googleapis.com/sitch-public/sitch-embed.js"></script> 

## Usage

So first you need to specify which buttons load a Sitch. You do this by adding the "sitch-activation-button" class to each relevant button. Then for each button you need to specify which Sitch it loads. You do this by adding a data attribute. There's two attributes for this:

### data-sitch-id

Every Sitch has a Sitch ID that you can see when editing the Sitch at https://mysitch.app at the very top of the page. It will look something like "i4lVvZB". So to embed and use a Sitch with that ID using a button, you would add `data-sitch-id="i4lVvZB"` to that button.

### data-sitch-custom-id

You can optionally generate a custom link for a Sitch when editing it. the last part of that custom link is the Sitches custom ID. So for https://sitch.app/blog, "blog" is the custom id. So to embed and use a Sitch with that ID using a button, you would add `data-sitch-custom-id="blog"` to that button.

There's currently one more attribute you can use to customize things:

### data-sitch-max-width

Use this to determine how far in the embedded Sitch will slide in from the right when activated. The value is in pixels. An example would be `data-sitch-max-width="500"` to make the Sitch slide in from the right and stop at 500px in.

Finally to activate the buttons you would import the library:

    import initializeSitchButtons from 'sitch-embed';

And call the imported function.

    initializeSitchButtons();

If you're not using a package manager you would just call `initializeSitchButtons();` once the script has loaded.

## Options

`initializeSitchButtons` takes single argument for an options object. Current there's just one option.

### baseZIndex (default: 999999)

You can provide a z-index for the embedded Sitches. So to make the Sitches use z-index 1000 you would write `initializeSitchButtons({baseZIndex: 1000})`.

## Caveats

`initializeSitchButtons()` must be called after the Sitch buttons are mounted in the DOM. If your DOM dynamically changes you'll have to re-execute the function any time new Sitch buttons are constructed.