/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("playlists", {
    id: {
      type: "VARCHAR(30)",
      primaryKey: true,
    },
    name: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    owner: {
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

  pgm.addConstraint("playlists", "fk_playlists_2_users", {
    foreignKeys: [
      {
        columns: ["owner"],
        references: "users(id)",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        match: "SIMPLE",
      },
    ],
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint("playlists", "fk_playlists_2_users", { ifExists: true });

  pgm.dropTable("playlists");
};
