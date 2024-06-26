import React, { useState, useEffect,useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute ,host} from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";

// Chat
function Chat (){
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded,setIsLoaded] = useState(false);
  // fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!localStorage.getItem("chat-user-app"))
        {return navigate("/login");}
      else{
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-user-app")));
        setIsLoaded(true)
      }
    };
    fetchCurrentUser();
  }, []); // eslint-disable-line

  // Socket.io add user
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  // Fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      if (currentUser) {
        if (!currentUser.isAvatarImageSet) return navigate("/setAvatar");
        else {const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);}
      }
    };

    fetchAllUsers();
  }, [currentUser]); // eslint-disable-line

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };


  return (
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat = {handleChatChange}
        />
        {
          isLoaded && currentChat === undefined ? 
          <Welcome currentUser={currentUser}/> :
          <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>
        }
      </div>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: rgba(0, 0, 0, 0.463);
    display: grid;
    grid-template-columns: 25% 75%;
    border-radius: 2rem;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;