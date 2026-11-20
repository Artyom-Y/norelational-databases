const { MongoClient } = require("mongodb");

const URI = "mongodb://localhost:27017";
const client = new MongoClient(URI);

// You will understand this boilerplate in session 6.
// For now, your job is to fill in the seven TODOs below.

async function main() {
  await client.connect();
  const users = client.db("blog_db").collection("users");

  await users.deleteMany({});

  // TODO 1: insert a user with an embedded address object.
  // The address must have at least a city and a country field.
  await users.insertOne({
    name: "Artem",
    address: {
      country: "France",
      city: "Paris"
    }
  })

  // TODO 2: insert a user with a skills array containing at least 3 items.
  await users.insertOne({
    name: "Diana",
    skills: ["coding", "embroidery", "cycling"]
  })

  // TODO 3: use insertMany to insert at least 5 users in a single call.
  // Requirements:
  //   - At least 2 users must have address.country set to "France"
  //   - At least 2 users must have a skills array with at least 1 item
  await users.insertMany([
    {
      name: "Mihail",
      address: {
        country: "Russia",
        city: "Novosibirsk"
      },
      skills: ["fishing", "cooking"]
    },
    {
      name: "Abigail",
      address: {
        country: "France",
        city: "Dijon"
      }
    },
    {
      name: "Tom",
      skills: ["photography", "singing"]
    },
    {
      name: "Jean",
      address: {
        country: "France",
        city: "Bordeaux"
      }
    },
    {
      name: "Frank",
      address: {
        country: "USA",
        city: "Bridgeport, Connecticut"
      },
      skills: ["sculpting"]
    }]
  )

  // TODO 4: retrieve all documents and log each user's name.
  let cursor = await users.find();
  let arr = await cursor.toArray();
  console.log('Users\' names:');
  for (el of arr) {
    console.log(el.name);
  }

  // TODO 5: use dot notation to find the user whose address.city is "Paris" and log the result.
  cursor = await users.find({ "address.city": "Paris" });
  arr = await cursor.toArray();
  console.log("Users from Paris: ");
  console.log(arr);
  // TODO 6: find all users whose address.country is "France" and log their names.
  cursor = await users.find({ "address.country": "France" });
  arr = await cursor.toArray();
  console.log("Users from France: ");
  for (el of arr) {
    console.log(el.name);
  }

  // TODO 7: find all users who have a skills field and log their names.
  cursor = await users.find({ skills: { $exists: true } });
  arr = await cursor.toArray();
  console.log("Users with skills: ");
  for (el of arr) {
    console.log(el.name)
  };


  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
