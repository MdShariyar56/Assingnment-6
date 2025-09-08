
const API_ALL_CATEGORIES = "https://openapi.programming-hero.com/api/categories";
const API_ALL_PLANTS = "https://openapi.programming-hero.com/api/plants";
const API_CATEGORY = id => `https://openapi.programming-hero.com/api/category/${id}`;
const API_PLANT_DETAIL = id => `https://openapi.programming-hero.com/api/plant/${id}`;

const categoriesContainer = document.getElementById("Categories-container");
const treeContainer = document.getElementById("tree-container");
const cartListDiv = document.getElementById("cart-list");



let cart = [];
let activeCategoryId = null;

function loadCategories(){
  fetch(API_ALL_CATEGORIES)
    .then(res=>res.json())
    .then(json=>{
      console.log(json)
      const cats = json.categories ?? [];
     displayCategories(cats);
    });
}

function displayCategories(cats){
  categoriesContainer.innerHTML = "<h2 class='font-bold mb-4'>Categories</h2>";
  cats.forEach(cat=>{
    const btn = document.createElement("button");
    btn.className="block w-full text-left mb-2 px-2 py-1 border rounded hover:bg-green-500 hover:text-white";
    btn.textContent = cat.category_name;
    btn.addEventListener("click", ()=>{
    });
    categoriesContainer.appendChild(btn);
  });
}

loadCategories();