"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
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

type User = {
  _id: string;
  name: string;
  age: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const Users: React.FC = () => {
  const users = useQuery(api.users.getAllUsers) as User[] | undefined;

  const createUser = useMutation(api.users.createUser);
  const updateUser = useMutation(api.users.updateUser);
  const deleteUser = useMutation(api.users.deleteUser);

  const [data, setData] = useState({
    name: "",
    age: "",
    isActive: false,
  });
  const [editId, setEditId] = useState<string | null>(null);

  const { isClient } = useClient();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleCreate = async () => {
    await createUser({
      ...data,
      age: Number(data.age),
      createdAt: DateTime.now().toISO(),
      updatedAt: DateTime.now().toISO(),
    });
    setData({ name: "", age: "", isActive: false });
    onClose();
  };

  const handleUpdate = async () => {
    if (editId) {
      await updateUser({
        ...data,
        id: editId,
        age: Number(data.age),
        updatedAt: DateTime.now().toISO(),
      });
      setData({ name: "", age: "", isActive: false });
      setEditId(null);
      onClose();
    }
  };

  const handleDelete = async (id: string) => {
    await deleteUser({ id });
  };

  const list = users ?? [];
  const isLoading = users === undefined;

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
          isLoading={isLoading}
          emptyContent={list.length > 0 ? undefined : "No rows to display."}
        >
          {list.map((user) => (
            <TableRow key={user._id}>
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
                        setEditId(user._id);
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
                      onPress={() => handleDelete(user._id)}
                      isIconOnly
                      className="bg-transparent text-lg text-danger cursor-pointer active:opacity-50 p-0"
                      size="sm"
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
