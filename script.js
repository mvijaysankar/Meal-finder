// -----categories---- 
fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
  .then(res => res.json())
  .then(data => {
    const imgContainers = document.querySelectorAll('.img-container');
    data.categories.forEach((category, index) => {
      if (imgContainers[index]) {
        imgContainers[index].innerHTML = `
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}" style="width:100px; height:100px;">
          `;
      }
    });
  })
  .catch(error => console.error('Error fetching data:', error));

//---- Search---- 
document.getElementById('searchButton').addEventListener('click', function () {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  fetchMeals(searchInput); 
  scrollToMeals();
});

document.getElementById('searchInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    document.getElementById('searchButton').click();
  }
});
//----navbar-----
// ----navbar----- 
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const category = link.getAttribute('data-category');
    fetchMeals(category, true);
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    link.classList.add('active');
    scrollToMeals();
  });
});

// ---- meals ----------
function fetchMeals(query, isCategory = false) {
  const url = isCategory
    ? `https://www.themealdb.com/api/json/v1/1/filter.php?c=${query}`
    : `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
  
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const imgContainer = document.getElementById('img21'); 
      const meals = data.meals;
      imgContainer.innerHTML = '';
      if (meals) {
        meals.forEach(meal => {
          const mealDiv = document.createElement('div');
          mealDiv.className = 'meal-card';
          mealDiv.innerHTML = `
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
              <h6>${meal.strMeal}</h6>
            `;
          mealDiv.addEventListener('click', () => getMealByID(meal.idMeal));
          imgContainer.appendChild(mealDiv);
        });
      } else {
        imgContainer.innerHTML = '<p  style="color:#f04d24;  font-size: 20px;font-weight: bolder;">No meals found..!</p>';
      }

      scrollToMeals(); 
    })
    .catch(error => console.error('Error fetching the meal data:', error));
}


function scrollToMeals() {
  const mealsContainer = document.getElementById('img21'); 
  const categorySection = document.querySelector('.category-section'); 
  mealsContainer.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    categorySection.scrollIntoView({ behavior: 'smooth' });
  }, 1000);  
}

// ---category---
const mealCategories = [
  { id: 'img1', query: 'Beef' },
  { id: 'img2', query: 'Chicken' },
  { id: 'img3', query: 'Cheesecake' },
  { id: 'img4', query: 'Lamb' },
  { id: 'img5', query: 'Miscellaneous', isCategory: true },
  { id: 'img6', query: 'Pasta' },
  { id: 'img7', query: 'Pork' },
  { id: 'img8', query: 'Seafood' },
  { id: 'img9', query: 'Side', isCategory: true },
  { id: 'img10', query: 'Starter', isCategory: true },
  { id: 'img11', query: 'Vegan' },
  { id: 'img12', query: 'Vegetarian', isCategory: true },
  { id: 'img13', query: 'Breakfast', isCategory: true },
  { id: 'img14', query: 'Goat', isCategory: true }
];

mealCategories.forEach(item => {
  const button = document.getElementById(item.id);
  if (button) {
    button.addEventListener('click', () => {
      fetchMeals(item.query, item.isCategory);
    });
  }
});

function scrollToMeals() {
  const mealsContainer = document.getElementById('img21');
  mealsContainer.scrollIntoView({ behavior: 'smooth' });
}
document.querySelector('.fa-house').addEventListener('click', loadHomePage);
function loadHomePage() {
  const imgContainer = document.getElementById('img21');
  const categorySection = document.querySelector('.category-section'); 
  imgContainer.innerHTML = '';
  categorySection.scrollIntoView({ behavior: 'smooth' });
}


// --- ID------
function getMealByID(id) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals ? data.meals[0] : null;
      if (!meal) {
        document.querySelector('.box1').innerHTML = '<p style="color:#f04d24;  font-size: 20px;font-weight: bolder;"">No meal found.</p>';
        return;
      }
      addMealToDOM(meal);
    })
    .catch(error => console.error('Error fetching the meal data:', error));
}

// ---meal details---
function addMealToDOM(meal) {
  const tags = meal.strTags ? meal.strTags.split(',') : [];
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `<li><strong>${meal[`strIngredient${i}`]}</strong> - ${meal[`strMeasure${i}`]}</li>`
      );
    } else {
      break;
    }
  }

  const imgContainer = document.querySelector('.box1');
  imgContainer.innerHTML = `
      <div id="heading" style="border: 10px solid #f04d24; size: 20px;"></div>
      <div class="text-center d-flex">
        <div class="single-meal-info d-flex align-items-start">
          <div class="meal-image" style="flex: 1;">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="img-fluid" style="height: 500px; width: 700px; object-fit: cover;" />
          </div>
          <div class="meal-details" style="flex: 2; margin-left: 20px; text-align: left;">
            <h1 style="color: #f04d24; text-decoration: underline;">${meal.strMeal}</h1>
            <div class="single-meal-details">
              ${meal.strCategory ? `<p class="meal-category"><strong>CATEGORY:</strong> <span class="category" id="category">${meal.strCategory}</span></p>` : ''}
              ${meal.strArea ? `<p class="meal-area"><strong>Region/Origin:</strong> <span class="area" id="area">${meal.strArea}</span></p>` : ''}
              ${meal.strSource ? `<p><small><a href="${meal.strSource}" target="_blank">Source: ${meal.strSource}</a></small></p>` : ''}
            </div>
            <div class="meal-ingredients" style="background-color: #f04d24; color: #fff; padding: 10px; border-radius: 5px;">
              <h3>Ingredients</h3>
              <ol class="custom-bullets" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                ${ingredients.join('')}
              </ol>
            </div>
            ${meal.strTags ? `<div class="meal-tags">${tags.map(tag => `<span class="badge badge-info">${tag}</span>`).join(' ')}</div>` : ''}
          </div>
        </div>
      </div>
      <div class="meal-instructions">
        <h3 style="font-family:Times New Roman; padding:5px; margin:5px;">Instructions</h3>
        <ul class="custom-bullets">
          <li style="font-family:Times New Roman;">${meal.strInstructions}</li>
        </ul>
      </div>
    `;
    imgContainer.scrollIntoView({ behavior: 'smooth' });
}

