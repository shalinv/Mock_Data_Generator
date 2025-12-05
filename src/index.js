const container = document.getElementById("entry");
const addentry = document.getElementById("add");
const generate = document.getElementById("generate");

addentry.addEventListener("click", () => {
  container.insertAdjacentHTML(
    "beforeend",
    `
      <form class="flex flex-wrap m-3">
        <div class="mx-3">
          <label class="text-white" for="fname">Field Name:</label><br />
          <input
            class="bg-white rounded-sm p-0.5"
            type="text"
            id="fname"
            name="fname"
          />
        </div>
        <div class="mx-3">
          <label class="text-white" for="type">Data Type:</label><br />
          <select class="bg-white rounded-sm p-1" id="type" name="datatype">
            <option value="string">string</option>
            <option value="integer">integer</option>
            <option value="float">float</option>
            <option value="boolean">boolean</option>
            <option value="name">name</option>
            <option value="email">email</option>
            <option value="phone">phone</option>
            <option value="date">date</option>
            <option value="image_url">image_url</option>
            <option value="file_url">file_url</option>
            <option value="object">object</option>
            <option value="array">array</option>
          </select>
        </div>
        <button type="button"
          class="remove bg-red-500 text-white px-2 rounded-sm">
          Remove
        </button>
      </form>
    `
  );
});

container.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove")) {
    const form = e.target.closest("form");
    if (form) form.remove();
  }
});

generate.addEventListener("click", async () => {
  const forms = container.querySelectorAll("form");
  const data = [];

  forms.forEach((form) => {
    const fieldName = form.querySelector('input[name="fname"]').value;
    const dataType = form.querySelector('select[name="datatype"]').value;

    if (fieldName.trim() !== "") {
      data.push({ field: fieldName, type: dataType });
    }
  });

  try {
    const response = await axios.post("/generate", data).then((response) => {
      console.log(response);
      const newDiv = document.createElement("div");

      newDiv.classList.add(
        "bg-black",
        "text-white",
        "p-2",
        "m-2",
        "rounded-md"
      );
      const copyButton = document.createElement("button");
      copyButton.textContent = "Copy";
      copyButton.classList.add(
        "bg-white",
        "text-black",
        "px-2",
        "py-1",
        "rounded-md",
        "m-2"
      );
      copyButton.addEventListener("click", () => {
        navigator.clipboard
          .writeText(JSON.stringify(response.data, null, 2))
          .then(() => {
            copyButton.textContent = "Copied!";
            setTimeout(() => {
              copyButton.textContent = "Copy";
            }, 2000);
          });
      });
      container.appendChild(copyButton);
      newDiv.textContent = JSON.stringify(response.data, null, 2);
      document.body.appendChild(newDiv);
    });
  } catch (err) {
    console.error(err);
  }
});
