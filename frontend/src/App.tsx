import React, { useState } from 'react';
import { Box, Button, Container, Grid, Paper, TextField, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { backend } from 'declarations/backend';

const CalculatorButton = styled(Button)(({ theme }) => ({
  fontSize: '1.25rem',
  padding: theme.spacing(2),
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num: string) => {
    setDisplay((prev) => (prev === '0' ? num : prev + num));
  };

  const handleOperationClick = (op: string) => {
    if (prevValue === null) {
      setPrevValue(parseFloat(display));
      setDisplay('0');
    } else {
      handleEqualsClick();
    }
    setOperation(op);
  };

  const handleEqualsClick = async () => {
    if (prevValue !== null && operation) {
      setLoading(true);
      try {
        const result = await backend.calculate(operation, prevValue, parseFloat(display));
        setDisplay(result.toString());
        setPrevValue(null);
        setOperation('');
      } catch (error) {
        setDisplay('Error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setOperation('');
    setPrevValue(null);
  };

  const handleBackspace = () => {
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
        <Box sx={{ mb: 2, position: 'relative' }}>
          <TextField
            fullWidth
            variant="outlined"
            value={display}
            InputProps={{
              readOnly: true,
              sx: { fontSize: '2rem', textAlign: 'right' },
            }}
          />
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 8,
                marginTop: '-12px',
              }}
            />
          )}
        </Box>
        <Grid container spacing={1}>
          {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'].map((btn) => (
            <Grid item xs={3} key={btn}>
              <CalculatorButton
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => handleNumberClick(btn)}
              >
                {btn}
              </CalculatorButton>
            </Grid>
          ))}
          <Grid item xs={3}>
            <CalculatorButton
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleEqualsClick}
            >
              =
            </CalculatorButton>
          </Grid>
          {['+', '-', '*', '/'].map((op) => (
            <Grid item xs={3} key={op}>
              <CalculatorButton
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => handleOperationClick(op)}
              >
                {op}
              </CalculatorButton>
            </Grid>
          ))}
          <Grid item xs={6}>
            <CalculatorButton
              fullWidth
              variant="contained"
              color="error"
              onClick={handleClear}
            >
              C
            </CalculatorButton>
          </Grid>
          <Grid item xs={6}>
            <CalculatorButton
              fullWidth
              variant="contained"
              color="warning"
              onClick={handleBackspace}
            >
              <BackspaceIcon />
            </CalculatorButton>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default App;