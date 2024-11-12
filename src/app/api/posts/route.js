// src/app/api/posts/route.js
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  let connection;
  try {
    console.log('Attempting to connect to database...');
    connection = await db.getConnection();
    console.log('Connected to database successfully');

    const [rows] = await connection.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    );
    console.log(`Found ${rows.length} posts`);

    return NextResponse.json({
      success: true,
      posts: rows
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      error: '게시글을 불러오는데 실패했습니다.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { 
      status: 500 
    });
  } finally {
    if (connection) {
      console.log('Releasing database connection');
      connection.release();
    }
  }
}

export async function POST(request) {
  let connection;
  try {
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json({
        success: false,
        error: '제목과 내용은 필수입니다.'
      }, { 
        status: 400 
      });
    }

    connection = await db.getConnection();
    
    const [result] = await connection.query(
      'INSERT INTO posts (title, content) VALUES (?, ?)',
      [title, content]
    );

    return NextResponse.json({
      success: true,
      data: {
        id: result.insertId,
        message: '게시글이 작성되었습니다.'
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      error: '게시글 작성에 실패했습니다.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { 
      status: 500 
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}