import { useEffect, useState } from 'react';
import './App.css';
import { getHealth } from './services/api';

function App() {
  const [status, setStatus] = useState<string>('loading');

  useEffect(() => {
    async function checkApi() {
      setStatus('loading');

      try {
        await getHealth();
        setStatus('success');
      } catch {
        setStatus('error');
      }
    }

    checkApi();
  }, []);

  return (
    <>
      <h1>Career Vault</h1>
      <p>Frontend initialized successfully.</p>
      <p>
        {status === 'success'
          ? 'API está funcionando corretamente.'
          : status === 'error'
            ? 'Falha na conexão com a API.'
            : 'Verificando conexão...'}
      </p>
    </>
  );
}

export default App;
