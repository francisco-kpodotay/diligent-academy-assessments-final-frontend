// server.js
const qs = require("qs");
const jsonServer = require("json-server");
const server = jsonServer.create();
const path = require("path");
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();
const VALID_VOTES = ["?", 1, 2, 3, 5, 8, 13];
const { v4: uuidv4 } = require("uuid");

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.get("/rooms", async (req, res) => {
  const { _limit = 5, _page = 1, q } = req.query;

  await router.db.read(); 
  let rooms = router.db.get("rooms").value(); 

  if (q) {
    rooms = rooms.filter((room) =>
      room.name.toLowerCase().includes(q.toLowerCase())
    );
  }

  const total = rooms.length; 
  const limit = parseInt(_limit, 10);
  const page = parseInt(_page, 10); 
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedRooms = rooms.slice(startIndex, endIndex);

  res.jsonp({
    data: paginatedRooms,
    total,
    page_size: limit,
    page_number: page,
  });
});

server.get("/votes", async (req, res) => {
  const { storyId } = req.query;
  await router.db.read();
  const users = router.db.get("users").value();
  const story = router.db.get("stories").find({ id: storyId }).value();

  res.jsonp({
    data: users.map((user) => {
      let i = Math.floor(Math.random() * VALID_VOTES.length);
      return {
        storyId: story.id,
        userId: user.id,
        vote: VALID_VOTES[i],
      };
    }),
  });
});

const isValidEmail = (email) => {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
};

server.post("/users", async (req, res) => {
  const { firstName, lastName, email } = req.body;

  if (!firstName || firstName.length < 2) {
    return res
      .status(400)
      .jsonp({ error: "First name must be at least 2 characters long." });
  }
  if (!lastName || lastName.length < 2) {
    return res
      .status(400)
      .jsonp({ error: "Last name must be at least 2 characters long." });
  }
  if (!email || !isValidEmail(email)) {
    return res.status(400).jsonp({ error: "Invalid email format." });
  }

  await router.db.read();

  // Enable the code below if you want to prevent registration with the same email
  /* const existingUser = router.db.get('users').find({ email }).value();
  if (existingUser) {
    return res.status(409).jsonp({ error: 'Email is already registered.' });
  } */

  const id = uuidv4();
  const newUser = { id, firstName, lastName, email };
  router.db.get("users").push(newUser).write();
  res.status(201).jsonp({ success: true, user: newUser });
});

const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

server.post('/rooms', (req, res) => {
  const { name, userId, createdAt } = req.body;

  if (!name || name.length < 5) {
    return res.status(400).json({ error: 'Name must be at least 5 characters long.' });
  }

  const userExists = router.db.get('users').find({ id: userId }).value();
  if (!userExists) {
    return res.status(400).json({ error: 'Invalid userId. User does not exist.' });
  }

  if (!createdAt || !isValidDate(createdAt)) {
    return res.status(400).json({ error: 'Invalid createdAt. Format must be YYYY-MM-DD.' });
  }

  const newRoom = {
    id: uuidv4(),
    name,
    userId,
    createdAt,
  };

  router.db.get('rooms').push(newRoom).write();
  res.status(201).json(newRoom);
});

server.delete("/stories/:id", async (req, res) => {
  const { id } = req.params;
  await router.db.read();
  router.db.get("stories").remove({ id: +id }).write();

  res.jsonp({ success: true });
});

router.render = (req, res) => {
  const params = qs.parse(req.originalUrl.split("?")[1], {
    ignoreQueryPrefix: true,
  });
  const page = params._page || 1;
  const limit = params._limit || 5;

  res.jsonp({
    data: res.locals.data,
    total: res.locals.data.length,
    page_size: +limit,
    page_number: +page,
  });
};

server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});
