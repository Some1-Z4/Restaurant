let phone = document.querySelector("#phone")
let password = document.querySelector("#password")
let register = document.querySelector("#register")

register.addEventListener("click", async () => {
    try {
        const resp = await fetch("https://rentcar.stepprojects.ge/api/Users/login", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                phoneNumber: phone.value,
                password: password.value
            })
        })

        if (!resp.ok) {
            alert("User can't be found!")
            return
        }

        const data = await resp.json()
        localStorage.setItem("token", data.token)
        localStorage.setItem("phone", phone.value)
        window.location.href = "./index.html"

    } catch (err) {
        alert("Something went wrong, please try again!")
        console.error("Login error:", err)
    }
})