let calorieCounter = document.getElementById('calorie-counter');
let budgetNumberInput = document.getElementById('budget');
let entryDropdown = document.getElementById('entry-dropdown');
let addEntryButton = document.getElementById('add-entry');
let clearButton = document.getElementById('clear');
let output = document.getElementById('output');
let isError = false;//if user provides an invalid input

//if a user inputs a number with + or -, you will have to remove those charaters
//*** Values from an HTML input field are received as strings in JavaScript.
//To match specific characters in a string, you can use Regular Expressions or "regex" for short.

// Regex in JavaScript is indicated by a pattern wrapped in forward slashes.

function cleanInputString(str)
{
    //character class \s will match any whitespace character.
    //The g flag, which stands for "global", will tell the pattern to continue looking after it has found a match. 
    const regex = /[+-\s]/g;
    //replace all instances of +, -, and a space in str with an empty string.
    return str.replace(regex, "");
}

function isInvalidInput(str)
{
    //if str is not a number(html allows numbers to take exponential values like 1e10), return true
   const regex = /\d+e\d+/i;//i flag makes the regex case insensitive
   //.match() will return an array of match results – containing either the first match, or all matches if the global flag is used.
   return str.match(regex) ;//array is matches or null
}

function addEntry()
{
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
    //The querySelectorAll() method returns a NodeList of all the elements that match the selector. A NodeList is an array-like object, so you can access the elements using bracket notation.
    const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;//This will return a NodeList of all the text inputs in the form. You can then access the length property of the NodeList to get the number of entries. 

    //building dynamic html string
    const HTMLString = `<label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
    <input type = "text" placeholder="Name" id="${entryDropdown.value}-${entryNumber}-name">
    <label for="${entryDropdown.value}-${entryNumber}-calories" >Entry ${entryNumber} Calories</label>
    <input type = "number" min="0" placeholder="Calories" id="${entryDropdown.value}-${entryNumber}-calories">`;
    targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);//first argument is the position where the HTML should be inserted, and the second argument is the HTML string to be inserted.
}

function getCaloriesFromInputs(list)
{
    let calories = 0;
    //A NodeList is a list of elements like an array. It contains the elements that match the query selector. list here will be a nodelist
    for(const item of list)
    {
        const currVal = cleanInputString(item.value);
        const invalidInputMatch = isInvalidInput(currVal);
        if(invalidInputMatch)
        {
            alert(`Invalid Input: ${invalidInputMatch[0]}`);
            isError = true;
            return null;
        }
        calories += Number(currVal);//if not a number, it returns NaN
    
    }
    return calories;
}

function calculateCalories(e){
    e.preventDefault();
    isError = false;
    const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
    const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
    const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
    const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
    const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');
    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);
    if(isError)
    {
        return;
    }
    const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
    const surplusOrDeficit = remainingCalories < 0 ? "Surplus" : "Deficit";

    output.innerHTML = `<span class ="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
    <hr>
    <p>${budgetCalories} Calories Budgeted</p>
    <p>${consumedCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>
    `;
    output.classList.remove('hide');
}

function clearForm()
{
    //array.from accepts an array-like object(nodeList) and returns an array
    const inputContainers = Array.from(document.querySelectorAll('.input-container'));
    for(const container of inputContainers)
    {
        container.innerHTML = "";
    }
    budgetNumberInput.value = "";
    //The difference between innerText and innerHTML is that innerText will not render HTML elements, but will display the tags and content as raw text.
    output.innerText = "";
    output.classList.add('hide');
}

addEntryButton.addEventListener('click', addEntry);
calorieCounter.addEventListener('submit', calculateCalories);
clearButton.addEventListener('click', clearForm);