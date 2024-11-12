// src/app/page.js
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.posts);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('게시글을 불러오는데 실패했습니다.');
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
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">게시판</h1>
      <Link 
        href="/write" 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        글쓰기
      </Link>
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="border p-4 rounded">
              <Link href={`/posts/${post.id}`}>
                <h2 className="text-xl font-semibold">{post.title}</h2>
              </Link>
              <p className="text-gray-600">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>게시글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}