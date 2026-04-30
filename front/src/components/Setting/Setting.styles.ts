import styled from "styled-components";

export const SettingContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  height: 80%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

export const FlexSettingContainer = styled.div`
  display: grid;
  grid-template-columns: 34% 2% 74%;
  grid-template-areas: 
  "l s m"
  ;
`

export const Stick = styled.span`
  grid-area: s;
  width: 1px;
  background-color: black;
  height: 100%;
`

export const SettingListContainer = styled.div`
  grid-area: l;
  margin-left: 20px;
`

export const ManagingSettingContainer = styled.div`
  grid-area: m;
`

export const ItemSetting = styled.span`
  display: flex;
  flex-direction: column;
  padding: 5px 0;
  cursor: pointer;

  &:hover {
    color: red;
  }
`

export const Title = styled.h2`
  margin-left: 20px;
`

export const Close = styled.span`
  position: absolute;
  top: 20px;
  right: 30px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;

  &:hover {
    color: red;
  }

  &:active {
    color: black;
  }
`;