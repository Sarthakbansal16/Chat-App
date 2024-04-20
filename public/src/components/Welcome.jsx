import React from 'react'
import styled from 'styled-components';
import robot from "../assets/robot.gif";

export default function Welcome({currentUser}) {
  console.log(currentUser);
  return (
    <Container>
      <img src={robot} alt="Robot"/>
      <h1>
          Welcome, <span>{currentUser.username}!</span> 
      </h1>
      <h3>Please Select a chat to start Messaging</h3>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #fff;

  img {
    height: 20rem;
  }

  span {
    color: #4e0eff;
  }
`;
