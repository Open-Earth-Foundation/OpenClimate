require("dotenv").config();
const init = require("../orm/init.ts");

async function main() {
  const sequelize = init.connect();

  await sequelize.query(
    'CREATE TEMP TABLE IF NOT EXISTS "LatestPopulationUpdate" ( LIKE "LatestPopulation" );'
  );

  await sequelize.query('DELETE FROM "LatestPopulationUpdate";');

  await sequelize.query(
    'INSERT INTO "LatestPopulationUpdate" (actor_id, year, population, created, last_updated, datasource_id) ' +
      'SELECT actor_id, year, population, created, last_updated, datasource_id FROM "Population" p1 ' +
      'WHERE year = (SELECT MAX(year) FROM "Population" p2 WHERE p1.actor_id = p2.actor_id);'
  );

  await sequelize.query(
    'INSERT INTO "LatestPopulation" (actor_id, year, population, created, last_updated, datasource_id) ' +
      "SELECT actor_id, year, population, created, last_updated, datasource_id " +
      'FROM "LatestPopulationUpdate" ' +
      "ON CONFLICT (actor_id) DO UPDATE SET " +
      "year = EXCLUDED.year, " +
      "population = EXCLUDED.population, " +
      "created = EXCLUDED.created, " +
      "last_updated = EXCLUDED.last_updated, " +
      "datasource_id = EXCLUDED.datasource_id;"
  );

  await sequelize.query('DROP TABLE IF EXISTS "LatestPopulationUpdate";');

  await init.disconnect();
}

main()
  .then(() => {
    console.log("Latest population updated");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
