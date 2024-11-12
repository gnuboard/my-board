// src/lib/db.js
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 데이터베이스 연결 테스트 함수
async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('✅ Database connected successfully');
    
    // 테이블 존재 여부 확인
    const [rows] = await connection.query(`
      SHOW TABLES LIKE 'posts'
    `);
    
    if (rows.length === 0) {
      console.log('Creating posts table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS posts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Posts table created successfully');
    } else {
      console.log('✅ Posts table already exists');
    }

    connection.release();
  } catch (err) {
    console.error('❌ Database connection error:', err);
    throw err;
  }
}

// 연결 테스트 실행
testConnection().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

export default db;