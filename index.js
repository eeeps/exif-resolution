#! /usr/local/bin/node

const { execSync } = require( 'child_process' );

const eg = `
e.g.:
node getResolution.js path/to/img.jpg 200x100
`;

const myArgs = process.argv.slice( 2 ),
      pathToFile = myArgs[ 0 ];

if ( !pathToFile ) {
	throw "You must supply a file (and a resolution)." + eg;
}

// get the actual pixel dimensions of the image file
const original = {};
[ original.w, original.h ] = 
	execSync( `exiftool -s -s -s -ImageSize ${ pathToFile }` )
		.toString()
		.replace( '\n', '' )
		.split( 'x' )
		.map( str => parseInt( str ) );

const resolution = myArgs[ 1 ];

if ( !resolution ) {
	throw "You must supply a resolution.\n\ne.g." + eg;
}

const regexedResolution = resolution.match( /^([\d.]+)x(\d+)?$/ );

if ( !regexedResolution ) {
	throw "Resolution must either be in the format [WIDTH]x[HEIGHT] or [DENSITY]x";
}

// derive the desired EXIF-modified dimensions from input arguments
const modified = {};
if ( regexedResolution[ 2 ] ) { // we got [WIDTH]x[HEIGHT]

	modified.w = parseInt( regexedResolution[ 1 ] );
	modified.h = parseInt( regexedResolution[ 2 ] );

} else { // we got [DENSITY]x

	const dpr = parseFloat( regexedResolution[ 1 ] );
	modified.w = Math.round( original.w / dpr );
	modified.h = Math.round( original.h / dpr );

}

// calculate the resolution arguments
// which are rationals, as strings...
const xResolution = reduce( 72 * original.w, modified.w ).join( '/' ),
      yResolution = reduce( 72 * original.h, modified.h ).join( '/' );

// the business

const command = `exiftool \\
  -ResolutionUnit=inches \\
  -XResolution=${ xResolution } \\
  -YResolution=${ yResolution } \\
  -ExifImageWidth=${ modified.w } \\
  -ExifImageHeight=${ modified.h } \\
  ${ pathToFile }`;
console.log( command );
console.log( execSync( command ).toString() );


// utilities

// Reduce a fraction by finding the Greatest Common Divisor and dividing by it.
// https://stackoverflow.com/questions/4652468/is-there-a-javascript-function-that-reduces-a-fraction
function reduce(numerator,denominator){
  var gcd = function gcd(a,b){
    return b ? gcd(b, a%b) : a;
  };
  gcd = gcd(numerator,denominator);
  return [numerator/gcd, denominator/gcd];
}

