module {
  public type OldActor = {
    checkAllCredentials : Bool;
    icpReceiveAddress : Text;
    ownerIcpAddress : Text;
  };

  public type NewActor = {
    defaultIcpReceiveAddress : Text;
  };

  public func run(_old : OldActor) : NewActor {
    { defaultIcpReceiveAddress = "5677f79bb400519598c0e75be936cafc391a930d21268d6fcf1eee3cb5c9d582" };
  };
};
