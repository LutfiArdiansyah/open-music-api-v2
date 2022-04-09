/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("collaborations", {
    id: {
      type: "VARCHAR(30)",
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(30)",
      notNull: true,
    },
    user_id: {
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

  pgm.addConstraint("collaborations", "fk_collaborations_2_playlists", {
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

  pgm.addConstraint("collaborations", "fk_collaborations_2_users", {
    foreignKeys: [
      {
        columns: ["user_id"],
        references: "users(id)",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        match: "SIMPLE",
      },
    ],
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint("collaborations", "fk_collaborations_2_playlists", {
    ifExists: true,
  });

  pgm.dropConstraint("collaborations", "fk_collaborations_2_users", {
    ifExists: true,
  });

  pgm.dropTable("collaborations");
};
