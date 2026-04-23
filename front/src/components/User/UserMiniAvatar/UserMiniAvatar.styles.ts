import styled from 'styled-components';

export const UserMiniAvatarContainer = styled.div<{ onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void }>`
  height: 5%;
  width: 250px;
  border: none;
  margin: 0;
  padding: 10px;
  background-color: white;
  display: flex;
  justify-content: space-between;
`;

export const Avatar = styled.img<{ $isOpen: boolean }>`
  /* width: 50px;
  height: 50px; */
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid ${props => (props.$isOpen ? '#007bff' : 'transparent')};
  transition: border 0.2s ease;
`;

export const Label = styled.img`
  max-width: 40px;
  max-height: 40px;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  width: 200px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
  z-index: 1000;
`;

export const DropdownItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: #f5f5f5;
  }
  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

export const UserName = styled.div`
  margin: auto 0;
`;
