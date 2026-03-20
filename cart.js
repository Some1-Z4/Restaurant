async function loadCart() {
    try {
        const res = await fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll")
        const data = await res.json()
        renderCart(data)
    } catch (err) {
        alert("Failed to load cart!")
        console.error("Failed to load cart:", err);
    }
}

function renderCart(items) {
    const cartItems = document.querySelector("#cartItems")
    const emptyCart = document.querySelector("#emptyCart")
    const cartFooter = document.querySelector("#cartFooter")
    const cartTable = document.querySelector("#cartTable")
    const cartCount = document.querySelector("#cartCount")
      
    if (!cartTable) return

    if (!items || items.length === 0) {
        cartTable.style.display = "none"
        cartFooter.style.display = "none"
        emptyCart.style.display = "block"
        cartCount.textContent = "0"
        return
    }

    cartTable.style.display = "block"
    cartFooter.style.display = "flex"
    emptyCart.style.display = "none"
    cartCount.textContent = items.reduce((sum, item) => sum + item.quantity, 0)
    cartItems.innerHTML = ""

    let total = 0

    items.forEach(item => {
    const itemTotal = item.price * item.quantity
    total += itemTotal

    cartItems.innerHTML += `
    <div class="cart-item">
        <div class="item-actions">
            <button class="btn-delete" onclick="deleteItem(${item.product.id})">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <button class="btn-edit">
                <i class="fa-solid fa-pen"></i>
            </button>
        </div>
        <div class="item-info">
            <img src="${item.product.image}" alt="${item.product.name}">
            <span>${item.product.name}</span>
        </div>
        <div class="qty-control">
            <button onclick="updateQty(${item.product.id}, ${item.quantity - 1}, ${item.price})">−</button>
            <span>${item.quantity}</span>
            <button onclick="updateQty(${item.product.id}, ${item.quantity + 1}, ${item.price})">+</button>
        </div>
        <div class="item-price">$${item.price}</div>
        <div class="item-total">$${itemTotal}</div>
    </div>`
})
    document.querySelector("#totalPrice").textContent = `$${total}`
}

async function deleteItem(productId) {
    try {
        await fetch(`https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${productId}`, {
            method: "DELETE"
        })
        loadCart()
    } catch (err) {
        alert("Failed to delete item!")
        console.error("Failed to delete item:", err)
    }
}

async function updateQty(productId, newQty, price) {
    if (newQty < 1) return
    try {
        await fetch("https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket", {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                quantity: newQty,
                price: price,
                productId: productId
            })
        })
        loadCart()
    } catch (err) {
        alert("Failed to update quantity!")
        console.error("Failed to update quantity:", err)
    }
}

loadCart()