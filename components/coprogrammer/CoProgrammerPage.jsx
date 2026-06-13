'use client'

import { useState } from 'react'
import React from 'react'
import WorkspaceLayout from '@/components/layout/WorkspaceLayout'
import WorkspaceHeader from '@/components/layout/WorkspaceHeader'
import CodeEditor from './CodeEditor'
import AnalysisPanel from './AnalysisPanel'
import { analyseCode, detectLanguageWithAI } from '@/app/lib/analyseCode'
import { useUser } from '@/utils/hooks/useUser'

export default function CoProgrammerPage() {
  const [code, setCode] = useState(`// Write or paste your code here...`)
  const [detectedLang, setDetectedLang] = useState('typescript')
  const [instruction, setInstruction] = useState('')
  const [analysedCode, setAnalysedCode] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { username, loading: userLoading } = useUser()

  async function handleCodeChange(newCode) {
    setCode(newCode)
    setError('')
    // Auto-detect language using AI when code changes
    if (newCode.trim().length > 0) {
      const lang = await detectLanguageWithAI(newCode)
      setDetectedLang(lang)
    }
  }

  async function handleAnalyse() {
    if (!code.trim()) return 
    setLoading(true)
    setError('')
    setAnalysis('')
    setAnalysedCode('')
    try {
      const result = await analyseCode(code, detectedLang, instruction)
      setAnalysedCode(result.modifiedCode)
      setAnalysis(result.explanation)
    } catch (e) {
      console.error('Analysis error:', e);
      const errorMsg = e.message?.includes('JSON') 
        ? 'The analysis service returned an unexpected response format. Please try a different code snippet.'
        : e.message?.includes('timeout')
        ? 'Analysis is taking too long. Try with simpler or shorter code.'
        : e.message?.includes('empty')
        ? 'Your code appears to be empty. Please paste some code to analyze.'
        : 'Unable to analyze your code. Please try again.';
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  function handleCodeApply(newCode) {
    setCode(newCode)
  }

  return (
    <WorkspaceLayout activeItem="coprogrammer">
      <WorkspaceHeader mode="Co-Programmer" sessionId="SES-0042" username={username} />
      <div className="flex-1 flex overflow-hidden">
        <CodeEditor
          code={code}
          instruction={instruction}
          onCodeChange={handleCodeChange}
          onInstructionChange={setInstruction}
          onAnalyse={handleAnalyse}
          isAnalyzing={loading}
          detectedLanguage={detectedLang}
        />
        <AnalysisPanel
          analysedCode={analysedCode}
          analysis={analysis}
          originalCode={code}
          onCodeApply={handleCodeApply}
          error={error}
          loading={loading}
        />
      </div>
    </WorkspaceLayout>
  )
}
