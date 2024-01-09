document.addEventListener("DOMContentLoaded", () => {
  let field = document.getElementById("search");

  field.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      search();
    }
  });
  function search() {
    const input = field.value.trim();
    console.log(input);
    fetch(`/search?term=${input}`)
      .then((response) => {})
      .catch((error) => console.error("Error:", error));
    globalThis.location.href = `/search?term=${input}`;
  }
});
