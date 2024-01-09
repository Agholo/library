document.addEventListener("DOMContentLoaded", () => {
  let logout = document.getElementById("logout");
  let lib = document.getElementById("lib");
  logout.addEventListener("click", async () => {
    try {
      fetch("/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  });

  lib.addEventListener("click", () => {
    window.location.href = "/";
  });
});
