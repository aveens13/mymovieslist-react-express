exports.home = (req, res) => {
  res.send("Hello World");
};

exports.movies = (req, res) => {
  let dataItem = [];
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "1685851e7dmshd7ddc87bd361f84p1751ffjsn557a9a95f214",
      "X-RapidAPI-Host": "imdb8.p.rapidapi.com",
    },
  };

  fetch("https://imdb8.p.rapidapi.com/auto-complete?q=planet", options)
    .then((response) => response.json())
    .then((data) => {
      res.send(data);
    })
    .catch((err) => console.error(err));
};
