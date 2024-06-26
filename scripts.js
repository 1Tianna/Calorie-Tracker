document.addEventListener('DOMContentLoaded', function() {
  const mealForm = document.getElementById('mealForm');
  const mealNameInput = document.getElementById('mealName');
  const caloriesInput = document.getElementById('calories');
  const mealsList = document.getElementById('meals');
  const ingredientsInput = document.getElementById('ingredients');
  const caloriesSum = document.getElementById('caloriesSum');

  let mealsData = [];

  mealForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const mealName = mealNameInput.value.trim();
    const calories = parseInt(caloriesInput.value);
    const ingredients = ingredientsInput.value.trim(); 

    if (mealName && !isNaN(calories)) {
      const meal = { name: mealName, calories: calories };
      mealsData.push(meal);
      displayMeals();
      updateTotalCalories();
      await fetchNutritionalInfo(mealName); // Await API call for nutritional info
      
      mealNameInput.value = '';
      caloriesInput.value = '';
      ingredientsInput.value = '';
    } else {
      alert('Please enter a valid meal name and calories.');
    }
  });

  function displayMeals() {
    mealsList.innerHTML = '';
    mealsData.forEach((meal, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${meal.name} - ${meal.calories} calories`;

      const closeButton = document.createElement('button');
      closeButton.textContent = 'Remove';
      closeButton.addEventListener('click', function() {
        mealsData.splice(index, 1);
        displayMeals();
        updateTotalCalories();
      });

      listItem.appendChild(closeButton);
      mealsList.appendChild(listItem);
    });
  }

  function updateTotalCalories() {
    const totalCalories = mealsData.reduce((sum, meal) => sum + meal.calories, 0);
    caloriesSum.textContent = `Total Calories: ${totalCalories}`;
  }

  async function fetchNutritionalInfo(mealName) {
    try {
      const apiKey = 'your_api_key_here'; // Replace with your actual API key
      const apiUrl = `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(mealName)}`;
      
      const response = await axios.get(apiUrl, {
        headers: {
          'X-Api-Key': apiKey
        }
      });
      
      const { items } = response.data;
      if (items.length > 0) {
        const { calories, sugar_g, fiber_g, ... } = items[0];
      
        
        // Update nutritionalInfo section
        const nutritionalInfoDiv = document.getElementById('nutritionalInfo');
        nutritionalInfoDiv.innerHTML = `
          <h4>Nutritional info for ${mealName}:</h4>
          <p>Calories: ${calories}</p>
          <ul>
            <li>Sugar: ${sugar_g}g</li>
            <li>Fiber: ${fiber_g}g</li>
            <!-- Add other nutritional info items as needed -->
          </ul>
        `;
      } else {
        console.log(`No nutritional info found for ${mealName}`);
      }
    } catch (error) {
      console.error('Error fetching nutritional info:', error);
      alert('Failed to fetch nutritional info. Please try again.');
    }
  }
});
