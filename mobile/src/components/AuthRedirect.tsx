import { useRouter, useRootNavigationState } from "expo-router";
import { FC, useContext, useEffect } from "react";
import "react-native-get-random-values";

import { UserSessionContext } from "@/providers/UserSession";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { useNavigation, CommonActions } from '@react-navigation/native';


const AuthRedirect: FC<{ children: React.ReactElement }> = ({ children }) => {
  const router = useRouter();
  const state = useRootNavigationState();
  const routeName = state.routes[state.routes.length - 1].name;
  const { isAuthentizating, session } = useContext(UserSessionContext);
  const navigation = useNavigation()

  useEffect(() => {
    if (!isAuthentizating) {
      if (!session && !routeName.startsWith("auth")) {
        // Redirect to the auth screen if the user is not authenticated
        // and the current route is not the auth screen.
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'auth' }],
          })
        );
      } else if (session && routeName.startsWith("auth")) {
        // Redirect to the home screen if the user is authenticated
        // and the current route is the auth screen.
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: '(tabs)' }],
          })
        );
      }
    }
  }, [isAuthentizating, session, routeName]);

  if (isAuthentizating) {
    return <LoadingScreen />;
  }

  return children;
};

export default AuthRedirect;
