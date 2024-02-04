字Button
======================================

字Button (zibutton) is a web app that helps you study the the stroke order of characters without needing a pen and paper. It displays the definition, pinyin, and a selection of strokes for the character, and then you select the next correct stroke.

字Button is available at https://zibutton.baconerie.com. You can create an account to make lists, or you can study public lists without an account (you need to have the link to the public list first)


Code layout
======================================

This project's layout is similar to other Next.js projects. Here is an overview to some of these files:

- `/app` contains source code
- `/scripts` contains code that sets up the database
- `/docs` contains documentation about the project; mostly empty

- Files at top-most directory has config files for npm, Next.js, etc.

How to run the app locally
======================================

*Note: You will need Node.js and npm installed, as well as git if you using that to download the source*

1. Download the source code (if you have git, run `git clone https://github.com/BaconErie/zibutton.git`)

2. Run `npm install` at the top most directory to install all the dependencies (make sure your NODE_ENV is NOT set to production)

3. Set the DB_PATH and TOKEN_SECRET environment variables

4. Run `setup.js` in the scripts folder to setup the database (it will only create the tables in the DB set in DB_PATH if they do not exist)

5. Run `npm run build`, then finally `npm run start`

Technology stack
======================================

- JavaScript as the language
- React.js as the UI library for the options page
- Next.js as the React framework
- [HanziWriter](https://hanziwriter.org/) as the library that renders the characters
- SQLite for database

License
======================================

字Button is licensed under the MIT license. See the [LICENSE file](LICENSE) for details. All dependencies are owned and licensed by their respective owners.
