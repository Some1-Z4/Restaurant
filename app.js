let productCont = document.querySelector("#productCont")
let filter = document.querySelector("#filter")


fetch("https://restaurant.stepprojects.ge/api/Products/GetAll")
.then(el => el.json())
.then(data => productCards(data))

function productCards(el) {
    productCont.innerHTML = ""

    el.forEach(el => {
        productCont.innerHTML += `
    <div class="card">
        <img src="${el.image}" alt="${el.name}">
        <div class="card-body">
            <h5>${el.name}</h5>
            <div class="spiciness">Spiciness: ${el.spiciness == 0 ? "No Spiciness": '🌶️'.repeat(el.spiciness)}</div>
            <p class="price">$${el.price}</p>
            <div class="nuts-vegetarian">
                <span>${el.nuts ? '<i class="fa-solid fa-check" style="color: green;"></i>' : '<i class="fa-solid fa-x" style="color: red;"></i>'} Nuts</span>
                <span>${el.vegeterian ? '<i class="fa-solid fa-check" style="color: green;"></i>' : '<i class="fa-solid fa-x" style="color: red;"></i>'} Veg</span>
            </div>
            <button onclick="addToCart(${el.id}, ${el.price})">Add to cart</button>
        </div>
    </div>`
    });
}

fetch("https://restaurant.stepprojects.ge/api/Categories/GetAll")
.then(el => el.json())
.then(data => displayCategory(data))

function displayCategory(arr){
    arr.forEach((el) => {
        let btn = document.createElement("button")
        btn.innerText = el.name;
        btn.addEventListener("click", () =>{
         console.log(el.id);
         fetch(`https://restaurant.stepprojects.ge/api/Categories/GetCategory/${el.id}`)
         .then((resp) => resp.json())
         .then((data) => productCards(data.products));
        });
        buttons.appendChild(btn)
    })
}

all.addEventListener("click", () => {
    fetch("https://restaurant.stepprojects.ge/api/Products/GetAll")
    .then((resp) => resp.json())
    .then((data) => productCards(data));
})

function buildFilter() {
    filter.innerHTML = `
    <div class="filter-box">
        <h1>Filter</h1>

        <div class="filter-group">
            <label style="color: white">Spiciness: <span id="spicinessValue">0</span></label>
            <input type="range" id="spicinessFilter" min="0" max="4" value="0" 
            oninput="document.querySelector('#spicinessValue').textContent = this.value">
        </div>

        <div class="filter-group">
            <label class="checkbox-label"><input type="checkbox" id="nutsFilter"> 🥜 No Nuts</label>
        </div>

        <div class="filter-group">
            <label class="checkbox-label"><input type="checkbox" id="vegFilter"> 🥦 Vegetarian Only</label>
        </div>

        <div class="filter-buttons">
            <button id="resetFilter">Reset</button>
            <button id="applyFilter">Apply</button>
        </div>
    </div>
    `

    document.querySelector("#applyFilter").addEventListener("click", () => {
        let spiciness = document.querySelector("#spicinessFilter").value
        let nuts = document.querySelector("#nutsFilter").checked
        let veg = document.querySelector("#vegFilter").checked

        let url = `https://restaurant.stepprojects.ge/api/Products/GetFiltered?spiciness=${spiciness}`
        if (nuts) url += `&nuts=false`
        if (veg) url += `&vegeterian=true`

        fetch(url)
        .then(r => r.json())
        .then(data => productCards(data))
    })

    document.querySelector("#resetFilter").addEventListener("click", () => {
        document.querySelector("#spicinessFilter").value = 0
        document.querySelector("#spicinessValue").textContent = 0
        document.querySelector("#nutsFilter").checked = false
        document.querySelector("#vegFilter").checked = false

        fetch("https://restaurant.stepprojects.ge/api/Products/GetAll")
        .then(r => r.json())
        .then(data => productCards(data))
    })
}

buildFilter()


async function addToCart(productId, price) {
    try {
        
        const res = await fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll")
        const items = await res.json()

       
        const existing = items.find(item => item.product.id === productId)

        if (existing) {
         
            await fetch("https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    quantity: existing.quantity + 1,
                    price: price,
                    productId: productId
                })
            })
        } else {
            
            await fetch("https://restaurant.stepprojects.ge/api/Baskets/AddToBasket", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    quantity: 1,
                    price: price,
                    productId: productId
                })
            })
        }

        updateCartCount()

    } catch (err) {
        console.error("Failed to add to cart:", err)
    }
}

async function updateCartCount() {
    const res = await fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll")
    const data = await res.json()

    let total = data.reduce((sum, item) => sum + item.quantity, 0)

    document.querySelector(".cart-count").textContent = total
}