/* global chai, suggestTags, $, before, after */
'use strict';

var assert = chai.assert;

describe( 'makeapi-suggest-tags', function() {
  describe( 'no makes on page', function() {
    it( 'should pass back an empty array', function( done ) {
      suggestTags( document.querySelectorAll( '#make-links a' ) || undefined, function( tags ) {
        assert.isArray( tags );
        assert.lengthOf( tags, 0 );

        done();
      });
    });
  });

  describe( 'keep calm make on page', function() {
    before( function() {
      $( '#make-links' ).append( '<a id="keepcalm" href="https://webmaker.makes.org/thimble/keep-calm">keep calm</a>' );
    });

    it( 'should return and array with 1 tag object, with name #keepcalm and frequency 1', function( done ) {
      suggestTags( document.querySelectorAll( '#make-links a' ), function( tags ) {
        assert.isArray( tags );
        assert.lengthOf( tags, 1 );
        assert.isObject( tags[0] );
        assert.deepEqual( tags[0], {
          name: 'keepcalm',
          frequency: 1
        });

        done();
      });
    });

    after( function() {
      $( '#keepcalm' ).remove();
    });
  });

  describe( 'privacy and security kit agenda links on page', function(){
    before( function() {
      var agendaLinks  = '<a href="https://laura.makes.org/thimble/privacy-introductions-and-setup">Introductions and Set-up: Your Online Privacy</a>';
          agendaLinks += '<a href="https://laura.makes.org/thimble/spectrogram-for-understanding-privacy">Spectrogram for Understanding Privacy</a>';
          agendaLinks += '<a href="https://laura.makes.org/thimble/protect-your-privacy">Protect Your Privacy</a>';
          agendaLinks += '<a href="https://laura.makes.org/thimble/remix-for-cybersafety">Remix for Cyber Safety</a>';
          agendaLinks += '<a href="https://laura.makes.org/thimble/lightbeam-activity">Tracking the Trackers with Lightbeam</a>';

      $( '#make-links' ).append( '<div id="agenda-links">' + agendaLinks + '</div>' );
    });

    it( 'should return an array of 7 tag objects matching the expected names/frequencies', function( done ) {
      suggestTags( document.querySelectorAll( '#agenda-links a' ), function( tags ) {
        assert.isArray( tags );
        assert.lengthOf( tags, 7 );

        // check that the return is well formed.
        tags.filter( function( tag ){
          assert.isObject( tag );
          assert.property( tag, 'name' );
          assert.property( tag, 'frequency' );
        });

        // create copy of tags array, and stringify objects within so as to
        // use `assert.sameMembers()`
        var stringifiedTags = JSON.parse( JSON.stringify( tags ) );
        stringifiedTags.forEach( function( tag, idx ) {
          stringifiedTags[ idx ] = JSON.stringify( tag );
        });

        // members created by doing a manual check against searches on webmaker.org
        assert.sameMembers( stringifiedTags, [
          '{"name":"privacy","frequency":5}',
          '{"name":"privacy","frequency":5}',
          '{"name":"security","frequency":3}',
          '{"name":"remixing","frequency":2}',
          '{"name":"criticalthought","frequency":1}',
          '{"name":"teach","frequency":5}',
          '{"name":"icebreaker","frequency":1}',
          '{"name":"lightbeam","frequency":1}'
        ]);

        done();
      });
    });
  });
});
