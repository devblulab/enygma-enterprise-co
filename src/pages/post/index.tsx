import React from 'react';
import PostComponent from './components/PostLogic';
import Cabecalho from '../../components/template/Cabecalho';

const PostPage: React.FC = () => {
  return (
    <>
      <Cabecalho />
      <PostComponent />
    </>
  );
};

export default PostPage;