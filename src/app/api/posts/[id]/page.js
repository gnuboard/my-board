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

  useEffect(() => {
    fetchPost();
  }, [params.id]); // params.id를 의존성 배열에 추가

  const fetchPost = async () => {
    try {
      console.log('Fetching post with id:', params.id); // 디버깅용 로그
      
      const response = await fetch(`/api/posts/${params.id}`);
      console.log('Response status:', response.status); // 디버깅용 로그
      
      const data = await response.json();
      console.log('Response data:', data); // 디버깅용 로그

      if (!response.ok) {
        throw new Error(data.error || '게시글을 불러오는데 실패했습니다.');
      }

      if (data.success) {
        setPost(data.post);
      } else {
        throw new Error(data.error || '게시글을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-red-500">{error}</div>
        <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div>게시글을 찾을 수 없습니다.</div>
        <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          ← 목록으로
        </Link>
      </div>
      
      <article className="border rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-600 mb-4">
          {new Date(post.created_at).toLocaleDateString()}
        </div>
        <div className="prose max-w-none mb-6 whitespace-pre-wrap">
          {post.content}
        </div>
      </article>
    </div>
  );
}