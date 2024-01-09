document
  .getElementById("signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var formData = new FormData(document.getElementById("signupForm"));
    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data);
          console.log("Sign up successful");
        } else {
          console.error("Sign up failed: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error during signup request:", error);
      });
  });
