const API_key = "xx1yTrgekJVegyCzWo1jwvjN71iAuP6dE1plBl7q";
const submit = document.querySelector(".search");
const searchDate = document.getElementById("search-input");
const baseUrl = `https://api.nasa.gov/planetary/apod?api_key=${API_key}`;
const imageTitleDescContainer = document.querySelector(
  ".current-image-container"
);
let searches = [];
document.querySelector(".welcome").classList.toggle("show");
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    document.querySelector(".welcome").classList.toggle("show");
    document.querySelector(".empty").classList.add("remove-container");
    setTimeout(() => {
      document.querySelector(".empty").style.display = "none";
    }, 2000);
    document.querySelector(".body-container").style.display = "flex";
  }, 2000);
  const currentDate = new Date().toISOString().split("T")[0];
  console.log(currentDate);
  getCurrentImageOfTheDay(currentDate);

  let searchForDate = "";

  submit.addEventListener("click", (event) => {
    event.preventDefault();
    if (searchDate.value) {
      if (searchDate.value > currentDate) {
        alert("Please enter a valid date!");
        return;
      }
      searchForDate = searchDate.value;
      getImageOfTheDay(searchForDate);
    }
  });

  addSearchToHistory();

  function renderImageOnUI(result, defaultPicture) {
    const img = document.createElement("img");
    let heading = document.createElement("h1");
    heading.className = "heading";
    if (defaultPicture) {
      heading.innerHTML = "NASA Picture of the Day";
    } else {
      heading.innerHTML = `Picture On ${result.date}`;
    }

    img.className = "image";
    const titleDesc = document.createElement("div");
    titleDesc.className = "title-description";
    titleDesc.innerHTML = `<p class="title">${result.title}</p>
  <hr>
          <p class="description">
          ${result.explanation}
          </p>`;
    img.src = result.hdurl;
    imageTitleDescContainer.append(heading);
    imageTitleDescContainer.append(img);
    imageTitleDescContainer.append(titleDesc);
  }

  async function getCurrentImageOfTheDay(date) {
    const url = `${baseUrl}&date=${date}`;
    try {
      const response = await fetch(url);
      const result = await response.json();
      renderImageOnUI(result, true);
      // console.log(result);
    } catch (error) {
      console.log("Some error occurred", error);
    }
  }
  async function getImageOfTheDay(date) {
    imageTitleDescContainer.innerHTML = "";
    const url = `${baseUrl}&date=${date}`;

    try {
      const response = await fetch(url);
      const result = await response.json();
      renderImageOnUI(result, false);
      saveSearch(date);
    } catch (error) {
      console.log("Some error occurred", error);
    }
  }

  function saveSearch(date) {
    let searchDate = {
      date,
    };
    searches.push(searchDate);
    localStorage.setItem("searches", JSON.stringify(searches));
    addSearchToHistory();
  }

  function addSearchToHistory() {
    const ul = document.getElementById("search-history");
    ul.innerHTML = "";
    const searches = JSON.parse(localStorage.getItem("searches"));
    if (searches) {
      searches.forEach((item) => {
        const li = document.createElement("li");
        const anchor = document.createElement("a");
        anchor.href = "";
        anchor.innerText = item.date;
        anchor.addEventListener("click", (event) => {
          event.preventDefault();
          getImageOfTheDay(item.date);
        });
        li.append(anchor);
        ul.appendChild(li);
      });
    } else {
      return;
    }
  }
});
