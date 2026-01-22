import MyProfileClient from "./my-profile-client";

export { metadata } from "./metadata";

export const dynamic = 'force-dynamic';

export default function MyProfilePage() {
  return <MyProfileClient />;
}
