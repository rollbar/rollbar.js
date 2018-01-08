{ pkgs ? import <nixpkgs> {}, nodejs-6_x ? pkgs.nodejs-6_x, stdenv ? pkgs.stdenv }:

let
node = nodejs-6_x;

in

stdenv.mkDerivation rec {
  name = "rollbar.js-env";

  buildInputs = [ node ];
}
