import Users from "@/components/Users";
import { serverClient } from "./_trpc/serverClient";

export default async function Home() {
  const users = await serverClient.getAllUsers();

  return (
    <div className="p-4">
      <Users initialData={users} />
    </div>
  );
}
