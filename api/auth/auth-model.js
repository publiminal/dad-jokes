const db = require('../../data/dbConfig');

async function find() {
  /**
    Resolves to an ARRAY with all users.

    [
      {
        "id": 1,
        "username": "bob",
        "password": "admin"
      },
      {
        "user_id": 2,
        "username": "sue",
        "password": "instructor"
      }
    ]
   */

    const query = await db
      .select('id', 'username', 'password')
      return query
}

async function findBy(filter) {
  /**
    get all records
    Resolves to an ARRAY with all users that match the filter condition.
    [   
      {
        "id": 1,
        "username": "bob",
        "password": "$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq"
    }
    ]
   */
    const query = await db
    .select('id', 'username', 'password')
    .from('users')
    .where(filter)
    return query
}

async function findById(id) {
  /**
    Resolves to the user with the given id.

    {
      "user_id": 2,
      "username": "sue",
      "role_name": "instructor"
    }
   */
    const query = await db
    .select('id', 'username', 'password')
    .from('users')
    .where({id}).first()
    return query
}

/**

  {
    "user_id": 7,
    "username": "anna",
    "role_name": "team lead"
  }
 */
async function add(user) { 
    const [id] = await db('users').insert(user)
    return findById(id)
}

module.exports = {
  add,
  find,
  findBy,
  findById,
};
