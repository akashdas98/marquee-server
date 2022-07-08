const { default: axios } = require("axios");
const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const FormData = require("form-data");
const pool = require("./database/db");
const path = require("path");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));

app.get("/api/fetchcompanies", async (req, res) => {
  const data = req.query;

  const formData = new FormData();
  formData.append("search", data.query);
  formData.append("filter", "company");
  try {
    let result = (
      await axios.post("https://www.zaubacorp.com/custom-search", formData, {
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      })
    ).data;
    res.send(result);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/api/addcompany", async (req, res) => {
  const data = req.body;
  if (!data || !data.name || !data.cin) {
    res.sendStatus(400);
  }
  try {
    const newCopmpany = await pool.query(
      "INSERT INTO company (name, cin) VALUES($1, $2) RETURNING *",
      [data.name, data.cin]
    );
    res.json(newCopmpany);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/api/fetchaddedcompanies", async (req, res) => {
  const data = req.query;
  try {
    const companies = await pool.query("SELECT * FROM company");
    res.json(companies.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
