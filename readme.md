
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

So first you need to specify which buttons load a Sitch. You do this by adding the "sitch-activation-button" class to each relevant button. Then for each button you need to specify which Sitch it loads. You do this by adding the following data attribute.

### data-sitch-link

Every Sitch has a unique link. You can get this link by selecting the Sitch on https://mysitch.app and pressing "Copy Link", or by editing the Sitch and viewing it at the top of the edit page. As an example, for Sitch link https://sitch.app/s/i4lVvZB, you would add `data-sitch-link="https://sitch.app/s/i4lVvZB"` to a button.

There's two more attributes you can use to customize things:

### data-sitch-max-width

Use this to determine how far in the embedded Sitch will slide in from the right when activated. The value is in pixels. An example would be `data-sitch-max-width="500"` to make the Sitch slide in from the right and stop at 500px in.

### data-sitch-hash

To make the Sitches behave like proper webpages on your site you can add this data attribute to give them a hash addresses.  For example, a Sitch button on https://sitch.cards has `data-sitch-hash="store"` on it, so if you visit https://sitch.cards/#store the store opens right away . Make sure any hash addresses you use are unique and aren't used as HTML "id" values on any elements on your page.

Finally to activate the buttons you would import the library:

    import initializeSitchButtons from 'sitch-embed';

And call the imported function.

    initializeSitchButtons();

If you're not using a package manager you would just call `initializeSitchButtons();` once the script has loaded.

## Options

`initializeSitchButtons` takes single argument for an options object. Current there's just one option.

### baseZIndex (default: 999999)

You can provide a z-index for the embedded Sitches. So to make the Sitches use z-index 1000 you would write `initializeSitchButtons({baseZIndex: 1000})`.

### backgroundColor (default: '')

A background color to show before the Sitch's theme is initialized and rendered. This is really only relevant if a Sitch is being shown on page load using data-sitch-hash or if the user opens a Sitch very very quickly after page load. You would want this color to match your theme background to make the color shift less jarring. Example: `initializeSitchButtons({backgroundColor: '#000'})`.

## Caveats

`initializeSitchButtons()` must be called after the Sitch buttons are mounted in the DOM. If your DOM dynamically changes you'll have to re-execute the function any time new Sitch buttons are constructed.