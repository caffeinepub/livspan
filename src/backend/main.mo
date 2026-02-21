import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


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

  type NutritionDay = {
    caloriesConsumed : Nat;
    caloriesBurned : Nat;
    protein : Float;
    fat : Float;
    carbs : Float;
    waterMl : Nat;
    proteinGrams : ?Nat; // New field for protein in grams
    bodyWeightKg : ?Float; // New field for body weight in kg
    vegetableGrams : ?Nat; // New field for vegetable intake in grams
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userFastingSchedule = Map.empty<Principal, FastingSchedule>();
  let nutritionalDayEntries = Map.empty<Principal, Map.Map<Time.Time, NutritionDay>>();

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
      Runtime.trap("Unauthorized: Only users can access fasting schedule");
    };
    userFastingSchedule.get(caller);
  };

  public shared ({ caller }) func saveCallerFastingSchedule(fastingSchedule : FastingSchedule) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save fastingSchedule");
    };
    userFastingSchedule.add(caller, fastingSchedule);
  };

  // Store or update a daily entry for the caller
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

  // Fetch entries for the current day (caller's own data)
  public query ({ caller }) func getTodayNutritionEntry() : async ?NutritionDay {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view nutrition data");
    };

    let today = Time.now() / 86_400_000_000_000; // Convert to days
    switch (nutritionalDayEntries.get(caller)) {
      case (null) { null };
      case (?entries) {
        entries.get(today);
      };
    };
  };

  // Fetch nutrition entry for a specific user and day (admin or self only)
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

  // Clear a specific day's nutrition entry (user can only clear their own)
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
};
