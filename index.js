const COHORT = "2503-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

// fetch the api and display data in the UI by default

// user deletes one of the parties by clicking delete btn

// confirm the party is removed from the list

//create form where user can submit new party to the list

// confirm new party is added to the list after user submits form

const eventForm = document.querySelector("form");
const root = document.querySelector("#root");
const eventName = document.querySelector("#name");
const description = document.querySelector("#description");
const date = document.querySelector("#date");
const eventlocation = document.querySelector("#location");
// === State ===

const state = {
  events: [],
};

/** Renders events from state */
const renderEvents = async (events) => {
  if (Array.isArray(events)) {
    root.replaceChildren(...events);
  } else {
    root.replaceChildren(events);
  }
};

/** Updates state with events from API */
const getEvents = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.data);
    const newData = data.data;
    state.events = newData.map((event) => {
      const card = document.createElement("div");
      card.innerHTML = `<h3> ${event.name} </h3>
      <p> ${event.description}</p>
      <P> ${event.location}</p>
      <button id="delete">Delete</button>`;
      const delButton = card.querySelector("#delete");
      delButton.addEventListener("click", () => {
        deleteEvents(API_URL, event.id);
      });
      return card;
    });
    renderEvents(state.events);
  } catch (error) {
    console.error(error.message);
  }
};
//delete parties from list
const deleteEvents = async (url, id) => {
  try {
    return await fetch(`${url}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Error: could not delete object");
      }
      getEvents(API_URL);
    });
  } catch (error) {
    console.error(error);
  }
};

/** Asks the API to create a new event based on the given `event` */
const addEvents = async (url, eventData) => {
  try {
    console.log("Sending to URL:", url);
    console.log("Sending data:", eventData);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
      throw new Error("Was not able to add new event to the list");
    }
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error);
  }
  getEvents(API_URL);
};

// === Render ===

getEvents(API_URL);

eventForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const eventLocation = formData.get("location");
  const newEvent = {
    name: formData.get("name"),
    description: formData.get("description"),
    date: new Date(formData.get("date")).toISOString(),
    location: eventLocation,
  };
  console.log("Form submitted!");
  console.log("Event data:", newEvent);

  addEvents(API_URL, newEvent);
  eventName.value = "";
  description.value = ""
  eventlocation.value = "";
  date.value = ""
});
