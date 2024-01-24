字Button
======================================

字Button (zibutton) is a web app that helps you study the the stroke order of characters without needing a pen and paper. It displays the definition, pinyin, and a selection of strokes for the character, and then you select the next correct stroke.

For the currently stable, client side only app, go to [main page](https://baconerie.github.io/zibutton) and enter the characters you want to study. You can also import or export a list of characters. Then, click the "Start Quiz" to start studying.


Code layout
======================================

**Note: this applies only to the client-only branch**

- `/src` contains source code
- `/docs` contains the built files

- Files at top-most directory has config files for Webpack and Babel

How to run the app locally
======================================

*Note: You will need Node.js and npm installed*

1. Download the source code (one way is from the [releases page](https://github.com/BaconErie/zibutton/releases))

2. Run `npm install` at the top most directory to install all the dependencies (make sure your NODE_ENV is NOT set to production)

3. Run `npm run build`. The built and ready-to-use pages will be in the `docs` folder.

4. Run `npm run dev` to start serving the files.

# Technology stack

- JavaScript as the language
- React.js as the UI library for the options page
- [HanziWriter](https://hanziwriter.org/) as the library that renders the characters
- Webpack and Babel.js to compile the JSX

# License

字Button is licensed under the MIT license. See the [LICENSE file](LICENSE) for details. All dependencies are owned and licensed by their respective owners.
