import { useEffect, useState, useRef } from "react";
import { sendIcon } from "../../assets/icons";
import { io, Socket } from "socket.io-client";
import { ICurrentUser } from "../../interfaces/auth";
import { useAppSelector } from "../../App";
import { IMessage } from "../../interfaces/chat";
import MetroSpinner from "../../components/UI/MetroSpinner";
import MessageChat from "../../components/MessageChat";
import moment from "moment";
import { fetchAllChatsAPI } from "../../apiRoutes/staff";

const Chats = () => {
  const socket = useRef<Socket | null>();
  const [message, setMessage] = useState<string>("");
  const [allMessages, setAllMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const staff = useAppSelector<ICurrentUser | null>(
    (state) => state.currentUser
  );

  // Initializing socket and fetching all chats in the room (role based)
  useEffect(() => {
    setLoading(true);

    fetchAllChatsAPI()
      .then(({ data: { data } }) => {
        setAllMessages(data);
      })
      .catch(() => setAllMessages([]))
      .finally(() => setLoading(false));

    // Initializing io connection
    socket.current = io(import.meta.env.VITE_BACKEND_CHAT as string);

    //emitting join to server
    socket.current.emit("join", {
      role: "staff",
    });

    // Listening message from server
    socket.current.on(
      "getMessage",
      ({ userId, userName, message, role, date, profilePic }) =>
        setAllMessages((prev) => [
          { userId, userName, role, message, date, profilePic },
          ...prev,
        ])
    );

    // Log errors
    socket.current.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }, []);

  const chatMessageHandler = () => {
    message === "" && null;
    // emitting message to server
    socket.current?.emit("sendMessage", {
      userId: staff?.currentUser?._id,
      userName: staff?.currentUser?.name.split(" ")[0],
      role: "staff",
      message,
      date: Date.now(),
      profilePic: staff?.currentUser.profilePic,
    });

    return setMessage("");
  };

  return (
    <div className="parent-container md:relative">
      <h2>Staff Chat Room</h2>

      <div className="bg-[#F5f5f5] h-96 rounded shadow-sm mb-3">
        <div className="h-80 flex flex-col-reverse overflow-y-auto">
          {!loading ? (
            allMessages.map(
              ({ date, message, profilePic, userName, userId }, i) => (
                <MessageChat
                  key={`${date}${i}`}
                  date={`${moment(date).format("LT")} ${moment(date).format(
                    "L"
                  )}`}
                  message={message}
                  profilePic={profilePic}
                  userName={userName}
                  self={userId === staff?.currentUser._id}
                />
              )
            )
          ) : (
            <MetroSpinner className="my-auto" size={40} color="skyblue" />
          )}
        </div>
        <div className="px-5 py-1">
          <div className="border-t-2">
            <div className="flex items-center mt-5 mx-auto w-2/3 bg-white px-3 rounded-full shadow-md mb-4">
              {/* Message input */}
              <input
                type="text"
                required
                placeholder="Send a message..."
                className="grow p-2 focus:outline-none text-sm"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                onKeyDown={(e) => {
                  if (e.key === "Enter") return chatMessageHandler();
                }}
              />
              <img
                src={sendIcon}
                className="h-6 m-1 active:animate-ping"
                alt="send message"
                onClick={chatMessageHandler}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chats;
