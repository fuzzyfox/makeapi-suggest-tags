/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this file,
* You can obtain one at http://mozilla.org/MPL/2.0/. */

(function root() {
  'use strict';

  // browser context getting dependency
  if ( typeof window !== 'undefined' && !window.Make ) {
    var script = document.createElement('script');
    script.src = '//webmaker.org/bower/makeapi-client/src/make-api.js';
    script.onload = function(){
      root();
    };

    window.suggestTags = function(){};
    document.head.appendChild( script );

    return;
  }

  var foundTags = [],
    linksToCheck = 0,
    running = false,
    makeapi;

  /**
   * Gets any metadata about a link from the MakeAPI
   * and adds any tags to the `foundTags` array w/ a
   * frequency of times its appeared
   *
   * @param  {HTMLAreaElement|HTMLAnchorElement}   link A HTMLElement w/ a href property that has a value
   * @param  {Function} done Callback to run once async call is complete
   */
  function getLinkTags( link, done ) {
    makeapi.url(link.href).then(function(err, makes){
      if ( err ) {
        console.log( err );
        if ( done ) {
          done();
        }
        return;
      }

      makes.filter( function( make ) {
        make.rawTags.filter( function( tag ) {
          // flag to indicate if tag already known
          var foundFlag = false;

          // check if current tag is known
          foundTags.filter( function( tagObj ) {
            if ( tagObj.name === tag ) {
              foundFlag = true;
              tagObj.frequency++;
            }
          });

          // if tag was not found then add it
          if ( foundFlag === false ) {
            foundTags.push({
              name: tag,
              frequency: 1
            });
          }
        });
      });

      if ( done ) {
        done();
      }
    });
  }

  /**
   * Runs a callback passing in an Array of suggested tags.
   *
   * Returned array in the format:
   *
   * [{
   *     name: String,
   *     frequency: Integer
   * }]
   *
   * @param {HTMLCollection}   links Collection of all AREA elements and anchor (A) elements in a document with a value for the href attribute.
   * @param {Function} done  Callback to run once all async calls are complete and suggested tags known
   */
  function suggestTags( links, done ){
    if ( !running ) {
      Array.prototype.filter.call( links, function( link ) {
        linksToCheck++;
        getLinkTags(link, function(){
          if ( --linksToCheck === 0 ) {
            done( foundTags );

            // reset some variables after complete
            foundTags = [];
            linksToCheck = 0;
            running = false;
          }
        });
      });

      if ( !links.length ) {
        done( [] );
      }
    }
    // dirty hack till refactor
    // mimics desired behaviour better however
    else {
      setTimeout( function() {
        suggestTags( links, done );
      }, 10);
    }
  }

  // AMD context
  if ( typeof define !== 'undefined' ) {
    /* global define */

    // somehow need to get/require makeapi here too...
    define( ['makeapi-client'], function( makeapiClient ) {
      makeapi = makeapiClient({
        apiURL: 'https://makeapi.webmaker.org'
      });
      return suggestTags;
    });
  }

  // Node.js context
  else if ( typeof module !== 'undefined' && module.exports ) {
    makeapi = require( 'makeapi-client' ) ({
      apiURL: 'https://makeapi.webmaker.org'
    });
    module.exports = suggestTags;
  }

  // browser context
  else if ( typeof window !== 'undefined' && window.Make ) {
    makeapi = new window.Make({
      apiURL: 'https://makeapi.webmaker.org'
    });
    window.suggestTags = suggestTags;
  }
}());
