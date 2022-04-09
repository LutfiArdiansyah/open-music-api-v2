const mapDtoAlbum = ({ id, name, year }) => ({
  id,
  name,
  year,
});

const mapDtoSong = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

module.exports = { mapDtoAlbum, mapDtoSong };
