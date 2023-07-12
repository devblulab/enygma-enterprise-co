import React from 'react';
import Content from './components/Content';
import Cabecalho from '../../components/template/Cabecalho';

const PostPage: React.FC = () => {
  return (
    <>
      <Cabecalho />
      <Content />
    </>
  );
};

export default PostPage;