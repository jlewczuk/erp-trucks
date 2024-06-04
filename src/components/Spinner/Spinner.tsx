import styled from "styled-components";
import { rotate } from "../../helpers";

interface SpinnerOverlayProps {
  position?: "fixed" | "relative" | "absolute";
}

const SpinnerOverlay = styled.div<SpinnerOverlayProps>`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: var(--top-z-index);
  position: ${(props) => props.position || "fixed"};
  ${(props) => props.position || "fixed"};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const SpinnerContainer = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(195, 195, 195, 0.6);
  border-radius: 50%;
  border-top-color: #636767;
  animation: ${rotate} 0.8s linear infinite;
`;

export const Spinner = ({ position }: SpinnerOverlayProps) => {
  return (
    <SpinnerOverlay position={position} data-testid="spinner-overlay">
      <SpinnerContainer />
    </SpinnerOverlay>
  );
};
