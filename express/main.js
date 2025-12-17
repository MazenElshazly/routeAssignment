const path = require("node:path");
const fs = require("node:fs");
const express = require("express");

const port = 3000;
const app = express();
function loadUsers(req, res, next) {
  try {
    let users = [];

    if (fs.existsSync("user.json")) {
      const fileContent = fs.readFileSync("user.json", "utf8");
      users = JSON.parse(fileContent);
    }
    req.allUsers = users;

    next();
  } catch (error) {
    return res.status(500).json({
      error: "Failed to load users",
      details: error.message,
    });
  }
}

app.use(express.json());
// All routes starting with /user will load users
app.use("/user", loadUsers);
const regex = /\/user\/\d+/;
app.get("/", (req, res, next) => {
  return res.status(200).json({ message: "Done" });
});

app.post("/user", (req, res, next) => {
  try {
    const userData = req.body;
    console.log(req.allUsers);
    console.log(userData);

    // Add new user

    const checkUnique = req.allUsers.find(
      (user) => user.email === userData.email
    );
    if (checkUnique) {
      return res.status(409).json({
        error: "Already Registered",
        email: userData.email,
      });
    } else {
      userData.id = req.allUsers.at(-1).id + 1;

      req.allUsers.push(userData);

      // Save to file
      fs.writeFileSync("user.json", JSON.stringify(req.allUsers, null, 2));
      return res.status(201).json({
        message: "User created",
        user: userData,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error,
    });
  }
});

app.get("/user", (req, res, next) => {
  const response = {
    count: req.allUsers.length,
    data: req.allUsers,
  };
  return res.status(200).json({ response });
});

app.patch(regex, (req, res, next) => {
  const parts = req.url.split("/");
  const userId = parts[2];
  const finduser = req.allUsers.findIndex((user) => user.id == userId);

  if (finduser === -1) {
    return res.status(404).json({
      error: "no user with such ID",
      id: userId,
    });
  } else {
    if (req.body.name) {
      req.allUsers[finduser].name = req.body.name;
    }
    if (req.body.age) {
      req.allUsers[finduser].age = req.body.age;
    }
    if (req.body.email) {
      const checkUnique = req.allUsers.find(
        (user) => user.email === req.body.email
      );
      if (!checkUnique) {
        req.allUsers[finduser].email = req.body.email;
      } else {
        return res.status(409).json({
          error: "Update failed ,Already Registered email",
          email: req.body.email,
        });
      }
    }

    fs.writeFileSync("user.json", JSON.stringify(req.allUsers, null, 2));
    return res.status(200).json({
      message: "User updated",
      user: userId,
    });
  }
});

app.delete(regex, (req, res, next) => {
  const parts = req.url.split("/");
  console.log(parts);

  const userId = parts[2];
  const finduser = req.allUsers.findIndex((user) => user.id == userId);
  if (finduser === -1) {
    return res.status(404).json({
      error: "no user with such ID",
      id: userId,
    });
  } else {
    req.allUsers.splice(finduser, 1);
    fs.writeFileSync("user.json", JSON.stringify(req.allUsers, null, 2));
    return res.status(200).json({
      message: "User deleted",
      user: userId,
    });
  }
});

app.get(regex, (req, res, next) => {
  const parts = req.url.split("/");
  const userId = parts[2];
  const finduser = req.allUsers.findIndex((user) => user.id == userId);
  if (finduser === -1) {
    return res.status(404).json({
      error: "no user with such ID",
      id: userId,
    });
  } else {
    res.status(200).json(req.allUsers[finduser]);
    return;
  }
});

app.get("/user/getByName", (req, res, next) => {
  const finduser = req.allUsers.findIndex(
    (user) => user.name == req.query.name
  );
  if (finduser === -1) {
    return res.status(404).json({
      error: "no user with such name",
      id: req.query.name,
    });
  } else {
    return res.status(200).json(req.allUsers[finduser]);
  }
});

app.get("/user/filter", (req, res, next) => {
  try {
    const minAge = req.query.minAge;
    if (!minAge) {
      return res.status(400).json({
        error: "minAge parameter is required",
      });
    }
    const minAgeNumber = parseInt(minAge);

    // Validate that it's a valid number
    if (isNaN(minAgeNumber)) {
      return res.status(400).json({
        error: "minAge must be a valid number",
      });
    }
    const filteredUsers = req.allUsers.filter(
      (user) => user.age >= minAgeNumber
    );
    if (filteredUsers.length > 0) {
      return res.status(200).json({
        message: `Users with age >= ${minAgeNumber}`,
        count: filteredUsers.length,
        users: filteredUsers,
      });
    } else {
      return res.status(404).json({
        message: "no user found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
});

app.all("/*qwerty", (req, res) => {
  return res.status(404).json({ message: "wrong routing" });
});
app.listen(port, "127.0.0.1", () => {
  console.log("server is running");
});
