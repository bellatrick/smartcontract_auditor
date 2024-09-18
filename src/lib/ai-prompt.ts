import { GoogleGenerativeAI } from '@google/generative-ai';

const api_key = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
export const analyzeContract = async (
  contract: any,
  setResults: any,
  setLoading: any
) => {
  setLoading(true);
  const genAI = new GoogleGenerativeAI(api_key);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
  Your role and goal is to be an AI smart contract auditor. Your job is to perform an audit on this smart contract: ${contract} and provide a detailed report of the findings.

  Please return only a JavaScript array of findings with no markdown, no code blocks, no text formatting of any kind. Do not include any headers, text outside the array, or formatting. Return just the array for direct frontend consumption. Ensure that the result is a pure array and includes no additional text or comments. Return only the array for immediate use in a method like arr.find() without further modification."

    [
    {
    'section':'Audit Report',
    'details':'A detailed audit report of the smart contract, covering security, performance, and any other relevant aspects.'
    },
    {
    'section':'Metric Scores',
    'details':[
    {
    'metric':'Security',
    'score':0-10
    },
      {
    'metric':'Performance',
    'score':0-10
    },
        {
    'metric':'other key areas',
    'score':0-10
    },
          {
    'metric':'Gas Efficiency',
    'score':0-10
    },
    {
    'metric':'Code Quality',
    'score':0-10
    },
  {
    'metric':'Documentation',
    'score':0-10
    },
    ]
    },
      {
    'section':'Suggestion for Improvement',
    'details':'Suggestion for improving the smart contract in terms of security, performance any other identified weaknesses'
    },
    ]
  Thank you.
    `;

  const result = await model.generateContent(prompt);
  const auditResult = result.response.text();

  const cleanedOutput: any = cleanAuditReport(auditResult);

  const data = {
    audit_report: cleanedOutput.find(
      (item: { section: string }) => item.section === 'Audit Report'
    ).details,
    metrics: cleanedOutput.find(
      (item: { section: string }) => item.section === 'Metric Scores'
    ).details,
    suggestion: cleanedOutput.find(
      (item: { section: string }) =>
        item.section === 'Suggestion for Improvement'
    ).details
  };
  setLoading(false);
  setResults(data);

  return data;
};

function removeMarkdown(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(removeMarkdown);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, removeMarkdown(value)])
    );
  } else if (typeof obj === 'string') {
    return obj
      .replace(/^##\s+/gm, '') // Remove ## headings
      .replace(/^\#\s+/gm, '') // Remove # headings
      .replace(/^###\s+/gm, '') // Remove ## headings
      .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold text
      .replace(/(\*|_)(.*?)\1/g, '$2') // Remove italic text
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .trim(); // Trim whitespace
  }
  return obj;
}
function cleanAuditReport(output: string) {
  // Use a regular expression to remove any leading text and non-JSON content
  const cleanedString = output
    .replace(/.*\[\s*/, '[') // Remove everything before the opening bracket
    .replace(/\s*\]\s*$/, ']'); // Remove any trailing text after the closing bracket

  // Parse the cleaned string into a JavaScript array
  let resultArray;
  try {
    resultArray = JSON.parse(cleanedString);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    resultArray = [];
  }

  // Clean the array
  return removeMarkdown(resultArray);
}
