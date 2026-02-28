import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Text "mo:core/Text";

module {
  type Gender = {
    #male;
    #female;
    #diverse;
  };

  type UserProfile = {
    name : Text;
    birthYear : Nat;
    heightCm : Nat;
    gender : Gender;
  };

  type FastingSchedule = {
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
    proteinGrams : ?Nat;
    vegetableGrams : ?Nat;
    bodyWeightKg : ?Float;
    waterLiters : Float;
  };

  type SleepDay = {
    durationHours : Float;
    qualityScore : Int;
  };

  type MovementDay = {
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

  type StressDay = {
    date : Text;
    systolic : Nat;
    diastolic : Nat;
    pulse : Nat;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    userFastingSchedule : Map.Map<Principal, FastingSchedule>;
    nutritionalDayEntries : Map.Map<Principal, Map.Map<Time.Time, NutritionDay>>;
    sleepDayEntries : Map.Map<Principal, Map.Map<Time.Time, SleepDay>>;
    movementDayEntries : Map.Map<Principal, Map.Map<Text, MovementDay>>;
    stressDayEntries : Map.Map<Principal, Map.Map<Text, StressDay>>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    userFastingSchedule : Map.Map<Principal, FastingSchedule>;
    nutritionalDayEntries : Map.Map<Principal, Map.Map<Time.Time, NutritionDay>>;
    sleepDayEntries : Map.Map<Principal, Map.Map<Time.Time, SleepDay>>;
    movementDayEntries : Map.Map<Principal, Map.Map<Text, MovementDay>>;
    stressDayEntries : Map.Map<Principal, Map.Map<Text, StressDay>>;
    ownerIcpAddress : Text;
    userActivationStatus : Map.Map<Principal, Bool>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      ownerIcpAddress = "";
      userActivationStatus = Map.empty<Principal, Bool>();
    };
  };
};
