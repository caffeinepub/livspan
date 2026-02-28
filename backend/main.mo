import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Use migration to add new fields

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

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userFastingSchedule = Map.empty<Principal, FastingSchedule>();
  let nutritionalDayEntries = Map.empty<Principal, Map.Map<Time.Time, NutritionDay>>();
  let sleepDayEntries = Map.empty<Principal, Map.Map<Time.Time, SleepDay>>();
  // Per-user movement and stress entries: keyed by Principal -> (date -> entry)
  let movementDayEntries = Map.empty<Principal, Map.Map<Text, MovementDay>>();
  let stressDayEntries = Map.empty<Principal, Map.Map<Text, StressDay>>();

  // Store the owner's ICP address
  var ownerIcpAddress : Text = "";
  let userActivationStatus = Map.empty<Principal, Bool>();

  /// Returns the owner ICP address. Public — no auth needed so users can see where to send payment.
  public query func getIcpAddress() : async Text {
    ownerIcpAddress;
  };

  /// Admin-only: set the owner's ICP payment address.
  public shared ({ caller }) func setIcpAddress(address : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can set the ICP address");
    };
    ownerIcpAddress := address;
  };

  /// Admin-only: confirms a user's activation status after verifying their 1 ICP payment.
  public shared ({ caller }) func confirmActivation(user : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can confirm activation");
    };
    userActivationStatus.add(user, true);
  };

  /// Checks if a given user is activated.
  /// Admins can check any user; a user can check their own status; guests/others are denied.
  public query ({ caller }) func isUserActivated(user : Principal) : async Bool {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only check your own activation status");
    };
    switch (userActivationStatus.get(user)) {
      case (null) { false };
      case (?isActive) { isActive };
    };
  };

  // Profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerFastingSchedule() : async ?FastingSchedule {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access fasting schedules");
    };
    userFastingSchedule.get(caller);
  };

  public shared ({ caller }) func saveCallerFastingSchedule(fastingSchedule : FastingSchedule) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save fasting schedules");
    };
    userFastingSchedule.add(caller, fastingSchedule);
  };

  // NutritionDay Entry Handling
  public shared ({ caller }) func saveNutritionDayEntry(dayTimestamp : Time.Time, entry : NutritionDay) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can store nutrition data");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view nutrition data");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can make modifications");
    };

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

  // SleepDay Entry Handling
  public shared ({ caller }) func saveSleepDayEntry(dayTimestamp : Time.Time, entry : SleepDay) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can store sleep data");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sleep data");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can make modifications");
    };

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

  // MovementDay Handling — per-user storage keyed by (caller, date)
  public shared ({ caller }) func saveMovementDay(movementDay : MovementDay) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save movement days");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve movement days");
    };

    switch (movementDayEntries.get(caller)) {
      case (null) { null };
      case (?entries) {
        entries.get(date);
      };
    };
  };

  // StressDay Handling — per-user storage keyed by (caller, date)
  public shared ({ caller }) func saveStressDay(stressDay : StressDay) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save stress days");
    };

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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve stress days");
    };

    switch (stressDayEntries.get(caller)) {
      case (null) { null };
      case (?entries) {
        entries.get(date);
      };
    };
  };
};
