document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const authContainer = document.getElementById("authContainer");
  const appLayout = document.getElementById("appLayout");
  const errorAlert = document.getElementById("errorAlert");
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("passwordInput");

  // 1. Logika Toggle Icon Mata Password
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
      const isPassword = passwordInput.getAttribute("type") === "password";
      
      // Ubah tipe input
      passwordInput.setAttribute("type", isPassword ? "text" : "password");
      
      // Ubah icon: Jika terbuka pakai fa-eye-slash, jika tertutup pakai fa-eye
      const icon = togglePassword.querySelector("i");
      if (icon) {
        if (isPassword) {
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
        } else {
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
        }
      }
    });
  }

  // 2. Logika Submit Login & Display Notifikasi Error
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Menahan refresh halaman

      const nis = document.getElementById("nisInput").value.trim();
      const password = passwordInput.value.trim();

      // Sembunyikan alert error sebelumnya
      if (errorAlert) {
        errorAlert.style.display = "none";
        errorAlert.innerText = "";
      }

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nis, password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Login Berhasil: Pindah ke Dashboard
          if (authContainer) authContainer.style.display = "none";
          if (appLayout) appLayout.classList.add("active");
        } else {
          // Login Gagal: Tampilkan Notifikasi Error spesifik (ID/PW Salah)
          if (errorAlert) {
            errorAlert.innerText = data.message || "ID atau Password salah!";
            errorAlert.style.display = "block";
          }
        }
      } catch (err) {
        if (errorAlert) {
          errorAlert.innerText = "Gagal terhubung ke server!";
          errorAlert.style.display = "block";
        }
      }
    });
  }

  // 3. Logika Chatbot AI (HikmahBot)
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");

  if (chatForm) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (!message) return;

      const userDiv = document.createElement("div");
      userDiv.className = "message user";
      userDiv.innerText = message;
      chatMessages.appendChild(userDiv);
      chatInput.value = "";
      chatMessages.scrollTop = chatMessages.scrollHeight;

      const botDiv = document.createElement("div");
      botDiv.className = "message bot";
      botDiv.innerText = "Sedang mengetik...";
      chatMessages.appendChild(botDiv);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
        const data = await res.json();
        botDiv.innerText = data.reply || "Maaf, terjadi kesalahan.";
      } catch (err) {
        botDiv.innerText = "Gagal terhubung ke AI server.";
      }
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }
});
