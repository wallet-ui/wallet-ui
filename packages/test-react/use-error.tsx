import { useRef, useState } from 'react'

export function useError() {
  const { current: NO_ERROR } = useRef(Symbol())
  const [error, setError] = useState<unknown>(NO_ERROR)

  return {
    error,
    hasError: error !== NO_ERROR,
    setError,
    resetError: () => setError(NO_ERROR),
  }
}
