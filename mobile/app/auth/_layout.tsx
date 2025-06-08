import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";

// For now Tablist is hidden, since it's imposible to style it properly
// You still need define route here to make it work
// Navigation is fully styled and using router.navigate to navigate
export default function Layout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList style={{ display: "none" }}>
        <TabTrigger name="home" href="/auth" />
        <TabTrigger name="email-signin" href="/auth/email-signin" />
        <TabTrigger name="register" href="/auth/register" />
        <TabTrigger name="password-reset" href="/auth/password-reset" />
        <TabTrigger
          name="password-reset-request"
          href="/auth/password-reset-request"
        />
      </TabList>
    </Tabs>
  );
}
