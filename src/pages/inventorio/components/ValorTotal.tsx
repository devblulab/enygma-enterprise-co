import React from 'react';
import { Paper, Typography } from '@material-ui/core';

interface ValorTotalProps {
  valorTotal: string;
}

const ValorTotal: React.FC<ValorTotalProps> = ({ valorTotal }) => {
  return (
    <Paper elevation={3} className="p-4" style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
      <Typography variant="h6">Valor total do estoque:</Typography>
      <Typography variant="h4" color="primary">
        R$ {valorTotal}
      </Typography>
    </Paper>
  );
};

export default ValorTotal;
