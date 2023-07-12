import React, { useState } from 'react';
import Cabecalho from '../../components/template/Cabecalho';
import ListPost from './component/ListPost';
import ItemList from './component/ItemList';

interface Item {
  id: string;
  nome: string;
  quantidade: number;
  localCompra: string;
}

const PostPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  const addItem = (newItem: Item) => {
    setItems([...items, newItem]);
  };

  return (
    <>
      <Cabecalho />
      <ListPost setItems={addItem} />
      <ItemList items={items} />
    </>
  );
};

export default PostPage;
