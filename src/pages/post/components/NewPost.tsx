import React, { useState } from 'react';
import { Box, Button, TextField } from '@material-ui/core';

interface NewPostProps {
  onCreatePost: (content: string, image: File | null, video: File | null) => void;
}

const NewPost: React.FC<NewPostProps> = ({ onCreatePost }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const handleCreatePost = () => {
    onCreatePost(content, image, video);

    // Limpa os campos de conteúdo, imagem e vídeo
    setContent('');
    setImage(null);
    setVideo
    (null);
};

return (
<Box display="flex" flexDirection="column" alignItems="center">
<TextField
label="Conteúdo"
value={content}
onChange={(e) => setContent(e.target.value)}
fullWidth
variant="outlined"
style={{ marginBottom: '10px' }}
/>
<input
type="file"
accept="image/"
onChange={(e) => setImage(e.target.files?.[0] || null)}
style={{ marginBottom: '10px' }}
/>
<input
type="file"
accept="video/"
onChange={(e) => setVideo(e.target.files?.[0] || null)}
style={{ marginBottom: '10px' }}
/>
<Button variant="contained" color="primary" onClick={handleCreatePost} style={{ marginBottom: '10px' }}>
Criar Post
</Button>
</Box>
);
};

export default NewPost;