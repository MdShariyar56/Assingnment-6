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
  categoriesContainer.innerHTML = "";
  cats.forEach(cat=>{
    const btn = document.createElement("button");
    btn.className="px-2 py-1 text-base font-semibold bg-white text-green-800 hover:bg-green-500 hover:text-white rounded";
    btn.textContent = cat.category_name;
    btn.addEventListener("click", ()=>{
      setActiveCategory(btn);
      loadCategoryTrees(cat.id);
    });
    categoriesContainer.appendChild(btn);
  });
}

function setActiveCategory(activeBtn){
  categoriesContainer.querySelectorAll("button").forEach(btn=>{
    btn.classList.remove("bg-green-500","text-white");
  });
  activeBtn.classList.add("bg-green-500","text-black");
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
  grid.className="grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3";

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
      <button class="mt-2 px-3 py-1 bg-yellow-400 text-green-800 rounded w-full">Add to Cart</button>
    `;

   // Modal on name click 
    card.querySelector("h2").addEventListener("click", ()=>openModal(id)); 
    // Add to Cart 
    card.querySelector("button").addEventListener("click", ()=>{ addToCart({id,name,price}); });

    grid.appendChild(card);
  });

  treeContainer.appendChild(grid);
}

function openModal(id){
  modalContent.innerHTML='<span class="loading loading-spinner text-error"></span>';
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  fetch(API_PLANT_DETAIL(id))
    .then(res=>res.json())
    .then(json=>{
       console.log(json);
      const plant = json.plants || {};
      modalContent.innerHTML=`
        <div class="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-1 gap-4">
          <div class="md:col-1">
          <h2 class="text-2xl font-bold mb-2">${plant.name??'Plant'}</h2>
            <img src="${plant.image??''}" alt="${plant.name??''}" class="w-90 h-50 object-cover rounded"/>
          </div>
          <div class="md:col-span-2">
            <div ><span class="text-black text-sm font-bold">Category: </span><strong"> ${plant.category??''}</strong></div>
             <div><span class="text-black text-sm font-bold">Price: ৳</span> ${plant.price??0}</div>
            <p class="text-sm  text-gray-700 mb-3"><span class="text-black text-sm font-bold">description:</span> ${plant.description??'No details'}</p>
          </div>
        </div>
      `;
    
    });
}

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click",(e)=>{if(e.target===modal) closeModal();});

function closeModal(){modal.classList.add("hidden"); modal.classList.remove("flex"); modalContent.innerHTML='';}

function addToCart(item){
  const existing = cart.find(c=>c.id===item.id);
  if(existing) existing.qty++;
  else cart.push({...item,qty:1});
  renderCart();
}

function removeFromCart(id){cart = cart.filter(c=>c.id!==id); renderCart();}

function renderCart(){
  if(cart.length===0){cartListDiv.innerHTML="<p>Cart is empty</p>"; cartTotalDiv.textContent="Total: ৳0"; return;}
  cartListDiv.innerHTML="";
  cart.forEach(c=>{
    const div = document.createElement("div");
    div.className="flex justify-between items-center bg-gray-100 p-2 mb-1 rounded";
    div.innerHTML=`<span>${c.name} x ${c.qty}</span>
                   <span>৳${c.price*c.qty} <button class="text-red-500 ml-2">❌\</button></span>`;
    div.querySelector("button").addEventListener("click",()=>removeFromCart(c.id));
    cartListDiv.appendChild(div);
  });
  const total = cart.reduce((sum,it)=>sum+it.price*it.qty,0);
  cartTotalDiv.textContent="Total: ৳"+total;
}



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