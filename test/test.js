// setup for node.js execution only
if(typeof module !== 'undefined' && module.exports){
	var assert      = require('chai').assert,
		jsdom       = require('jsdom').jsdom,
		fs          = require('fs'),
		suggestTags = require('../index.js');

	var document = jsdom(fs.readFileSync('test/test.html', {encoding: 'utf8'}));
}
// setup for browser w/ 
else if(typeof window !== 'undefined'){
	assert = window.chai.assert;
}

describe('makeapi-suggest-tags', function(){
	describe('suggestTags()', function(){
		describe('no links to makes in document', function(){
			it('should be a function', function(){
				assert.isFunction(suggestTags, 'we have a function');
			});

			it('should pass an empty array back when no links to makes in document', function(done){
				suggestTags(document.links, function(tags){
					assert.isArray(tags);
					assert.lengthOf(tags, 0);

					done();
				});
			});
		});

		describe('link to sinlge make (webmaker.keepcalm) in document', function(){
			before(function(){
				var container = document.getElementById('make-links');
				
				var keepcalm  = document.createElement('a');
				keepcalm.href = 'https://webmaker.makes.org/thimble/keep-calm';
				keepcalm.innerHTML = 'webmaker.keepcalm';
				container.appendChild(keepcalm);
				container.appendChild(document.createTextNode(', '));
			});

			it('should pass an array, containing 1 tag object, with 1 keepcalm tag', function(done){
				suggestTags(document.links, function(tags){
					assert.isArray(tags);
					assert.lengthOf(tags, 1);
					assert.isObject(tags[0]);
					assert.deepEqual(tags[0], {name:'keepcalm', frequency: 1});
					done();
				});
			});
		});

		describe('link to multiple makes (webmaker.keepcalm, laura.privacy-and-security-teaching-kit) in document', function(){
			before(function(){
				var container = document.getElementById('make-links');
				
				var privacykit  = document.createElement('a');
				privacykit.href = 'https://laura.makes.org/thimble/privacy-and-security-teaching-kit';
				privacykit.innerHTML = 'laura.privacy-and-security-teaching-kit';
				container.appendChild(privacykit);
				container.appendChild(document.createTextNode(', '));
			});

			it('should pass an array, containing 6 tag objects, each containing a string, and an integer', function(done){
				suggestTags(document.links, function(tags){
					assert.isArray(tags);
					assert.lengthOf(tags, 6);
					tags.forEach(function(tag){
						assert.isObject(tag);
						assert.property(tag, 'name');
						assert.isString(tag.name);
						assert.property(tag, 'frequency');
						assert.isNumber(tag.frequency);
						assert.strictEqual(Math.floor(tag.frequency), tag.frequency);
					});
					done();
				});
			});
		});
	});
});
