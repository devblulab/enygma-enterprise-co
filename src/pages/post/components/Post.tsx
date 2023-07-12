import React from 'react';
import { Box, Typography } from '@material-ui/core';

import Header from './Header';
import Content from './Content';
import Comments from './Comments';

interface PostProps {
  posts: any[];
  onDeletePost: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onLike: (postId: string) => void;
  onShare?: (postId: string) => void; // Adicione a propriedade onShare
}

const Post: React.FC<PostProps> = ({ posts, onDeletePost, onComment, onLike, onShare }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" gutterBottom>
        Posts
      </Typography>
      {posts.length === 0 ? (
        <Typography variant="body1">Nenhum post disponível.</Typography>
      ) : (
        <ul style={{ listStyle: 'none', padding: '0' }}>
          {posts.map((post) => (
            <li
              key={post.id}
              style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}
            >
              <Header content={post.content} />
              <Content imageURL={post.imageURL} videoURL={post.videoURL} />
              <Comments
                postId={post.id}
                timestamp={post.timestamp}
                comments={post.comments}
                likes={post.likes}
                shares={post.shares}
                onDelete={() => onDeletePost(post.id)}
                onComment={onComment}
                onLike={() => onLike(post.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </Box>
  );
};

export default Post;
