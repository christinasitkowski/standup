let count = names.length;

let first = Math.floor(Math.random() * count);

names.sort(() => Math.random() - 0.5);

const container = document.querySelector("#name-blocks");

names.forEach((name, index) => {
  let div = document.createElement("div");
  div.className = "name-block";
  let el = document.createTextNode(name);

  div.appendChild(el);
  container.appendChild(div);

  if (index == first) {
    let badge = document.createElement("div");
    badge.className = "badge";
    div.className =
      "name-block animate__animated animate__pulse animate__repeat-3";
    div.appendChild(badge);
  }

  div.addEventListener("click", () => {
    if (div.classList.contains("disabled")) {
      div.classList.remove("disabled");
      count++;
    } else {
      div.classList.add("disabled");
      count--;
    }

    if (count == 0) {
      confetti.start();
    } else {
      confetti.stop();
    }
  });
});
