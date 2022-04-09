/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("playlist_songs", {
    id: {
      type: "VARCHAR(30)",
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(30)",
      notNull: true,
    },
    song_id: {
      type: "VARCHAR(30)",
      notNull: true,
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

  pgm.addConstraint("playlist_songs", "fk_playlist_songs_2_playlists", {
    foreignKeys: [
      {
        columns: ["playlist_id"],
        references: "playlists(id)",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        match: "SIMPLE",
      },
    ],
  });

  pgm.addConstraint("playlist_songs", "fk_playlist_songs_2_songs", {
    foreignKeys: [
      {
        columns: ["song_id"],
        references: "songs(id)",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        match: "SIMPLE",
      },
    ],
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint("playlist_songs", "fk_playlist_songs_2_playlists", {
    ifExists: true,
  });

  pgm.dropConstraint("playlist_songs", "fk_playlist_songs_2_songs", {
    ifExists: true,
  });

  pgm.dropTable("playlist_songs");
};
