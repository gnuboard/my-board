// src/app/posts/[id]/page.js
'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); // 삭제 상태 추가

  useEffect(() => {
    if (params.id) {
      fetchPost(params.id);
    }
  }, [params.id]);

  // 게시글 가져오기 함수
  const fetchPost = async (postId) => {
    try {
      console.log(`Fetching post with ID: ${postId}`);
      
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      if (!data.success) {
        throw new Error(data.error || '게시글 데이터가 올바르지 않습니다.');
      }

      if (!data.post) {
        throw new Error('게시글이 존재하지 않습니다.');
      }

      setPost(data.post);
      setError(null);
    } catch (err) {
      console.error('Error details:', {
        message: err.message,
        stack: err.stack
      });
      setError(err.message || '게시글을 불러오는데 실패했습니다.');
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  // 삭제 처리 함수
  const handleDelete = async () => {
    if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '게시글 삭제에 실패했습니다.');
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg">로딩 중...</div>
            <div className="text-sm text-gray-500">게시글 ID: {params.id}</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">오류 발생</p>
          <p>{error}</p>
        </div>
        <Link 
          href="/"
          className="text-blue-500 hover:underline inline-flex items-center"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p>게시글을 찾을 수 없습니다.</p>
        </div>
        <Link 
          href="/"
          className="text-blue-500 hover:underline inline-flex items-center"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <Link 
          href="/"
          className="text-blue-500 hover:underline inline-flex items-center"
        >
          ← 목록으로
        </Link>
      </div>
      
      <article className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="text-gray-600 mb-4">
            작성일: {new Date(post.created_at).toLocaleDateString()}
          </div>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{post.content}</div>
          </div>
        </div>
      </article>

      <div className="mt-6 space-x-4">
        <Link
          href={`/posts/${params.id}/edit`}
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          수정
        </Link>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`inline-block bg-red-500 text-white px-4 py-2 rounded 
            ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`}
        >
          {isDeleting ? '삭제 중...' : '삭제'}
        </button>
        <Link
          href="/"
          className="inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          목록
        </Link>
      </div>
    </div>
  );
}