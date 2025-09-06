import { useEffect, useState } from "react";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(() => setOffline(true));
  }, []);

  return (
    <div className="p-4">
      {offline && (
        <p className="text-red-500">You are offline. Showing cached data.</p>
      )}
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id} className="p-2 bg-gray-100 rounded">
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
