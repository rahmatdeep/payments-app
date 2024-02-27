import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export const Users = ({ name }) => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/user/bulk?filter=" + filter, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setUsers(response.data.user);
      });
  }, [filter]);

  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="my-2">
        <input
          onChange={(e) => {
            setFilter(e.target.value.toLowerCase());
          }}
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        ></input>
      </div>
      <div>
        {users.map((user) => (
          <User key={uuidv4()} user={user} name={name} />
        ))}
      </div>
    </>
  );
};

function User({ user, name }) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {user.firstName[0].toUpperCase()}
          </div>
        </div>
        <div className="flex flex-col justify-center h-ful">
          <div>
            {`${user.firstName[0].toUpperCase()}${user.firstName.slice(1)}`}{" "}
            {`${user.lastName[0].toUpperCase()}${user.lastName.slice(1)}`}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center h-ful">
        <Button
          onClick={(e) => {
            if (name === user.firstName) {
              alert("Cannot Send money to yourself");
            } else {
              navigate(`/send?id=` + user._id + "&firstName=" + user.firstName);
            }
          }}
          label={"Send Money"}
        />
      </div>
    </div>
  );
}
