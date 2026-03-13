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
    burger.classList.toggle("active")
    menu.classList.toggle("active")
})

let resizeTimer
window.addEventListener("resize", () => {
    document.body.classList.add("no-transitions")
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
        document.body.classList.remove("no-transitions")
    }, 200)
})
