import { Main } from "./app/screens/Main";
import { UserSessionProvider } from "./app/providers/UserSession";
import { FoundStatuesProvider } from "./app/providers/FoundStatues";

export default function App() {
  return (
    <UserSessionProvider>
      <FoundStatuesProvider>
        <Main />
      </FoundStatuesProvider>
    </UserSessionProvider>
  );
}
