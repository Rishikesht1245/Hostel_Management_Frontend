import { defaultAvatarImg } from "../assets/images";
import { IMessageChat } from "../interfaces/chat";

// single message

const MessageChat = ({
  userName,
  message,
  profilePic,
  date,
  self,
}: IMessageChat) => {
  return (
    <div
      className={`flex mx-3 mb-3 w-3/4 md:w-1/2 ${
        self && "ml-auto justify-end"
      }`}
    >
      <img
        src={profilePic || defaultAvatarImg}
        className="mt-2 w-8 h-8 rounded-full border p-[1px]"
        alt="chat avatar"
      />
      {/* Name and message */}
      <div className="flex flex-col text-xs justify-between bg-white shadow-lg py-2 px-4 max-h-max rounded-md">
        <span className={`font-semibold text-primary`}>{`${userName} ${
          self ? "(You)" : ""
        }`}</span>
        <p className="text-primary my-1">{message}</p>
        <span className="font-medium text-[10px] ml-auto mt-1">{date}</span>
      </div>
    </div>
  );
};
export default MessageChat;
