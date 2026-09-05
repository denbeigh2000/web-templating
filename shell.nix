{
  pkgs ? (
    import
      (fetchTarball "https://github.com/nixos/nixpkgs/archive/c5c4a43b0e8056328ec4529f735cabdb8f1942bb.tar.gz")
      { }
  ),
}:

pkgs.mkShell {
  packages = with pkgs; [
    nodejs
  ];
}
