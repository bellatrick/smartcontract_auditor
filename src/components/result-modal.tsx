'use client';

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import {
  IconChecklist,
  IconChevronDown,
  IconChevronUp,
  IconDetails,
  IconGauge
} from '@tabler/icons-react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';

interface ResultsModalProps {
  isOpen: boolean;
  closeModal: () => void;
  loading: boolean;
  results: any;
}

const ResultModal: React.FC<ResultsModalProps> = ({
  isOpen,
  closeModal,
  loading,
  results
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection((prevExpandedSection) =>
      prevExpandedSection === section ? null : section
    );
  };
  return (
    <Dialog
      open={isOpen || loading}
      onClose={closeModal}
      className='fixed inset-0 z-10 flex items-center justify-center'
    >
      <div
        className='fixed inset-0 bg-black opacity-50'
        aria-hidden='true'
      ></div>

      <div className='relative bg-neutral-900 rounded-2xl overflow-hidden shadow-xl transform transition-all max-w-lg w-full p-8 space-y-8 z-60'>
        {loading ? (
          <div className='flex flex-col items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 50 50'
              width='50'
              height='50'
            >
              <circle
                cx='25'
                cy='25'
                r='20'
                stroke='#3498db'
                strokeWidth='4'
                fill='none'
              />
              <circle
                cx='25'
                cy='25'
                r='20'
                stroke='#3498db'
                strokeWidth='4'
                fill='none'
                strokeDasharray='31.4 31.4'
                strokeLinecap='round'
              >
                <animateTransform
                  attributeName='transform'
                  type='rotate'
                  values='0 25 25;360 25 25'
                  dur='1s'
                  repeatCount='indefinite'
                />
              </circle>
            </svg>
            <p className='mt-4 text-lg text-gray-300'>
              Analyzing smart contract...
            </p>
          </div>
        ) : (
          results && (
            <div className=' rounded-2xl max-h-[400px] overflow-y-scroll overflow-x-hidden transform transition-all max-w-3xl w-full p-8 space-y-8 z-100'>
              <div className='space-y-8'>
                <div className='flex justify-between items-start'>
                  <h2 className='text-3xl font-bold text-gray-100'>
                    Audit Result
                  </h2>
                </div>

                <div className='text-left'>
                  <h3 className='text-xl space-x-2 cursor-pointer flex items-center justify-between mb-4 text-gray-200'></h3>
                  <div
                    onClick={() => toggleSection('audit_report')}
                    className='space-x-2 mb-5 text-white flex justify-between items-center'
                  >
                    <IconChecklist size={24} />
                    <span className=''>Audit Report</span>

                    {expandedSection === 'audit_report' ? (
                      <IconChevronUp size={24} />
                    ) : (
                      <IconChevronDown size={24} />
                    )}
                  </div>

                  {expandedSection === 'audit_report' && (
                    <p className='text-base text-gray-300'>
                      {results?.['audit_report']}
                    </p>
                  )}
                </div>

                <div className='text-left'>
                  <h3 className='text-xl space-x-2 cursor-pointer flex items-center justify-between mb-4 text-gray-200'></h3>
                  <div
                    onClick={() => toggleSection('suggestion')}
                    className='space-x-2 mb-5 text-white flex justify-between items-center'
                  >
                    <IconDetails size={24} />
                    <span className=''>Suggestion for Improvement</span>

                    {expandedSection === 'suggestion' ? (
                      <IconChevronUp size={24} />
                    ) : (
                      <IconChevronDown size={24} />
                    )}
                  </div>
                  {expandedSection === 'suggestion' && (
                    <p className='text-base text-gray-300'>
                      {results?.['suggestion']}
                    </p>
                  )}
                </div>

                <div className='text-left'>
                  <h3 className='text-xl space-x-2 cursor-pointer flex items-center justify-between mb-4 text-gray-200'></h3>
                  <div
                    onClick={() => toggleSection('metrics')}
                    className='space-x-2 mb-5 text-white flex justify-between items-center'
                  >
                    <IconGauge size={24} />
                    <span className=''>Metrics</span>

                    {expandedSection === 'metrics' ? (
                      <IconChevronUp size={24} />
                    ) : (
                      <IconChevronDown size={24} />
                    )}
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {expandedSection === 'metrics' &&
                      results?.['metrics'].map(({ metric, score }: any) => {
                        let color;
                        if (score >= 8) {
                          color = '#4cef50';
                        } else if (score >= 5) {
                          color = '#ffe33b';
                        } else color = '#f44336';
                        return (
                          <div
                            key={metric}
                            className='flex flex-col items-center'
                          >
                            <div className='w-24 h-24 flex items-center justify-center'>
                              <CircularProgressbar
                                value={score * 10}
                                text={`${score}/10 `}
                                strokeWidth={10}
                                styles={buildStyles({
                                  textSize: '16px',
                                  pathColor: color,
                                  textColor: color,
                                  trailColor: '#d6d6d6'
                                })}
                              />
                            </div>
                            <p className='text-[12px] text-white mt-2'>
                              {metric}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
              <div className='flex justify-end'>
                <button onClick={closeModal} className='text-red-500'>
                  Close
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </Dialog>
  );
};

export default ResultModal;
