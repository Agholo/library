document.addEventListener("DOMContentLoaded", function () {
  let logo = document.getElementById("logo");
  let cencal = document.getElementById("cencal");
  let library = document.getElementById("library");
  let logout = document.getElementById("logout");
  logo.addEventListener("click", () => {
    location.href = "/";
  });
  library.addEventListener("click", () => {
    location.href = "/";
  });
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
  cencal.addEventListener("click", function () {
    let bookData = JSON.parse(
      this.closest(".smth").getAttribute("bookData")
    ).dataBook;
    fetch("/cencal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ book: bookData }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          globalThis.location.reload(true);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  });
});
