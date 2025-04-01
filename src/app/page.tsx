import { redirect } from "next/navigation";

/**
 * HomePage Component
 * 
 * This component automatically redirects users to the login page ("/login").
 * 
 * @returns {void} No UI is rendered as the page immediately redirects.
 * 
 * Alternative Approach:
 * Instead of using `redirect("/login")`, you can use `useRouter().push("/login")`
 * 
 */

export default function HomePage() {
  redirect("/login"); // Redirects the user to the login page
}
