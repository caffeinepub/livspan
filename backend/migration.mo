import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type Gender = { #male; #female; #diverse };

  type OldActor = {
    userProfiles : Map.Map<Principal, { name : Text; birthYear : Nat; heightCm : Nat; gender : Gender }>;
    userFastingSchedule : Map.Map<Principal, { startHour : Nat8; endHour : Nat8 }>;
    nutritionalDayEntries : Map.Map<Principal, Map.Map<Time.Time, { caloriesConsumed : Nat; caloriesBurned : Nat; protein : Float; fat : Float; carbs : Float; waterMl : Nat; proteinGrams : ?Nat; vegetableGrams : ?Nat; bodyWeightKg : ?Float; waterLiters : Float }>>;
    sleepDayEntries : Map.Map<Principal, Map.Map<Time.Time, { durationHours : Float; qualityScore : Int }>>;
    movementDayEntries : Map.Map<Principal, Map.Map<Text, { date : Text; activeMinutes : Nat; activityType : { #walk; #run; #bike; #gym }; intensity : { #light; #medium; #intense } }>>;
    stressDayEntries : Map.Map<Principal, Map.Map<Text, { date : Text; systolic : Nat; diastolic : Nat; pulse : Nat }>>;
    userActivationStatus : Map.Map<Principal, Bool>;
    ownerIcpAddress : Text;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, { name : Text; birthYear : Nat; heightCm : Nat; gender : Gender }>;
    userFastingSchedule : Map.Map<Principal, { startHour : Nat8; endHour : Nat8 }>;
    nutritionalDayEntries : Map.Map<Principal, Map.Map<Time.Time, { caloriesConsumed : Nat; caloriesBurned : Nat; protein : Float; fat : Float; carbs : Float; waterMl : Nat; proteinGrams : ?Nat; vegetableGrams : ?Nat; bodyWeightKg : ?Float; waterLiters : Float }>>;
    sleepDayEntries : Map.Map<Principal, Map.Map<Time.Time, { durationHours : Float; qualityScore : Int }>>;
    movementDayEntries : Map.Map<Principal, Map.Map<Text, { date : Text; activeMinutes : Nat; activityType : { #walk; #run; #bike; #gym }; intensity : { #light; #medium; #intense } }>>;
    stressDayEntries : Map.Map<Principal, Map.Map<Text, { date : Text; systolic : Nat; diastolic : Nat; pulse : Nat }>>;
    userActivationStatus : Map.Map<Principal, Bool>;
    ownerIcpAddress : Text;
    defaultIcpAddress : Text;
    checkAllCredentials : Bool;
  };

  public func run(old : OldActor) : NewActor {
    // Set default values for new fields
    {
      old with
      defaultIcpAddress = "eadaef90a0208bf42e25d15b9d99b767e72ed66ed1fab5b66a7799bfe88283c0";
      checkAllCredentials = true;
    };
  };
};
