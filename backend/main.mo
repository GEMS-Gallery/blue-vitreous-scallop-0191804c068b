import Float "mo:base/Float";
import Text "mo:base/Text";
import Error "mo:base/Error";

actor Calculator {
  public func calculate(operation: Text, num1: Float, num2: Float) : async Float {
    switch (operation) {
      case ("+") { return num1 + num2; };
      case ("-") { return num1 - num2; };
      case ("*") { return num1 * num2; };
      case ("/") {
        if (num2 == 0) {
          throw Error.reject("Division by zero");
        };
        return num1 / num2;
      };
      case (_) {
        throw Error.reject("Invalid operation");
      };
    };
  };
}