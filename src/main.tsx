import { createRoot } from 'react-dom/client'
import '@ant-design/v5-patch-for-react-19';
import { Provider } from 'react-redux';

import { RouterProvider } from 'react-router-dom'
import { router } from './router/index.tsx'
import { store } from './store/index.ts';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
