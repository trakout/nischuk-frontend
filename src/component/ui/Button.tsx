import { css } from '@linaria/core';

const buttonStyle = css`
  background: blue;
`;

export const Button = () => <button className={buttonStyle}>Click</button>;
