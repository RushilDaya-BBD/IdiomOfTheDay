const express = require("express");
const idiomsRouter = express.Router();
const authMiddleware = require('../middleware/auth');

const {
  ModelNames,
  create,
  findByPk,
  query,
  destroyByPK,
  findAll,
  updateByPK,
} = require("../database/datasource");

const { Models } = require("../database/models");

//Endpoint to return a random idiom
idiomsRouter.get("/", async (req, res) => {


  try {
    const { result } = await query(
      "SELECT TOP 1 * FROM Idioms ORDER BY NEWID()"
    );

    if (result.length === 0) {
      res.status(400).send("There are no idioms in the database.");
      return;
    }

    res.send(result[0]);
  } catch (err) {
    res.status(500).send("An unexpected error has occurred.");
  }
});

//Endpoint to get all idioms
idiomsRouter.get("/all", async (req, res) => {

  try {
    const result = await findAll(ModelNames.Idiom);

    res.send(result);
  } catch (err) {
    res.status(500).send("An unexpected error has occurred.");
  }
});

//Endpoint to get a specific idiom
idiomsRouter.get("/one/:id", async (req, res) => {
  const id = req.params.id;

  try{
    const result = await findByPk(ModelNames.Idiom, id);

      if (!result) {
        res
          .status(404)
          .send("An idiom with the specified id could not be found.");
        return;
      }

      res.send(result);
  } catch (err) {
    res.status(500).send("An unexpected error has occurred.");
  }
})

//Endpoint to update an idiom
idiomsRouter.post("/update", authMiddleware, async(req, res) => {
  const { id, idiom, meaning, origin } = req.body;

  if (!id || !idiom || !meaning || !origin) {
    res.status(400).send("Invalid parameters.");
    return;
  }

  try {
    const result = await findByPk(ModelNames.Idiom, id);

    if(!result)
    {
      res
        .status(404)
        .send("An idiom with the specified id could not be found.");
      return;
    }
    else {
      await updateByPK(ModelNames.Idiom, {
        id: id,
        Idiom: idiom,
        Meaning: meaning,
        Origin: origin,
      }, id)

      res.status(200).send("Updated entry successfully");
    }
  } catch (err) {
    res.status(500).send("An unexpected error has occurred.");
  }
})

//Endpoint to delete from the database by id
idiomsRouter.post("/delete", authMiddleware, async(req, res) => {
  const id = req.body.id;

  try {
    const result = await findByPk(ModelNames.Idiom, id);

    if(!result)
    {
      res
        .status(404)
        .send("An idiom with the specified id could not be found.");
      return;
    }
    else {
      await destroyByPK(ModelNames.Idiom, id);
      res.status(200).send("Entry deleted succesfully");
    }

  } catch(err) {
    res.status(500).send("An unexpected error has occured.");
  }
})

//Endpoint to add idiom to database
idiomsRouter.post("/", authMiddleware, async (req, res) => {
  const { idiom, meaning, origin } = req.body;

  if (!idiom || !meaning || !origin) {
    res.status(400).send("Invalid parameters.");
    return;
  }

  try {
    const record = await create(ModelNames.Idiom, {
      Idiom: idiom,
      Meaning: meaning,
      Origin: origin,
    });
    res.status(200).send("Idiom added successfully");
  } catch (err) {
    res.status(500).send("An unexpected error has occurred.");
  }
});

module.exports = idiomsRouter;
