// ------------------------------------------------------------
// Lab 01 - From the terminal to Node.js
// ------------------------------------------------------------
// In session 1 you typed MongoDB commands directly in mongosh:
//
//   db.books.insertOne({ title: "Dune", author: "Frank Herbert" })
//   db.books.find()
//
// Here you will write the exact same operations, but as a Node.js
// script. The MongoDB driver translates your JavaScript calls into
// the same commands mongosh sends to the database.
// ------------------------------------------------------------

const { MongoClient } = require("mongodb");

// The connection string tells the driver where MongoDB is running.
// "mongodb://localhost:27017" is the default for a local installation.
const URI = "mongodb://localhost:27017";

// MongoClient is the entry point to the driver.
// You create one client per application.
const client = new MongoClient(URI);

// ------------------------------------------------------------
// Everything that talks to the database must happen inside an
// async function, because network calls take time.
// "await" pauses execution until the operation completes.
// ------------------------------------------------------------
async function main() {
  // Open the connection to MongoDB.
  await client.connect();

  // Select the database and collection to work with.
  // If they do not exist yet, MongoDB creates them on first write.
  const books = client.db("book_db").collection("books");

  // Start fresh on every run.
  await books.deleteMany({});

  // ----------------------------------------------------------
  // TODO 1 - insertOne with an embedded object
  // ----------------------------------------------------------
  // In mongosh you would write:
  //   db.books.insertOne({ title: "...", publisher: { name: "...", country: "..." } })
  //
  // Do the same here. Insert one book that has a publisher field
  // containing an embedded object with at least a name and a country.
  await books.insertOne({
    title: "Le Petit Prince",
    publisher: {
      name: "Antoine de Saint-Exupéry",
      country: "France"
    }
  });
  // ----------------------------------------------------------
  // TODO 2 - insertOne with an array
  // ----------------------------------------------------------
  // Insert one book that has a tags field containing
  // an array of at least 3 strings.
  await books.insertOne({
    title: "The Plague",
    author: "Albert Camus",
    tags: ["philosophy", "absurdist", "novel"]
  });
  // ----------------------------------------------------------
  // TODO 3 - insertMany
  // ----------------------------------------------------------
  // Insert at least 5 books in a single call using insertMany.
  // Include a mix: some with a publisher object, some with tags, some with both.
  await books.insertMany([
    {
      title: "The picture of Dorian Gray",
      publisher: "Le Livre de Poche (unless publisher means author)"
    },
    {
      title: "Code: The Hidden Language of Computer Hardware and Software",
      publisher: "Microsoft",
      tags: ["IT", "Computers", "Programming"]
    },
    {
      title: "Pinball, 1973",
      tags: ["Fiction", "Contemporary"]
    },
    {
      title: "Color and Light: A Guide for the Realist Painter",
      publisher: "Andrews McMeel Publishing",
    },
    {
      title: "The Hunchback of Notre-Dame",
      publisher: "Signet Classics",
      tags: ["Gothic", "Romance"]
    }]
  );

  // ----------------------------------------------------------
  // TODO 4 - find all documents
  // ----------------------------------------------------------
  // Retrieve every document in the collection and log each title.
  // Hint: find() returns a cursor - call .toArray() to get an array.
  let cursor = await books.find();
  let arr = await cursor.toArray();
  console.log('Book titles:');
  for (el of arr) {
    console.log(el.title);
  }
  // ----------------------------------------------------------
  // TODO 5 - findOne with dot notation
  // ----------------------------------------------------------
  // Find the first book whose publisher.country is "France".
  // Dot notation lets you filter on a field inside an embedded object:
  //   { "publisher.country": "France" }
  // Log the title of the result.
  let firstbook = await books.findOne({"publisher.country" : "France"});
  console.log("exercise 5:", firstbook.title);
  // ----------------------------------------------------------
  // TODO 6 - find with a filter
  // ----------------------------------------------------------
  // Find all books whose publisher.country is "France".
  // Log how many there are and list their titles.
  cursor = await books.find({"publisher.country" : "France"});
  let allbooks = await cursor.toArray();
  console.log("exercise 6:", allbooks.length, "books");
  for (el of allbooks) {
    console.log(el.title)
  };
  // ----------------------------------------------------------
  // TODO 7 - find with $exists
  // ----------------------------------------------------------
  // Find all books that have a tags field, regardless of its value.
  //   { tags: { $exists: true } }
  // Log each title and its tags array.
  cursor = await books.find({tags: {$exists: true}});
  taggedbooks = await cursor.toArray();
  console.log("Exercise 7: ");
  for (el of taggedbooks) {
    console.log(el.title, el.tags)
  };
  // Always close the connection when you are done.
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
