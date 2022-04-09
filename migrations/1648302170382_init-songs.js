/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("songs", {
    id: {
      type: "VARCHAR(30)",
      primaryKey: true,
    },
    title: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    year: {
      type: "Int4",
      notNull: true,
    },
    genre: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    performer: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    duration: {
      type: "Int4",
      notNull: false,
    },
    album_id: {
      type: "VARCHAR(30)",
      notNull: false,
    },
    created_at: {
      type: "timestamp without time zone",
      notNull: true,
    },
    updated_at: {
      type: "timestamp without time zone",
      notNull: true,
    },
  });

  pgm.addConstraint("songs", "fk_songs_2_albums", {
    foreignKeys: [
      {
        columns: ["album_id"],
        references: "albums(id)",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        match: "SIMPLE",
      },
    ],
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint("songs", "fk_songs_2_albums", { ifExists: true });
  pgm.dropTable("songs");
};
