$(document).ready(function(){
    // Notes: 
    // "arithmetic expression" is used to refer specifically to the current two operands and operator during use.
    // "calculation" refers to all input and results from the initial operand up until "AC" is clicked or the page is refreshed.
    
    // initializing "values":

    // this is used to hold the string of numbers entered by a user that will be used as an operand (usually the second) of an arimetic expression
    let currentNum = null;

    // this holds the first operand of the current arithmetic expression.
    // the inital operand is assigned to result once an operator is clicked.
    // After the initial arithmetic expression, result holds the output of the expression
    let result = null;

    // holds the operator to be used in the current arithmetic expression.
    // it was prefixed with "last" because it is not used until a new operator (or the equal button) is pressed.
    // when the following operator is pressed, the program evaluates the expression, stores 
    // the result in the result variable, and then 
    // assigns the operator that was just pressed to lastOperator
    let lastOperator = null;


    // After the user presses the equal button, they may want to repeat that same operation (e.g. 6-3 = 3, repeat the "- 3" again so that final calculation is zero.). To do this, they can press the equal button again.
    // This program, however, sets currentNum and lastOperator to null after the equal button is pressed to set the stage for a new calculation.
    // These variables specifically account for the last operand and operator entered by a user so it can be used if the user wants to duplicate the last operation after pressing equal by pressing equal again
    let currentNumLast = null;
    let lastOperatorAfterEqual = null;
    
    // this variable helps determine certain behaviors after the equal button is pressed
    // such as repeating the last operation by pressing equal again and also how to react to input if A/C is not used to clear the current calculation.
    let afterEqual = false;

    // this variable is used to determine how many times "C" has been pressed
    // the first press clears "currentNum" so that it can be re-entered, but does not clear lastOperator or result.
    // the second press clears all variables, to start a completely new calculation.
    let c_counter = 0;

    // This function builds each operand a user enters.
    // Everytime a number is pressed, it begins to build a string of integers and possibly a decimal.
    // currentNum is cleared out (set to null) throughout the program after it is used.
    $(".number").click(function(){
        c_counter = 0; // resets the C/AC counter (as if it's never been clicked)

        $("#C").text("C")
        if (currentNum == null) // prevents "null" from being the start of the string
        {
            currentNum = "";
        }
        currentNum += ($(this).text()); // number-string builder
        $("#answertext").text(currentNum); // prints to the calculator after each press

        //REMOVE (TEST OUTPUT)
        testOutput();

    });
    
    // This function programs the behavior of the operator buttons.
    // In most instances, the currentNumFunction is called first.
    // The main job of currentNumFunction is to turn currentNum from a string into a number.
    // It also accounts for the very first operand entry of a calculation.
    //      - For the inital operand entry, currentNumFunction assigns currentNum to the result variable.
    // currentNum is then cleared (set to null) so that the next operand can be entered.
    // 
    // lastOperator is passed to the doMath function to perform the arithmetic for result, the last operator pressed, and currentNum.
    // 
    // after the arithmetic is performed, currentNum is set back to null
    // so that the next number can be entered if the user choses to do so.
    // the currentOperator is then assigned to lastOperator
    $(".operator").click(function(){

        // Special note: 
        // The currentNumFunction function is intended only for when the user has entered an operand.
        // This conditional structure accounts for the differt instances when there has been no operand entered by the user.
        // Each condition is as follows:
        // This first condition accounts for the instance when the user is starting a new calculation but does not enter an initial operand, and instead first presses an operator and then the equal button. It will therefore also skip calling the currentNumFunction since there is no currentNum entered.
        if (lastOperator == null && result == null && currentNum == null) {
            result = 0;
        }
        // In the instance when a user presses equal to end the calculation, but then decides to continue on in that same calculation (by pressing another operator), currentNumFunction should _not_ be called. currentNum is set to null when the equal button is pressed. If it were called, it would set result = currentNum (i.e. result = 0) and the program would incorrectly use 0 as the first operand of the next arithmetic expression instead of the result the user had just calculated.
        // skipping currentNumFunction can be accomplished by accounting for currentNum being set to null every time the equal button is pressed.
        else if (currentNum != null) {
            currentNumFunction(); // explained above
        }

        // if this is the very first operator pressed of a calculation (e.g. "3 +"" of "(3 + 4) + 6")
        // there is no expression to evaluate
        if (lastOperator == null) {
            lastOperator = $(this).text();
        }
        
        // Satisfies two instances: 
        // 1. if the user presses an operator and then immediately presses another operator (e.g. they made a mistake or would rather add than subtract, etc.)
        // 2. If at the beginning of a calculation a user does not enter an operand first, but rather enters a operator and then an operand. Then, this function will not call the doMath.
        else if (lastOperator != null & currentNum == null){
            lastOperator = $(this).text();
        }
        // used for every operator entry after the intitial operator of a calculation has been entered
        else {
            result = doMath();
            $("#answertext").text(result); // prints result to the caculator display
            lastOperator = $(this).text(); 
        }

        currentNum = null;
        afterEqual = false; // after the equal button is pressed, after equal is set to true. If the user then presses an operator to continue the calculation, setting afterEqual to false signals to the program to keep on going with the calculation.

        // REMOVE: TESTING OUTPUT
        testOutput()
    });

    // This function handles the behavior of the program when the equal button is pressed. 
    // the if/else structure accounts for if the user presses the enter button again to repeat the last operation.

    // General operation of this function: 
    // 1. the current value currentNum of currentNum is assessed in the first step. 
    // 2. performs the final arithmetic expression for the calculation
    // 3. outputs the result to the calculator display
    // 4. assigns the value of lastOperator to lastOperatorAfterEqual
    // 3. resets all values except for result, lastOperatorAfterEqual, and currentNumLast
    //    - result is not reset in case the user decides to continue on in the current calculation
    // 4. sets afterEqual to true to determine how the program behaves if the user inputs another number or operator.

    $(".operator_equal").click(function(){
        
        // this accounts for the end of the normal calculation
        if (afterEqual == false) {
            // this if/else structure accounts for the instance when the user is starting a new calculation but does not enter an initial operand, and instead first presses an operator and then the equal button. 
            if (result != null) {
                currentNumFunction() // converts currentNum into the number type
            }
            else {
                result = 0;
            }
            result = doMath(); // performs the last arithmetic expression
            $("#answertext").text(result) // prints the result to the calculator display
            lastOperatorAfterEqual = lastOperator;
            currentNum = null;
            lastOperator = null;
            afterEqual = true;
        }
        // this accounts for if the user immediately presses enter again to repeat the last operation
        else if (afterEqual == true) {

            // because currentNum and lastOperator are set to null at the end of a calculation, if the user would like to repeat the last operation, the previous currentNum and lastOperator values need to be assigned to currentNum and lastOperator again.
            currentNum = currentNumLast; 
            lastOperator = lastOperatorAfterEqual; 

            // after currentNum and lastOperator have been re-assigned to their old values, the last operation is ready to be repeated.
            result = doMath(); 

            $("#answertext").text(result);
            currentNum = null;
            lastOperator = null;
            afterEqual = true;
        }

        // REMOVE (Testing output)
        testOutput()

    });

    // This function is a clearing function.
    // The first click sets currentNum to null, esentially clearing whatever the user has entered for the current operand.
    // The first click also sets the button text to "AC"
    // The second click clears all values (set to null or 0 depending on the variable), as if the page were refreshed
    $("#C").click(function(){
        
        // used to determine to use C or AC functionality
        // this is reset to zero after the user starts entering a new operand
        c_counter++; 

        //REMOVE (TESTING OUTPUT)
        $(".console").text("c_counter is " + c_counter)

        if (c_counter == 1) {
            currentNum = null; // clears whatever current number the user is entering
            $("#answertext").text(0) // replaces the value displayed in the calculator to "0"
            $("#C").text("AC") // sets the button text to "AC"
        }

        // this is the complete reset of all variables for the program.
        else if (c_counter > 1) {
            currentNum = null;
            result = null;
            lastOperator = null;
            afterEqual = false;
        }

        // REMOVE (Testing output)
        testOutput()
    });

    // The next two functions transform the currently displayed number to either a negative number or to a percentage fraction. 
    // At all times the display is either showing "0", the currentNum variable (during number entry), or the result variable (after an arithmetic operation has been performed)
    // No action is needed if "0" is being displayed.
    // The program transforms the displayed number differntly depending on whether it's current currentNum or result (via the if/else structure). 
    // 
    // The logic to determine which number the display is showing is:
    // currentNum is set to null after any operator (including equal) is pressed, so if currentNum is not null, then that means the user is currently entering a number.
    // if it is null, then the user has finished entering the number, pressed and operator and now the result is being shown in the display.
    // Both functions work almost identically save for the individual transformation.
    $("#plus_minus").click(function(){
        
        // accounts for when the user is entering a number but has not pressed an operator or equal.
        if (currentNum != null) {
            negNumber = "-" + currentNum
            currentNum = negNumber
            $("#answertext").text(currentNum)
        }
        // after any operator is pressed, currentNum is set to null, therefor if currentNum is set to null it can be assumed that the number being displayed is the result variable
        else {
            result = result * (-1);
            $("#answertext").text(result)
        }

        // REMOVE (Testing output)
        testOutput()
    });
    $("#percentage").click(function(){

        if (currentNum != null && afterEqual == false) {
            
            currentNum = Number(currentNum) / 100
            $("#answertext").text(currentNum)
            $(".console").text("I'm in percentage if")
        }
        else {
            result = result / 100;
            $("#answertext").text(result)
            $(".console").text("I'm in percentage else")
        }

        // REMOVE (Testing output)
        testOutput()
    });

    // This function converts currentNum from the string type to Number type.
    // It also will move the value of currentNum to the result variable if it is the first operand of a calculation.
    // It also backs-up currentNum to currentNumLast incase the user decides to repeat the last operation after pressing equal by pressing equal again.
    // it is inteded only be called when there is an operand that the user has entered and is ready to be used in an arithmetic expression.

    function currentNumFunction(){
        // This first condition accounts for two differnt instances:
        // 1. equal has been pressed (afterEqual == true) -and- user directly types another number to start a new calculation
        // i.e. does not press C/AC to start a new calculation
        //
        // -OR-
        // remember: every arithmetic expression in this program uses the format: (new) result == (old) result +-*/ currentNum
        // If the user is starting a new calculation, the first entry must be moved to the result variable so it can be used in the arithmetic expression. This is what second part of the first condition accomplishes.
        // 
        if (afterEqual == true || result == null)
        {
            currentNum = Number(currentNum); 
            currentNumLast = currentNum;
            result = currentNum;
            $("#answertext").text(result);
            afterEqual = false;
        }
        // This condition handles all other other operands entered during a calculation.
        else if (result != null)
        {
            currentNum = Number(currentNum);
            currentNumLast = currentNum;
            $("#answertext").text(result);
        }

        // REMOVE (TESTING OUTPUT)
        testOutput()
    }
    
    // because of the way a user enters the input, the calculation 
    // cannot be performed until after the second operand (i.e. currentNum)
    // has been entered and then, either the next operator is pressed
    // -or- the equal button is pressed.
    // 
    // if it is the very first time an operator is pressed, that operator is stored as lastOperator without peforming any arithmetic operation. It is then used in the calculation after the following operator (or the equal button) has been pressed and before that new operator is assigned to lastOperator.
    function doMath(){ // because math
        switch (lastOperator){
                case "+": result = result + Number(currentNum); break;
                case "-": result = result - Number(currentNum); break;
                case "*": result = result * Number(currentNum); break;
                case "/": result = result / Number(currentNum); break;
            };
            return result;
    }

    // These test outputs were extremely beneificial in seeing where the program was breaking down during development.
    // The .console div was mainly used to determine if the program was going into a particular function or conditional statement. By plaing a command such as $(".console").text("I'm in this part of the conditional/function"), squashing bugs and logic errors was much easier.
    function testOutput(){
        $(".current_number").text(currentNum);
        $(".result").text(result)
        $(".current_number").text(currentNum)
        $(".last_operator").text(lastOperator)
        $(".afterEqual").text(afterEqual)
    }
});