document.addEventListener("DOMContentLoaded", function () {
  let logo = document.getElementById("logo");
  let logout = document.getElementById("logout");
  logo.addEventListener("click", () => {
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
  let rentals = document.getElementById("rentals");
  rentals.addEventListener("click", () => {
    location.href = "/rentals";
  });
  const openButton = document.querySelectorAll(".rental");
  const closeButton = document.getElementById("closePopupButton");
  const popup = document.getElementById("popup");
  const overlay = document.createElement("div");
  const time = document.getElementById("duration");
  const range = document.getElementById("timebar");
  const rentalButton = document.getElementById("rentalButton");
  overlay.className = "overlay";
  let bookData = null;

  function openPopup() {
    overlay.style.display = "block";
    popup.style.display = "block";
    const bookElement = this.closest(".book");
    bookData = JSON.parse(bookElement.getAttribute("bookData"));
  }

  function closePopup() {
    overlay.style.display = "none";
    popup.style.display = "none";
    bookData = null;
  }

  openButton.forEach((button) => {
    button.addEventListener("click", openPopup);
  });
  closeButton.addEventListener("click", closePopup);

  document.body.appendChild(overlay);

  function t() {
    switch (range.value) {
      case "0":
        return 0.5;
      case "1":
        return 1;
      case "2":
        return 2;
      case "3":
        return 3;
      case "4":
        return 4;
      case "5":
        return 5;
      case "6":
        return 6;
      default:
        return 0.5;
    }
  }
  range.addEventListener("change", () => {
    let dur = t();
    time.innerText = dur == 0.5 ? "30 Minute" : `${dur} Hours`;
  });

  range.addEventListener("mousemove", () => {
    let dur = t();
    time.innerText = dur == 0.5 ? "30 Minute" : `${dur} Hours`;
  });

  rentalButton.addEventListener("click", () => {
    fetch("/timeHandle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ time: t(), book: bookData }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          closePopup();
          this.location.reload(true);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  });
});
