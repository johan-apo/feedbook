import { createContext, useContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

const SearchModalContext = createContext<
  [boolean, Dispatch<SetStateAction<boolean>>]
>(null!);

export const useSearchModal = () => useContext(SearchModalContext)!;

type MessageRecipient = {
  picture: string | null;
  id: string;
  username: string;
};

const MessageRecipientContext = createContext<
  [MessageRecipient | null, Dispatch<SetStateAction<MessageRecipient | null>>]
>(null!);

export const useMessageRecipient = () => useContext(MessageRecipientContext)!;

type ChatProviderProps = {
  children: React.ReactNode;
};

const ChatProvider = ({ children }: ChatProviderProps) => {
  const searchModalState = useState(false);
  const messageRecipientState = useState<MessageRecipient | null>(null);

  return (
    <SearchModalContext.Provider value={searchModalState}>
      <MessageRecipientContext.Provider value={messageRecipientState}>
        {children}
      </MessageRecipientContext.Provider>
    </SearchModalContext.Provider>
  );
};

export default ChatProvider;
