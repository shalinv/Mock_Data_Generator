const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { faker } = require("@faker-js/faker");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "src")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

function getValue(dataType) {
  switch (dataType) {
    case "string":
      return faker.string.uuid();
    case "integer":
      return faker.number.int({ min: 0, max: 9999 });
    case "float":
      return faker.number.float({ min: 0, max: 9999, precision: 0.01 });
    case "boolean":
      return faker.datatype.boolean();
    case "name":
      return faker.person.fullName();
    case "email":
      return faker.internet.email();
    case "phone":
      return faker.phone.number();
    case "date":
      const d = faker.date.past();
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    case "image_url":
      return faker.image.url();
    case "file_url":
      return faker.internet.url();
    case "object":
      return { id: faker.string.uuid(), name: faker.person.firstName() };
    case "array":
      return [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()];
    default:
      return "N/A";
  }
}

app.post("/generate", (req, res) => {
  const result = [];
  const forms = req.body;
  for (let i = 0; i < 10; i++) {
    const obj = {};
    forms.forEach((element) => {
      obj[element.field] = getValue(element.type);
    });
    result.push(obj);
  }
  res.json(result);
});

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
