import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Gender = {
    #male;
    #female;
    #diverse;
  };

  public type UserProfile = {
    name : Text;
    birthYear : Nat;
    heightCm : Nat;
    gender : Gender;
  };

  public type FastingSchedule = {
    startHour : Nat8;
    endHour : Nat8;
  };

  public type NutritionDay = {
    caloriesConsumed : Nat;
    caloriesBurned : Nat;
    protein : Float;
    fat : Float;
    carbs : Float;
    waterMl : Nat;
    proteinGrams : ?Nat;
    vegetableGrams : ?Nat;
    bodyWeightKg : ?Float;
    waterLiters : Float;
  };

  public type SleepDay = {
    durationHours : Float;
    qualityScore : Int;
  };

  public type MovementDay = {
    date : Text;
    activeMinutes : Nat;
    activityType : {
      #walk;
      #run;
      #bike;
      #gym;
    };
    intensity : {
      #light;
      #medium;
      #intense;
    };
  };

  public type StressDay = {
    date : Text;
    systolic : Nat;
    diastolic : Nat;
    pulse : Nat;
  };

  public type DiaryEntry = {
    id : Text;
    timestamp : Time.Time;
    title : Text;
    content : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userFastingSchedule = Map.empty<Principal, FastingSchedule>();
  let nutritionalDayEntries = Map.empty<Principal, Map.Map<Time.Time, NutritionDay>>();
  let sleepDayEntries = Map.empty<Principal, Map.Map<Time.Time, SleepDay>>();
  let movementDayEntries = Map.empty<Principal, Map.Map<Text, MovementDay>>();
  let stressDayEntries = Map.empty<Principal, Map.Map<Text, StressDay>>();

  var defaultIcpReceiveAddress = "5677f79bb400519598c0e75be936cafc391a930d21268d6fcf1eee3cb5c9d582";
  let userActivationStatus = Map.empty<Principal, Bool>();

  let diaryEntries = Map.empty<Principal, Map.Map<Text, DiaryEntry>>();

  public query ({ caller }) func getUserPaymentAddress() : async Principal {
    checkPrivilegeUser(caller);
    caller;
  };

  public shared ({ caller }) func verifyAndActivate() : async Bool {
    checkPrivilegeUser(caller);
    userActivationStatus.add(caller, true);
    true;
  };

  public query ({ caller }) func isUserActivated(user : Principal) : async Bool {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only check your own activation status");
    };
    switch (userActivationStatus.get(user)) {
      case (null) { false };
      case (?isActive) { isActive };
    };
  };

  public shared ({ caller }) func confirmActivation(user : Principal) : async () {
    checkPrivilegeAdmin(caller);
    userActivationStatus.add(user, true);
  };

  public query func getIcpAddress() : async Text {
    defaultIcpReceiveAddress;
  };

  public shared ({ caller }) func setIcpAddress(address : Text) : async () {
    checkPrivilegeAdmin(caller);
    defaultIcpReceiveAddress := address;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    checkPrivilegeUser(caller);
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    checkPrivilegeUser(caller);
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerFastingSchedule() : async ?FastingSchedule {
    checkPrivilegeUser(caller);
    userFastingSchedule.get(caller);
  };

  public shared ({ caller }) func saveCallerFastingSchedule(fastingSchedule : FastingSchedule) : async () {
    checkPrivilegeUser(caller);
    userFastingSchedule.add(caller, fastingSchedule);
  };

  public shared ({ caller }) func saveNutritionDayEntry(dayTimestamp : Time.Time, entry : NutritionDay) : async () {
    checkPrivilegeUser(caller);
    let userEntries = switch (nutritionalDayEntries.get(caller)) {
      case (null) {
        let newMap = Map.empty<Time.Time, NutritionDay>();
        nutritionalDayEntries.add(caller, newMap);
        newMap;
      };
      case (?entries) { entries };
    };
    userEntries.add(dayTimestamp, entry);
  };

  public query ({ caller }) func getTodayNutritionEntry() : async ?NutritionDay {
    checkPrivilegeUser(caller);
    let today = Time.now() / 86_400_000_000_000;
    switch (nutritionalDayEntries.get(caller)) {
      case (null) { null };
      case (?entries) {
        entries.get(today);
      };
    };
  };

  public query ({ caller }) func getNutritionEntry(user : Principal, dayTimestamp : Time.Time) : async ?NutritionDay {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own nutrition data");
    };
    switch (nutritionalDayEntries.get(user)) {
      case (null) { null };
      case (?entries) {
        entries.get(dayTimestamp);
      };
    };
  };

  public shared ({ caller }) func clearNutritionDay(dayTimestamp : Time.Time) : async () {
    checkPrivilegeUser(caller);
    switch (nutritionalDayEntries.get(caller)) {
      case (null) { Runtime.trap("No entries for caller") };
      case (?entries) {
        entries.remove(dayTimestamp);
        if (entries.isEmpty()) {
          nutritionalDayEntries.remove(caller);
        };
      };
    };
  };

  public shared ({ caller }) func saveSleepDayEntry(dayTimestamp : Time.Time, entry : SleepDay) : async () {
    checkPrivilegeUser(caller);
    let userEntries = switch (sleepDayEntries.get(caller)) {
      case (null) {
        let newMap = Map.empty<Time.Time, SleepDay>();
        sleepDayEntries.add(caller, newMap);
        newMap;
      };
      case (?entries) { entries };
    };
    userEntries.add(dayTimestamp, entry);
  };

  public query ({ caller }) func getTodaySleepEntry() : async ?SleepDay {
    checkPrivilegeUser(caller);
    let today = Time.now() / 86_400_000_000_000;
    switch (sleepDayEntries.get(caller)) {
      case (null) { null };
      case (?entries) {
        entries.get(today);
      };
    };
  };

  public query ({ caller }) func getSleepEntry(user : Principal, dayTimestamp : Time.Time) : async ?SleepDay {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own sleep data");
    };
    switch (sleepDayEntries.get(user)) {
      case (null) { null };
      case (?entries) {
        entries.get(dayTimestamp);
      };
    };
  };

  public shared ({ caller }) func clearSleepDay(dayTimestamp : Time.Time) : async () {
    checkPrivilegeUser(caller);
    switch (sleepDayEntries.get(caller)) {
      case (null) { Runtime.trap("No entries for caller") };
      case (?entries) {
        entries.remove(dayTimestamp);
        if (entries.isEmpty()) {
          sleepDayEntries.remove(caller);
        };
      };
    };
  };

  public shared ({ caller }) func saveMovementDay(movementDay : MovementDay) : async () {
    checkPrivilegeUser(caller);
    let userEntries = switch (movementDayEntries.get(caller)) {
      case (null) {
        let newMap = Map.empty<Text, MovementDay>();
        movementDayEntries.add(caller, newMap);
        newMap;
      };
      case (?entries) { entries };
    };
    userEntries.add(movementDay.date, movementDay);
  };

  public query ({ caller }) func getMovementDay(date : Text) : async ?MovementDay {
    checkPrivilegeUser(caller);
    switch (movementDayEntries.get(caller)) {
      case (null) { null };
      case (?entries) {
        entries.get(date);
      };
    };
  };

  public shared ({ caller }) func saveStressDay(stressDay : StressDay) : async () {
    checkPrivilegeUser(caller);
    let userEntries = switch (stressDayEntries.get(caller)) {
      case (null) {
        let newMap = Map.empty<Text, StressDay>();
        stressDayEntries.add(caller, newMap);
        newMap;
      };
      case (?entries) { entries };
    };
    userEntries.add(stressDay.date, stressDay);
  };

  public query ({ caller }) func getStressDay(date : Text) : async ?StressDay {
    checkPrivilegeUser(caller);
    switch (stressDayEntries.get(caller)) {
      case (null) { null };
      case (?entries) {
        entries.get(date);
      };
    };
  };

  // Diary Entry Functions

  public shared ({ caller }) func addDiaryEntry(title : Text, content : Text) : async Text {
    checkPrivilegeUser(caller);

    let id = Time.now().toText();
    let entry : DiaryEntry = {
      id;
      timestamp = Time.now();
      title;
      content;
    };

    let userEntries = switch (diaryEntries.get(caller)) {
      case (null) {
        let newMap = Map.empty<Text, DiaryEntry>();
        diaryEntries.add(caller, newMap);
        newMap;
      };
      case (?entries) { entries };
    };

    userEntries.add(id, entry);
    id;
  };

  public shared ({ caller }) func updateDiaryEntry(id : Text, title : Text, content : Text) : async Bool {
    checkPrivilegeUser(caller);

    switch (diaryEntries.get(caller)) {
      case (null) { return false };
      case (?entries) {
        switch (entries.get(id)) {
          case (null) { return false };
          case (?_oldEntry) {
            let updatedEntry : DiaryEntry = {
              id;
              title;
              content;
              timestamp = Time.now();
            };
            entries.add(id, updatedEntry);
            return true;
          };
        };
      };
    };
  };

  public shared ({ caller }) func deleteDiaryEntry(id : Text) : async Bool {
    checkPrivilegeUser(caller);

    switch (diaryEntries.get(caller)) {
      case (null) { return false };
      case (?entries) {
        let existed = entries.containsKey(id);
        entries.remove(id);
        existed;
      };
    };
  };

  public query ({ caller }) func getDiaryEntries() : async [DiaryEntry] {
    checkPrivilegeUser(caller);

    switch (diaryEntries.get(caller)) {
      case (null) { [] };
      case (?entries) {
        entries.values().toArray();
      };
    };
  };

  func checkPrivilegeAdmin(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  func checkPrivilegeUser(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };
};
