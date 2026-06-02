// https-test.js
fetch("https://generativelanguage.googleapis.com")
  .then(async (res) => {
    console.log("Status:", res.status);
    console.log("Headers received successfully");
  })
  .catch((err) => {
    console.error("FETCH ERROR:", err);
  });