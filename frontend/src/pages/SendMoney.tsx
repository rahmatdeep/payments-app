import axios from "axios";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const firstName = searchParams.get("firstName");
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();
  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <div className="h-full flex flex-col justify-center">
        <div className="border h-min max-w-md p-4  w-96 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col px-4 py-4">
            <h2 className="text-3xl font-bold text-center">Send Money</h2>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-2xl text-white">
                  {firstName[0].toUpperCase()}
                </span>
              </div>
              <h3 className="text-2xl font-semibold">{`${firstName[0].toUpperCase()}${firstName.slice(
                1
              )}`}</h3>
            </div>
            <div className="space-y-4">
              <div className="mt-3">
                <label
                  className="pl-1 text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-500"
                  htmlFor="amount"
                >
                  Amount (in Rs)
                </label>
                <input
                  type="number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  id="amount"
                  placeholder="Enter amount"
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                />
              </div>
              <button
                onClick={async () => {
                  try {
                    const response = await axios.post(
                      "http://localhost:3000/api/v1/account/transfer",
                      {
                        to: id,
                        amount,
                      },
                      {
                        headers: {
                          Authorization:
                            "Bearer " + localStorage.getItem("token"),
                        },
                      }
                    );
                    alert(response.data.msg);
                    navigate("/dashboard");
                  } catch (e) {
                    alert(e.response.data.msg);
                    navigate("/dashboard");
                  }
                }}
                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
              >
                Initiate Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
