import { useEffect, useState } from "react";
import { Appbar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [name, setName] = useState("name");

  const navigate = useNavigate();
  useEffect(() => {
    async function getInfo() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/user/user-info",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBalance(response.data.account.balance);
        setName(response.data.user.firstName);
      } catch (e) {
        navigate("/signin");
      }
    }
    getInfo();
  }, []);

  return (
    <div>
      <Appbar name={name} />
      <div className="m-8">
        <Balance value={balance} />
        <Users name={name} />
      </div>
    </div>
  );
}
