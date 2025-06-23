const { nanoid } = require("../utils");

module.exports = async(database) => {
  const { Question, Show, User } = database.models;

  const user = await User.create({
    username: nanoid(),
    authenticationMethods: [{
      method: "google",
      id: nanoid()
    }]
  });

  const show = await Show.create({
    name: "initial name",
    primaryCategory: 1,
    insiders: ["asdasd"],
    maxLifes: 1,
    prize: 1000,
    shouldBeginAt: new Date(),
  });
  
  const questions = await Promise.all(
    Array(3)
      .fill()
      .map(() => Question.create({
        text: "asd",
        difficulty: 1,
        primaryCategory: 1,
        options: [
          {
            text: "asd",
            correct: true
          },
          {
            text: "asd",
            correct: false
          }
        ]
      })
      )
  );
  
  return {
    show,
    user,
    questions
  };
};
