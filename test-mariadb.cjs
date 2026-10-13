require('dotenv').config();

const mariadb = require('mariadb');

async function main() {
  let conn;
  let pool;

  try {
    pool = mariadb.createPool({
      host: process.env.MYSQL_HOST || '127.0.0.1',
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER || 'salary_app',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'salary_manager',
      allowPublicKeyRetrieval: true,
      connectionLimit: 1,
      acquireTimeout: 5000,
    });

    conn = await pool.getConnection();
    const rows = await conn.query('SELECT 1 AS ok');

    console.log('MariaDB 驱动连接成功：', rows[0]);
  } catch (err) {
    console.error('MariaDB 驱动连接失败：');
    console.dir(err, {
      depth: 10,
      colors: false,
    });

    if (err.cause) {
      console.error('底层 cause：');
      console.dir(err.cause, {
        depth: 10,
        colors: false,
      });
    }

    process.exitCode = 1;
  } finally {
    if (conn) conn.release();
    if (pool) await pool.end();
  }
}

main();
