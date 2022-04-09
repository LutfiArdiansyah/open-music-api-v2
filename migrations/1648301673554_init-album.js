/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("albums", {
    id: {
      type: "VARCHAR(30)",
      primaryKey: true,
    },
    name: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    year: {
      type: "Int4",
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
};

exports.down = (pgm) => {
  pgm.dropTable("albums");
};
