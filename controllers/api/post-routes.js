const router = require("express").Router();
const { Answer, Question, Tag, User, QuestionTag } = require("../../models");
const { Op } = require("sequelize");

// GET all questions
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Answer,
          include: {
            model: User,
            attributes: ["username"],
          },
        },
        {
          model: Tag,
          attributes: ["name"],
        },
      ],
    });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET a single question by ID
router.get("/questions/:id", async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Answer,
          include: {
            model: User,
            attributes: ["username"],
          },
        },
        {
          model: Tag,
          attributes: ["name"],
        },
      ],
    });
    if (!question) {
      res.status(404).json({ message: "No question found with this id" });
      return;
    }
    res.status(200).json(question);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET all answers
router.get("/answers", async (req, res) => {
  try {
    const answers = await Answer.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Question,
          attributes: ["title"], //Include related question title (optional)
        },
        {
          model: Tag,
          attributes: ["name"],
        },
      ],
    });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET answer by id
router.get("/answer/:id", async (req, res) => {
  try {
    const answer = await Answer.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attribute: ["username"],
        },
        {
          model: Question,
          attribute: ["title"],
        },
        {
          model: Tag,
          attribute: ["name"],
        },
      ],
    });
    if (!answer) {
      res.status(404).json({ message: "No answer found with this id" });
      return;
    }
    res.status(200).json(answer);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  /* req.body should look like this:
    {
      user_id: 1
      content: "How to beat level 3 of this game?"
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    let newQuestion = await Question.create(req.body);
    if (req.body.tagIds.length) {
      const tagArray = req.body.tagIds.map((tag_id) => {
        return {
          question_id: newQuestion.id,
          tag_id,
        };
      });
      let tagIds = await QuestionTag.bulkCreate(tagArray);
    }
    req.session.save(() => {
      res.status(200).json(newQuestion);
    });
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

router.get("/byTag/:name", async (req, res) => {
  try {
    const questionData = await Question.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Tag,
          where: {
            name: req.params.name,
          },
        },
      ],
      order: [["createdDate", "DESC"]],
    });
    const questions = questionData.map((question) =>
      question.get({ plain: true })
    );
    res.render("dashboard", {
      questions,
      logged_in: req.session.logged_in,
      title: "Welcome to the Hive Bee!",
    });
  } catch (e) {
    res.status(500).json(e);
    console.log(e);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const dbQuestion = await Question.findByPk(req.params.id);
    if (!dbQuestion) {
      res.status(404).json("Unable to locate question");
    }
    await dbQuestion.destroy();
    res.status(200).json("Successfully deleted.");
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
