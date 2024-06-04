import styled from "styled-components";
import { ButtonVariantEnum } from "../../enums";
import { withPopup } from "../../hoc";
import { useHandleDeleteTrucks, useSelection } from "../../hooks";
import { AddTruckForm } from "../AddTruckForm";
import { Button } from "../Button";
import { Divider } from "../Divider";
import { ITruck } from "../../interfaces";

const TopBarContainer = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  height: 80px;
  background-color: var(--background-color);
  z-index: 1;
  box-shadow: var(--box-shadow-primary);
  box-sizing: border-box;
  border-bottom: var(--border);
`;

const Logo = styled.img`
  height: 60px;
  width: auto;
  object-fit: contain;
  background: none;
  padding-right: 10px;
`;

const HeaderImage = styled.img`
  height: 60px;
  width: auto;
  object-fit: contain;
  background: none;
`;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  background: none;
  cursor: var(--cursor-pointer);
`;

const ButtonGroup = styled.div`
  display: flex;
  background-color: inherit;

  button + button {
    margin-left: 20px;
  }
`;

const AddTruckFormButton = withPopup(Button, AddTruckForm);

export const TopBar = () => {
  const { selectedItems } = useSelection<ITruck>();
  const { handleDeleteTrucks } = useHandleDeleteTrucks();
  const hasSelectedItems: boolean = selectedItems.length > 0;

  return (
    <TopBarContainer>
      <ImageWrapper>
        <Logo src="/src/assets/header-logo.png" alt="Logo" />
        <HeaderImage src="/src/assets/header-img.png" alt="Header Image" />
      </ImageWrapper>
      <ButtonGroup>
        <AddTruckFormButton text="Add Truck" />
        <Divider $vertical />
        <Button
          text={`Delete ${selectedItems.length} Trucks(s)`}
          $variant={ButtonVariantEnum.Warning}
          onClick={handleDeleteTrucks(selectedItems)}
          disabled={!hasSelectedItems}
        />
      </ButtonGroup>
    </TopBarContainer>
  );
};
