'use client';

import ContractInput from '@/components/contract-input';
import { Header } from '@/components/Header';
import ResultModal from '@/components/result-modal';
import { analyzeContract } from '@/lib/ai-prompt';
import { useState } from 'react';

export default function Home() {
  const [contract, setContract] = useState('');
  const [results, setResults] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const analyzeSmartContract = async () => {
    const data = await analyzeContract(contract, setResults, setLoading);
    if (data) {
      setIsModalOpen(true);
    }
  };
  console.log(results);
  return (
    <main className='flex min-h-screen w-full flex-col items-center justify-between p-24'>
      <Header />
      <ContractInput
        analyzeContract={analyzeSmartContract}
        contract={contract}
        setContract={setContract}
        loading={loading}
      />
      <ResultModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        results={results}
        loading={loading}
      />
    </main>
  );
}
