const loginLink = document.getElementById("login-link");
const registerLink = document.getElementById("register-link");
const logoutLink = document.getElementById("logout-link");

if (localStorage.getItem("token")) {
  loginLink.style.display = "none";
  registerLink.style.display = "none";
  logoutLink.style.display = "block";
} else {
  loginLink.style.display = "inline-block";
  registerLink.style.display = "inline-block";
  logoutLink.style.display = "none";
}

logoutLink.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});
