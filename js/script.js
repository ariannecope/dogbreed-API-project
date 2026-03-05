//The code will follow this flow: // form submitted → get form data → API call → filter results → display results
let result = document.querySelector(".result");
let form = document.querySelector(".dog-form");

//form submitted and get the user's data
/*// Handles form submission:
// 1. Prevents page reload
// 2. Collects form input
// 3. Converts form data into a plain object
// 4. Sends it to apiCall()*/
function handleSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  const dataObject = Object.fromEntries(data.entries());
  form.reset();
  apiCall(dataObject); //<-- send form input to API/pass the user's search input
}
//this is the event listener function that calls the handleSubmit function.
// Listen for the form's submit event.
// Because the button is inside the form, clicking it triggers submit automatically.
// No need to select the button separately.
form.addEventListener("submit", handleSubmit);

// Makes a request to The Dog API using fetch.
// Converts the response from JSON into a JavaScript array of dog objects.
// Then passes that data into filtering logic.
function apiCall(dataObject) {
  //// receives input from form. This lets your form data flow into the API function--dataObject is passed into apiCall().
  fetch("https://api.thedogapi.com/v1/breeds", {
    headers: {
      "x-api-key":
        "live_sHFpGXX9wAeEFG3azE9yNVH7XFc8pRzVLkPCwKXreuIMFt5Fn7h0oxe9xvinaOSk"
    }
  })
    .then((response) => response.json())
    .then(
      (
        data //// <-- API response
      ) => {
        // console.log(data.length); This helped me check the length of the api call--169 dog breeds

        // Create an empty array to hold only the matching dogs
        let filteredDogs = [];

        // Loop through all dogs
        for (let i = 0; i < data.length; i++) {
          let dog = data[i];
          let matchesBreed = false;
          let matchesTemp = false;

          // Check if breed name matches (ignore case)
          if (
            dataObject.breedName &&
            dog.name.toLowerCase().includes(dataObject.breedName.toLowerCase())
          ) {
            matchesBreed = true;
          }

          // Check if temperament matches (some dogs may not have a temperament property)
          if (
            dataObject.temperament &&
            dog.temperament &&
            dog.temperament
              .toLowerCase()
              .includes(dataObject.temperament.toLowerCase())
          ) {
            matchesTemp = true;
          }

          // Only add the dog if it matches BOTH
          if (matchesBreed && matchesTemp) {
            filteredDogs.push(dog);
          }
        }

        // Now show the filtered results

        /*Why does showData(filteredDogs) work even though filteredDogs was created inside apiCall?Because:filteredDogs is defined inside apiCall, showData(filteredDogs) is also called inside apiCall. So it is still in scope 

filteredDogs (inside apiCall)
        ↓
gets passed as argument
        ↓
data (inside showData)*/
        showData(filteredDogs);
      }
    ) // call the display function here, handing the data straight to showData() as soon as it arrives. data is the real value that comes back from the API-whatever the API sends back in JSON.
    .catch((error) => {
      console.log("Error:", error);
    });
}
//This is my showData function that receives a parameter called data.
//// Receives an array of dog objects and displays them on the page.

function showData(data) {
  result.innerHTML = ""; // This clears out old results.

  //This is a forEach loop that gets the data from the object we created with the previous function. It uses dot notation to get the breed name, temperament, and life span. data → the whole array(169 dogs), Now we introduce another parameter: dog → one item from the array
  // Loop through each dog in the array.
  // For each dog object, add a card to the page using its properties.
  // += means we append new HTML instead of replacing it--take what’s already there and add more to it.
  data.forEach((dog) => {
    result.innerHTML += `
      <div class ="card">
        <img src="${dog.image ? dog.image.url : ""}">
        <h3>${dog.name}</h3>
         <p><strong>Life Span:</strong> ${dog.life_span}</p>
        <p><strong>Temperament:</strong> ${dog.temperament}</p>
      </div>
    `;
  });
}
//In the image template literal, I learned from AI I could add a ternary (if-else) operator: If dog.image does not exist, use an empty string (so the <img> won’t try to load something that doesn’t exist).

/////////////GOING OVER THE DATA FLOW OF THIS ASSIGNMENT//////////////////////////////////
/*handleSubmit(event) -- When the user clicks Search, this function runs.
   ↓
dataObject --We collect the user's answers and store them in an object.
   ↓
apiCall(dataObject) --Now we go ask the Dog API for dog information.
   ↓
fetch() --We request the full list of dog breeds from the internet.
   ↓
data  (array of dogs) --The API gives us a big list of dogs.
   ↓
showData(data) --Now we hand the dog list to the display function.
   ↓
data.forEach((dog)) --Go through the dog list one dog at a time.
   ↓
dog.name --For each dog, pull out the information we want to show.
dog.life_span
dog.temperament
   ↓
result.innerHTML += --Add this dog to the webpage.

Simpler version:
User input
   ↓
dataObject
   ↓
API
   ↓
data
   ↓
dog
   ↓
screen*/