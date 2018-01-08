let pkgs  = import <nixpkgs> {};
    pkgs' = import pkgs.path { overlays = [ (import ../vagrant-dev-vm/nix) ]; };
in pkgs'.callPackage ({
  nodejs-6_x,
  stdenv,
  writeScriptBin,
  bash,
  devEnvs,
  moxLib,
  darwin,
}:

let
node = nodejs-6_x;
config = moxLib.projectConfig ./. {
  env = {
  };
};

in

stdenv.mkDerivation rec {
  name = "rollbar.js-env";

  buildInputs = [
    node darwin.apple_sdk.frameworks.CoreServices
    moxUpdate
  ];

  projectDir = toString ./.;
  hardeningDisable = [ "all" ];

  moxUpdate = writeScriptBin "mox-update" ''
    #!${bash}/bin/bash
    set -x

    cd ${projectDir}
    unset NIX_ENFORCE_PURITY

    git submodule update --init

    npm install
  '';

  provision = devEnvs.ensureProvisioned ''
    mox-update
  '';

  shellHook = ''
    cd ${projectDir}

    ${provision}

    ${devEnvs.withNodeBin}
  '';
} // config.env

) {}
