let phone = document.querySelector("#phone")
let password = document.querySelector("#password")
let register = document.querySelector("#register")


register.addEventListener("click", ()=>{
    fetch("https://rentcar.stepprojects.ge/api/Users/register", {
     method : "POST",
     headers : {
        'Content-Type' : "application/json"
     },
     body : JSON.stringify({
        phoneNumber : phone.value,
        password : password.value
     })
    })
    .then(resp => resp.json())
    .then(data => {
        localStorage.setItem("token", data.token)
        localStorage.setItem("phone", phone.value)
        window.location.href = "./index.html"
    })
})