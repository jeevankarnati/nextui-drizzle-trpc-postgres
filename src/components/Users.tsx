"use client";

import { trpc } from "@/app/_trpc/client";
import { ServerTypes } from "@/app/_trpc/serverClient";
import { useClient } from "@/lib/useClient";
import { luxonDate } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Checkbox,
  Chip,
  Tooltip,
} from "@nextui-org/react";
import { DateTime } from "luxon";
import { useState } from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Edit, Trash2 } from "lucide-react";

type Props = {
  initialData: ServerTypes<"getAllUsers">;
};

const Users: React.FC<Props> = ({ initialData }) => {
  const getAllUsers = trpc.getAllUsers.useQuery(undefined, {
    initialData,
  });

  const [data, setData] = useState({
    name: "",
    age: "",
    isActive: false,
  });
  const [editId, setEditId] = useState<number | null>(null);

  const { isClient } = useClient();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const utils = trpc.useUtils();

  const createUser = trpc.createUser.useMutation({
    onSettled: () => {
      setData({ name: "", age: "", isActive: false });
      utils.invalidate(undefined, { queryKey: ["getAllUsers"] });
      onClose();
    },
  });

  const deleteUser = trpc.deleteUser.useMutation({
    onSettled: () => {
      utils.invalidate(undefined, { queryKey: ["getAllUsers"] });
    },
  });

  const updateUser = trpc.updateUser.useMutation({
    onSettled: () => {
      setData({ name: "", age: "", isActive: false });
      utils.invalidate(undefined, { queryKey: ["getAllUsers"] });
      onClose();
      setEditId(null);
    },
  });

  const handleCreate = () => {
    createUser.mutate({
      ...data,
      age: Number(data.age),
      createdAt: DateTime.now().toISO(),
      updatedAt: DateTime.now().toISO(),
    });
  };

  const handleUpdate = () => {
    if (editId) {
      updateUser.mutate({
        ...data,
        id: editId,
        age: Number(data.age),
        updatedAt: DateTime.now().toISO(),
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Button
          onPress={() => {
            onOpen();
            setEditId(null);
          }}
        >
          Create User
        </Button>
        <ThemeSwitcher />
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {editId ? "Update" : "Create"} User
          </ModalHeader>
          <ModalBody>
            {/* <div className="flex flex-col gap-2"> */}
            <Input
              placeholder="Name"
              isRequired
              value={data.name}
              onValueChange={(e) => setData((prev) => ({ ...prev, name: e }))}
              radius="sm"
            />
            <Input
              placeholder="Age"
              type="number"
              isRequired
              value={data.age}
              onValueChange={(e) => setData((prev) => ({ ...prev, age: e }))}
              radius="sm"
            />
            <Checkbox
              isSelected={data.isActive}
              onValueChange={(e) =>
                setData((prev) => ({ ...prev, isActive: e }))
              }
              radius="sm"
            >
              is Active
            </Checkbox>
            {/* </div> */}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button
              color="primary"
              isDisabled={data.name === "" || data.age === ""}
              onPress={() => {
                editId ? handleUpdate() : handleCreate();
              }}
              isLoading={editId ? updateUser.isPending : createUser.isPending}
              radius="sm"
            >
              {editId ? "Update" : "Submit"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Table aria-label="Example static collection table" radius="sm">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>AGE</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
          <TableColumn>UPDATED AT</TableColumn>
          <TableColumn>ACTION</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={getAllUsers.isLoading || getAllUsers.isFetching}
          emptyContent={
            getAllUsers.data && getAllUsers.data.length > 0
              ? undefined
              : "No rows to display."
          }
        >
          {getAllUsers.data &&
            getAllUsers.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.age}</TableCell>
                <TableCell>
                  {user.isActive ? (
                    <Chip color="success">Active</Chip>
                  ) : (
                    <Chip color="danger">Inactive</Chip>
                  )}
                </TableCell>
                <TableCell>
                  {isClient
                    ? luxonDate(user.createdAt).toFormat("ff")
                    : user.createdAt.split("T")[0]}
                </TableCell>
                <TableCell>
                  {isClient
                    ? luxonDate(user.updatedAt).toFormat("ff")
                    : user.updatedAt.split("T")[0]}
                </TableCell>
                <TableCell>
                  <div className="relative flex items-center">
                    <Tooltip color="primary" content="Edit user">
                      <button
                        onClick={() => {
                          setEditId(user.id);
                          setData({
                            name: user.name,
                            age: String(user.age),
                            isActive: user.isActive,
                          });
                          onOpen();
                        }}
                        className="text-lg text-primary cursor-pointer active:opacity-50"
                      >
                        <Edit size={18} />
                      </button>
                    </Tooltip>
                    <Tooltip color="danger" content="Delete user">
                      <Button
                        onPress={() => {
                          deleteUser.mutate({ id: user.id });
                        }}
                        isIconOnly
                        className="bg-transparent text-lg text-danger cursor-pointer active:opacity-50 p-0"
                        size="sm"
                        isLoading={deleteUser.isPending}
                      >
                        <Trash2 size={20} />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Users;
