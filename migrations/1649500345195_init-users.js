/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "VARCHAR(30)",
      primaryKey: true,
    },
    username: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    password: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    fullname: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    access_token: {
      type: "TEXT",
      notNull: false,
    },
    refresh_token: {
      type: "TEXT",
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
};

exports.down = (pgm) => {
  pgm.dropTable("users");
};
