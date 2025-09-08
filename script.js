const API_ALL_CATEGORIES = "https://openapi.programming-hero.com/api/categories";
const API_ALL_PLANTS = "https://openapi.programming-hero.com/api/plants";
const API_CATEGORY = id => `https://openapi.programming-hero.com/api/category/${id}`;
const API_PLANT_DETAIL = id => `https://openapi.programming-hero.com/api/plant/${id}`;

const categoriesContainer = document.getElementById("Categories-container");
const treeContainer = document.getElementById("tree-container");
const cartListDiv = document.getElementById("cart-list");
const cartTotalDiv = document.getElementById("cart-total");
const modal = document.getElementById("tree-modal");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");


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
      //
      //
    });
    categoriesContainer.appendChild(btn);
  });
}

function setActiveCategory(activeBtn){
  categoriesContainer.querySelectorAll("button").forEach(btn=>{
    btn.classList.remove("bg-green-500","text-white");
  });
  activeBtn.classList.add("bg-green-500","text-white");
}


function loadCategoryTrees(id){
  treeContainer.innerHTML = `<p class="text-center py-10"><span class="loading loading-spinner text-error"></span></p>`;
  fetch(API_CATEGORY(id))
    .then(res=>res.json())
    .then(json=>{
      console.log(json)
      const trees = json.plants ?? [];
      displayTrees(trees);
    });
}

function displayTrees(trees){
  treeContainer.innerHTML = "";
  if(trees.length===0){ treeContainer.innerHTML="<p>No trees found.</p>"; return; }

  const grid = document.createElement("div");
  grid.className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  trees.forEach(tree=>{
    const id = tree.id ?? tree.plant_id ?? Math.random().toString(36).slice(2);
    const name = tree.name ?? tree.plant_name ?? "Unknown";
    const img = tree.image ?? "";
    const desc = tree.description?.slice(0,80) ?? "No description";
    const price = tree.price ?? Math.floor(Math.random()*500)+100;

    const card = document.createElement("div");
    card.className="bg-white p-4 rounded shadow ";
    card.innerHTML=`
      <img src="${img}" class="w-full h-40 object-cover rounded mb-2"/>
      <h2 class="font-bold cursor-pointer text-green-800">${name}</h2>
      <p class="text-gray-600">${desc}...</p>
      <p class="font-semibold mt-1">Price: ৳${price}</p>
      <button class="mt-2 px-3 py-1 bg-yellow-400 text-green-800 rounded">Add to Cart</button>
    `;

    

    grid.appendChild(card);
  });

  treeContainer.appendChild(grid);
}
//



function loadAllPlants(){
  treeContainer.innerHTML = `<p class="text-center py-10">Loading all plants...</p>`;
  fetch(API_ALL_PLANTS)
    .then(res => res.json())
    .then(json => {
      const trees = json.plants ?? [];
      displayTrees(trees);
    })
    .catch(err=>{
      console.error(err);
      treeContainer.innerHTML = "<p class='text-center py-10 text-red-500'>Unable to load plants.</p>";
    });
}

loadAllPlants(); 






loadCategories();