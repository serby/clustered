# clustered

Cluster your server

[![build status](https://secure.travis-ci.org/serby/clustered.png)](http://travis-ci.org/serby/clustered) [![Greenkeeper badge](https://badges.greenkeeper.io/serby/clustered.svg)](https://greenkeeper.io/)

## Installation

      npm install clustered

## Usage

## Run test

Manual test available. Run the test script

      NODE_ENV=test node test/manual

followed by a number of cURL requests

      curl http://localhost:5545/

which will trigger an exception. The single process should die, then a new process forked in it's place, along with logging.

## Prettier

This project uses prettier for code formatting and linting. You can set prettier
up to [auto format code in your editor](https://prettier.io/docs/en/editors.html),
or manually format code before committing with `yarn prettier`.

## Credits

[Paul Serby](https://github.com/serby/) follow me on twitter [@serby](http://twitter.com/serby)

## License

Licensed under the [ISC](https://opensource.org/licenses/ISC)
