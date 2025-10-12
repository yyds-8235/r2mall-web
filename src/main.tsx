import { createRoot } from 'react-dom/client'
import '@ant-design/v5-patch-for-react-19';
import { Provider } from 'react-redux';

import { RouterProvider } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd';
import { router } from './router/index.tsx'
import { store } from './store/index.ts';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#d4380d',
          colorSuccess: '#fa541c',
          colorInfo: '#ff4d4f',
          colorWarning: '#ff7a45',
          colorError: '#cf1322',
          colorLink: '#cf1322'
        }
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  </Provider>
)
