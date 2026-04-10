import { css } from '@linaria/core';

const overlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const modalStyle = css`
  background: white;
  padding: 24px;
  border-radius: 8px;
  min-width: 300px;
  max-width: 500px;
`;

export const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className={overlayStyle} onClick={onClose}>
      <div className={modalStyle} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
