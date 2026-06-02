'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export function useUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        setUser(user)
      } catch (err) {
        console.error('Error fetching user:', err)
        setError(err.message)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  // Get username from user metadata
  const username = user?.user_metadata?.full_name || user?.email || 'Guest'

  return { user, username, loading, error }
}
