
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, username: 'Alice', password: 'pass123'},
        {id: 2, username: 'Goose', password: 'pass123'},
        {id: 3, username: 'Ethan', password: 'pass123'}
      ]);
    });
};
