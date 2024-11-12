// src/app/api/posts/[id]/route.js
import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET 메서드 핸들러
export async function GET(request, { params }) {
  let connection;
  try {
    const { id } = params;
    console.log('Fetching post with ID:', id);

    connection = await db.getConnection();
    
    const [rows] = await connection.query(
      'SELECT * FROM posts WHERE id = ?',
      [id]
    );
    console.log(`Found post:`, rows[0] || 'Not found');

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: '게시글을 찾을 수 없습니다.'
      }, { 
        status: 404 
      });
    }

    return NextResponse.json({
      success: true,
      post: rows[0]
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
      connection.release();
    }
  }
}

// PUT 메서드 핸들러
export async function PUT(request, { params }) {
  let connection;
  try {
    const { id } = params;
    const { title, content } = await request.json();

    connection = await db.getConnection();
    
    const [result] = await connection.query(
      'UPDATE posts SET title = ?, content = ? WHERE id = ?',
      [title, content, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({
        success: false,
        error: '게시글을 찾을 수 없습니다.'
      }, { 
        status: 404 
      });
    }

    return NextResponse.json({
      success: true,
      message: '게시글이 수정되었습니다.'
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      error: '게시글 수정에 실패했습니다.'
    }, { 
      status: 500 
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// DELETE 메서드 핸들러
export async function DELETE(request, { params }) {
  let connection;
  try {
    const { id } = params;

    connection = await db.getConnection();
    
    const [result] = await connection.query(
      'DELETE FROM posts WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({
        success: false,
        error: '게시글을 찾을 수 없습니다.'
      }, { 
        status: 404 
      });
    }

    return NextResponse.json({
      success: true,
      message: '게시글이 삭제되었습니다.'
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      error: '게시글 삭제에 실패했습니다.'
    }, { 
      status: 500 
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}