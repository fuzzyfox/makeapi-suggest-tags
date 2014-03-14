# makeapi-suggest-tags
Gets suggested tags for a document based on pages it links to that are known to the MakeAPI.

## Usage
### NodeJS <small>+ jsdom</small>
This example uses jsdom, but you can use whatever DOM implementation you wish.

	var suggestTags = require('makeapi-suggest-tags').suggestTags,
		jsdom = require('jsdom');
	
	var doSomething = function(arrayOfTagObjects){
		// doSomething with arrayOfTagObjects 
	};
	
	jsdom.env({
		url: 'http://www.example.com/',
		done: function(errors, window){
			suggestTags(window.document.links, doSomething);
		}
	});

### In browser

	<!doctype html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Example</title>
	</head>
	<body>
		<script src="path/to/makeapi-client.js"></script>
		<script src="path/to/suggest-tags.js"></script>
		<script>
			var doSomething = function(arrayOfTagObjects){
				// doSomething with arrayOfTagObjects 
			};

			suggestTags(document.links, doSomething);
		</script>
	</body>
	</html>

## Testing
### In browser
To test in browser you will need to run the following from your terminal:

	npm install -g bower
	bower install

Then open `test/test.html` in your browser of choice.

### On the commandline

	npm install -g mocha
	npm install
	mocha
