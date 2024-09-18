import React from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-solidity';
import 'prismjs/themes/prism-tomorrow.css';

import { IconChecklist, IconPaperclip } from '@tabler/icons-react';

interface CustomCodeEditorProps {
  contract: string;
  setContract: React.Dispatch<React.SetStateAction<string>>;
  analyzeContract: () => Promise<void>;
  loading: boolean;
}

const highlightWithPrism = (code: string) => {
  return Prism.highlight(code, Prism.languages.solidity, 'solidity');
};

const isValidSolidityContract = (code: string) => {
  return (
    code.startsWith('// SPDX-License-Identifier:') &&
    code.includes('pragma solidity ^')
  );
};
const ContractInput: React.FC<CustomCodeEditorProps> = ({
  contract,
  setContract,
  analyzeContract,
  loading
}) => {
  const handleAnalyze = () => {
    if (!isValidSolidityContract(contract)) {
      alert('Invalid solidity contract');
      return;
    }
    analyzeContract();
  };

  return (
    <div id='editor' className='relative lg:w-4/6 w-full mx-auto'>
      <p className='text-neutral-300 text-base mb-4 text-center'>
        Copy your contract code into the input below
      </p>
      <div
        className='border outline-none border-r-2 border-neutral-800 rounded-2xl p-6 bg-neutral-800 text-neutral-200 '
        style={{ height: '450px', overflowY: 'auto' }}
      >
        <Editor
          value={contract}
          onValueChange={(code) => setContract(code)}
          highlight={(code) => highlightWithPrism(code)}
          padding={15}
          textareaId='code-editor'
          textareaClassName='outline-none'
          style={{
            fontFamily: '"Fira Mono", monospace',
            fontSize: 17,
            minHeight: '100%',
            background: 'transparent',
            color: 'inherit'
          }}
        />
      </div>
      <div className='absolute bottom-px inset-x-px p-2 rounded-b-md bg-neutral-800 '>
        <div className='flex justify-between items-center pb-3'>
          <div className='flex items-center'>
            <button
              type='button'
              className='inline-flex flex-shrink-0 justify-center items-center size-8 rounded-lg  hover:text-blue-600 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-300'
            ></button>
          </div>

          <div className='flex items-center cursor-pointer'>
            <button
              onClick={handleAnalyze}
              type='button'
              className='flex flex-row rounded-full text-white bg-pink-600  justify-center items-center hover:bg-pink-400 space-x-2 px-6 py-1.5 gap-x-1  focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 '
            >
              {loading ? (
                <p className='animate-pulse'>Loading...</p>
              ) : (
                <span>Audit</span>
              )}
              <IconChecklist size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContractInput;
