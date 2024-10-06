import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllUsers } from "../reducers/usersReducer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const UserPage = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);

  console.log(users);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  if (!users || users.length === 0) {
    return <div className="max-w-4xl mx-auto">Loading users...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Blog Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Link to={`/users/${user.id}`}>{user.username}</Link>
              </TableCell>
              <TableCell>{user.blogs.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserPage;
