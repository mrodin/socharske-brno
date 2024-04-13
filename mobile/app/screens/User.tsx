import "react-native-url-polyfill/auto"
import { useState, useEffect } from "react"
import { supabase } from "../utils/supabase"
import { Auth } from "../components/Auth"
import Account from "../components/Account"
import { View } from "react-native"
import { Session } from "@supabase/supabase-js"
import { Button } from "react-native-elements"

export function User() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <View>
      {session && session.user ? (
        <Account key={session.user.id} session={session} />
      ) : (
        <Auth />
      )}
    </View>
  )
}
