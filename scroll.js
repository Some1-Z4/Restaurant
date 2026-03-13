window.addEventListener("scroll", () => {
    const header = document.querySelector("#header")
    if (window.scrollY > 10) {
        header.classList.add("scrolled")
    } else {
        header.classList.remove("scrolled")
    }
})

const burger = document.querySelector("#burger")
const menu = document.querySelector(".header-box")
 
burger.addEventListener("click", () => {
    burger.classList.toggle("active")   // ← drives the X animation
    menu.classList.toggle("active")
})

