import React, { useEffect, useState } from 'react';
import { collection, addDoc, deleteDoc, doc, getDoc, getFirestore, updateDoc, arrayUnion } from 'firebase/firestore';
import { app, storage } from '../../../logic/firebase/config/app';
import Colecao from '../../../logic/firebase/db/Colecao';
import { Box } from '@material-ui/core';

import NewPost from './NewPost';
import Post from './Post';

const db = getFirestore(app);
const postsCollectionRef = collection(db, 'posts');

const PostLogic: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    // Ao carregar o componente, consultar os posts do Firestore
    consultarPosts();
  }, []);

  const colecao = new Colecao();

  const consultarPosts = async () => {
    try {
      const posts = await colecao.consultar('posts');
      setPosts(posts);
    } catch (error) {
      console.error('Erro ao consultar os posts:', error);
    }
  };

  const criarPost = async (content: string, image: File | null, video: File | null) => {
    try {
      // Cria um novo documento na coleção "posts"
      const newPost = {
        content: content,
        timestamp: new Date(),
        likes: 0,
        shares: 0,
        comments: [],
        imageURL: '',
        videoURL: '',
      };

      const docRef = await addDoc(postsCollectionRef, newPost);

      // Faz upload da imagem, se selecionada
      if (image) {
        const imageRef = storage.ref().child(`posts/${docRef.id}/${image.name}`);
        await imageRef.put(image);
        const imageURL = await imageRef.getDownloadURL();
        newPost.imageURL = imageURL;
      }

      // Faz upload do vídeo, se selecionado
      if (video) {
        const videoRef = storage.ref().child(`posts/${docRef.id}/${video.name}`);
        await videoRef.put(video);
        const videoURL = await videoRef.getDownloadURL();
        newPost.videoURL = videoURL;
      }

      // Atualiza o documento com as URLs da imagem e do vídeo
      await updateDoc(docRef, {
        imageURL: newPost.imageURL,
        videoURL: newPost.videoURL,
      });

      // Atualiza a lista de posts após a criação
      consultarPosts();
    } catch (error) {
      console.error('Erro ao criar o post:', error);
    }
  };

  const deletarPost = async (postId: string) => {
    try {
      // Deleta o documento correspondente ao ID do post na coleção "posts"
      await deleteDoc(doc(postsCollectionRef, postId));
      console.log('Post deletado com sucesso!');

      // Atualiza a lista de posts após a exclusão
      consultarPosts();
    } catch (error) {
      console.error('Erro ao deletar o post:', error);
    }
  };

  const handleComment = async (postId: string, comment: string) => {
    try {
      const postDoc = doc(postsCollectionRef, postId);
      const postSnap = await getDoc(postDoc);
      const post = postSnap.data();
  
      if (post) {
        const updatedComments = [...post.comments, comment];
  
        await postDoc.update({
          comments: updatedComments,
        });
  
        // Atualiza a lista de posts após o comentário
        consultarPosts();
      }
    } catch (error) {
      console.error('Erro ao adicionar o comentário:', error);
    }
  };
  

  const handleLike = async (postId: string) => {
    try {
      const postDoc = doc(postsCollectionRef, postId);
      const postSnap = await getDoc(postDoc);
      const post = postSnap.data();

      if (post) {
        const updatedLikes = post.likes + 1;

        await updateDoc(postDoc, {
          likes: updatedLikes,
        });

        // Atualiza a lista de posts após a curtida
        consultarPosts();
      }
    } catch (error) {
      console.error('Erro ao adicionar a curtida:', error);
    }
  };

  const handleShare = async (postId: string) => {
    try {
      const postDoc = doc(postsCollectionRef, postId);
      const postSnap = await getDoc(postDoc);
      const post = postSnap.data();

      if (post) {
        const updatedShares = post.shares + 1;

        await updateDoc(postDoc, {
          shares: updatedShares,
        });

        // Atualiza a lista de posts após o compartilhamento
        consultarPosts();
      }
    } catch (error) {
      console.error('Erro ao adicionar o compartilhamento:', error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <NewPost onCreatePost
={criarPost} />
<Post
posts={posts}
onDeletePost={deletarPost}
onComment={handleComment}
onLike={handleLike}
onShare={handleShare} // Adicione a propriedade onShare ao componente Post
/>
</Box>
);
};

export default PostLogic;