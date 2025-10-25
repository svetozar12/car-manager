import { MemoryRouter } from 'react-router-dom';
import { Web } from "./web.js";
    
export const WebBasic = () => {
  return (
    <MemoryRouter>
      <Web />
    </MemoryRouter>
  );
}