import { useState} from 'react'

export const useStreaming = (initialValue = '') => {
  const [streamedText, setStreamedText] = useState(initialValue)
  const [isStreaming, setIsStreaming] = useState(false)
  
  const startStreaming = (text: string) => {
    setIsStreaming(true)
    setStreamedText('')
    
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setStreamedText(prev => prev + text.charAt(index))
        index++
      } else {
        clearInterval(interval)
        setIsStreaming(false)
      }
    }, 20)
  }
  
  const resetStream = () => {
    setStreamedText('')
    setIsStreaming(false)
  }
  
  return {
    streamedText,
    isStreaming,
    startStreaming,
    resetStream
  }
}