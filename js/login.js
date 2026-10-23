
"use strict";

// KANTINKITA - LOGIN

document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("loginForm");
  const nim = document.getElementById("nim");
  const password = document.getElementById("pw");
  const showPassword = document.getElementById("showpw");

  if (!form || !nim || !password) {
    console.error("Form login tidak ditemukan!");
    return;
  }

  // TAMPILKAN PASSWORD
  if (showPassword) {
    showPassword.addEventListener("click", function () {
      if (password.type === "password") {
        password.type = "text";
        showPassword.textContent = "Sembunyi";
      } else {
        password.type = "password";
        showPassword.textContent = "Lihat";
      }
    });
  }

  // PROSES LOGIN
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = nim.value.trim();
    const kataSandi = password.value;

    const errorNim = document.getElementById("e-nim");
    const errorPw = document.getElementById("e-pw");

    // Reset error
    nim.classList.remove("err");
    password.classList.remove("err");

    if (errorNim) errorNim.classList.remove("on");
    if (errorPw) errorPw.classList.remove("on");

    // Validasi NIM
    if (username === "") {
      nim.classList.add("err");
      if (errorNim) errorNim.classList.add("on");
      nim.focus();
      return;
    }

    // Validasi password
    if (kataSandi.length < 6) {
      password.classList.add("err");
      if (errorPw) errorPw.classList.add("on");
      password.focus();
      return;
    }

    // Simpan sesi login simulasi
    sessionStorage.setItem(
      "kantinkita_user",
      JSON.stringify({
        username: username,
        role: "mahasiswa"
      })
    );

    // LANGSUNG KE BERANDA
    window.location.href = "beranda.html";
  });

  console.log("Login KantinKita siap!");
});